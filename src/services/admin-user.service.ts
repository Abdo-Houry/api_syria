import {
    ObjectLiteral,
    Repository
} from "typeorm";


import {
    AppDataSource
} from "../config/database";


import {
    User
} from "../entities/user.entity";


import {
    UserBook
} from "../entities/user-book.entity";


import {
    UserVisit
} from "../entities/user-visit.entity";


import {
    UserChallenge
} from "../entities/user-challenge.entity";


import {
    UserStamp
} from "../entities/user-stamp.entity";


import {
    ApiError
} from "../utils/api-error";




/*
    قراءة بيانات المستخدمين للوحة الإدارة.

    القائمة تعطي نظرة سريعة (كم كتيّباً يملك وكم أنجز)، وصفحة التفاصيل
    تفصّل الإنجاز داخل كل نسخة كتيّب على حدة — لأن الرحلات مستقلّة تماماً
    عن بعضها، ودمجها في رقم واحد يخفي أين وصل فعلاً.
*/

export class AdminUserService {


    private userRepository =
        AppDataSource.getRepository(User);


    private userBookRepository =
        AppDataSource.getRepository(UserBook);




    /*
        عدّ سجلات مرتبطة بالمستخدمين في استعلام واحد مجمَّع.

        البديل — عدّ لكل مستخدم على حدة — يعني استعلاماً لكل صف في الجدول،
        وهذا يكفي أربعة استعلامات مهما بلغ عدد المستخدمين.
    */

    private async countByUser(
        repository: Repository<ObjectLiteral>,
        alias: string,
        onlyCompleted = false
    ): Promise<Map<number, number>> {


        const builder =

            repository

                .createQueryBuilder(alias)

                .innerJoin(
                    `${alias}.user`,
                    "user"
                )

                .select(
                    "user.id",
                    "userId"
                )

                .addSelect(
                    `COUNT(${alias}.id)`,
                    "total"
                )

                .groupBy("user.id");



        if (onlyCompleted) {

            builder.where(
                `${alias}.completed = :completed`,
                { completed: true }
            );

        }



        const rows =
            await builder.getRawMany();



        return new Map<number, number>(

            rows.map((row: { userId: number; total: string }) => [
                Number(row.userId),
                Number(row.total)
            ])

        );


    }




    async list() {


        const [
            users,
            bookCounts,
            visitCounts,
            challengeCounts,
            stampCounts
        ] = await Promise.all([

            this.userRepository.find({
                order: {
                    created_at: "DESC"
                }
            }),

            this.countByUser(
                this.userBookRepository,
                "userBook"
            ),

            this.countByUser(
                AppDataSource.getRepository(UserVisit),
                "visit"
            ),

            this.countByUser(
                AppDataSource.getRepository(UserChallenge),
                "challenge",
                true
            ),

            this.countByUser(
                AppDataSource.getRepository(UserStamp),
                "stamp"
            )

        ]);




        /* كلمة المرور لا تغادر الخادم مهما كان الدور. */

        return users.map((user) => ({

            id: user.id,

            name: user.name,

            phone: user.phone,

            email: user.email ?? null,

            image: user.image ?? null,

            status: user.status,

            created_at: user.created_at,

            books: bookCounts.get(user.id) ?? 0,

            placesVisited: visitCounts.get(user.id) ?? 0,

            challengesCompleted: challengeCounts.get(user.id) ?? 0,

            stampsCollected: stampCounts.get(user.id) ?? 0

        }));


    }




    async findById(
        id: number
    ) {


        const user =

            await this.userRepository.findOne({

                where: {
                    id
                }

            });



        if (!user) {

            throw new ApiError(
                404,
                "User not found"
            );

        }




        const userBooks =

            await this.userBookRepository.find({

                where: {
                    user: {
                        id
                    }
                },

                relations: {

                    book_copy: {
                        book: {
                            places: true,
                            challenges: true,
                            stamps: true
                        }
                    },

                    visits: {
                        place: true,
                        province: true
                    },

                    challenges: {
                        challenge: true
                    },

                    stamps: {
                        stamp: true
                    }

                },

                order: {
                    purchased_at: "DESC"
                }

            });




        const books =

            userBooks.map((userBook) => {


                const book =
                    userBook.book_copy?.book;


                /*
                    أماكن الاستكشاف بلا رمز QR فلا تُوثَّق زيارتها أبداً،
                    وإدخالها في المقام يجعل بلوغ 100% مستحيلاً.
                */
                const bookPlaceIds =
                    new Set(
                        (book?.places ?? [])
                            .filter((place) => !place.is_exploration)
                            .map((place) => place.id)
                    );


                const bookChallengeIds =
                    new Set(
                        (book?.challenges ?? [])
                            .map((challenge) => challenge.id)
                    );


                const bookStampIds =
                    new Set(
                        (book?.stamps ?? [])
                            .map((stamp) => stamp.id)
                    );



                /*
                    نحسب على المعرّفات الفريدة: المسح المتكرّر لرمز المكان
                    نفسه قد يترك أكثر من سجل زيارة، وعدّ السجلات يضخّم التقدّم.
                */

                const visitedPlaceIds =
                    new Set(
                        (userBook.visits ?? [])
                            .filter((visit) =>
                                visit.place &&
                                bookPlaceIds.has(visit.place.id)
                            )
                            .map((visit) => visit.place!.id)
                    );


                const completedChallengeIds =
                    new Set(
                        (userBook.challenges ?? [])
                            .filter((entry) =>
                                entry.completed &&
                                entry.challenge &&
                                bookChallengeIds.has(entry.challenge.id)
                            )
                            .map((entry) => entry.challenge!.id)
                    );


                const collectedStampIds =
                    new Set(
                        (userBook.stamps ?? [])
                            .filter((entry) =>
                                entry.stamp &&
                                bookStampIds.has(entry.stamp.id)
                            )
                            .map((entry) => entry.stamp!.id)
                    );



                const done =
                    visitedPlaceIds.size +
                    completedChallengeIds.size +
                    collectedStampIds.size;


                const total =
                    bookPlaceIds.size +
                    bookChallengeIds.size +
                    bookStampIds.size;



                return {

                    id: userBook.id,

                    active: userBook.active,

                    purchased_at: userBook.purchased_at,


                    copy: userBook.book_copy
                        ? {
                            id: userBook.book_copy.id,
                            serial_number: userBook.book_copy.serial_number,
                            version: userBook.book_copy.version
                        }
                        : null,


                    book: book
                        ? {
                            id: book.id,
                            name: book.name
                        }
                        : null,


                    progress: {

                        placesVisited: visitedPlaceIds.size,
                        placesTotal: bookPlaceIds.size,

                        challengesDone: completedChallengeIds.size,
                        challengesTotal: bookChallengeIds.size,

                        stampsCollected: collectedStampIds.size,
                        stampsTotal: bookStampIds.size,

                        overall:
                            total > 0
                                ? Math.round((done / total) * 100)
                                : 0

                    },


                    visits: (userBook.visits ?? []).map((visit) => ({

                        id: visit.id,

                        visited_at: visit.visited_at,

                        place: visit.place
                            ? {
                                id: visit.place.id,
                                name: visit.place.name
                            }
                            : null,

                        province: visit.province
                            ? {
                                id: visit.province.id,
                                name: visit.province.name
                            }
                            : null

                    })),


                    challenges: (userBook.challenges ?? []).map((entry) => ({

                        id: entry.id,

                        completed: entry.completed,

                        completed_at: entry.completed_at,

                        answer: entry.answer ?? null,

                        challenge: entry.challenge
                            ? {
                                id: entry.challenge.id,
                                title: entry.challenge.title
                            }
                            : null

                    })),


                    stamps: (userBook.stamps ?? []).map((entry) => ({

                        id: entry.id,

                        collected_at: entry.collected_at,

                        stamp: entry.stamp
                            ? {
                                id: entry.stamp.id,
                                name: entry.stamp.name,
                                image_url: entry.stamp.image_url
                            }
                            : null

                    }))

                };


            });




        return {

            user: {

                id: user.id,

                name: user.name,

                phone: user.phone,

                email: user.email ?? null,

                image: user.image ?? null,

                status: user.status,

                created_at: user.created_at

            },


            totals: {

                books: books.length,

                placesVisited: books.reduce(
                    (sum, item) => sum + item.progress.placesVisited,
                    0
                ),

                challengesCompleted: books.reduce(
                    (sum, item) => sum + item.progress.challengesDone,
                    0
                ),

                stampsCollected: books.reduce(
                    (sum, item) => sum + item.progress.stampsCollected,
                    0
                )

            },


            books

        };


    }


}
