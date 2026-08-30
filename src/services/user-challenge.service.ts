import {
    AppDataSource
} from "../config/database";


import {
    UserChallenge
} from "../entities/user-challenge.entity";


import {
    Challenge
} from "../entities/challenge.entity";


import {
    ApiError
} from "../utils/api-error";


import {
    UserBookService
} from "./user-book.service";




export class UserChallengeService {



    private repository =
        AppDataSource.getRepository(UserChallenge);



    private challengeRepository =
        AppDataSource.getRepository(Challenge);



    private userBookService =
        new UserBookService();






    async solve(

        userId: number,

        challengeId: number,

        answer: string,

        userBookId?: number

    ) {



        const challenge =

            await this.challengeRepository.findOne({

                where: {
                    id: challengeId
                }

            });




        if (!challenge) {
            throw new ApiError(
                404,
                "Challenge not found"
            );
        }
        /*
            التحدي متعدد الخيارات: تُقبل الإجابة فقط إن طابقت الخيار الصحيح
            (بنصّه أو برقمه).
        */
        if (
            Array.isArray(challenge.options) &&
            challenge.options.length &&
            challenge.correct_option != null
        ) {
            const correct =
                challenge.options[challenge.correct_option];
            const normalized = answer.trim();
            const isCorrect =
                normalized === correct ||
                normalized === String(challenge.correct_option);
            if (!isCorrect) {
                throw new ApiError(
                    400,
                    "Wrong answer"
                );
            }
            answer = correct;
        }




        /*
            العمود user_book_id غير قابل للإفراغ، وكان الحفظ يفشل
            لأن السجل كان يُنشأ بدونه.

            نحدّد نسخة الكتيّب من الطلب إن وُجدت، وإلا نستنتجها من
            الكتيّب الذي يحتوي هذا التحدي ضمن كتيّبات المستخدم.
        */

        const userBook =

            userBookId !== undefined

                ? await this.userBookService.getOwnedUserBook(
                    userId,
                    userBookId
                )

                : await this.userBookService.findUserBookContaining(
                    userId,
                    "challenges",
                    challengeId
                );



        if (!userBook) {

            throw new ApiError(
                403,
                "This challenge does not belong to any of your booklets"
            );

        }




        /*
            التحدي يجب أن ينتمي فعلاً إلى الكتيّب المحدّد
            حتى لا يُحتسب تقدّم في الكتيّب الخطأ.
        */

        const belongsToBook =

            (userBook.book_copy?.book?.challenges ?? []).some(

                (item) => item.id === challengeId

            );



        if (!belongsToBook) {

            throw new ApiError(
                403,
                "This challenge does not belong to the selected booklet"
            );

        }




        const old =

            await this.repository.findOne({

                where: {

                    user: {
                        id: userId
                    },

                    challenge: {
                        id: challengeId
                    },

                    userBook: {
                        id: userBook.id
                    }

                },

                relations: {
                    challenge: true
                }

            });




        if (old) {

            return old;

        }




        const userChallenge =

            this.repository.create({

                user: {
                    id: userId
                },

                challenge: {
                    id: challengeId
                },

                userBook: {
                    id: userBook.id
                },

                answer,

                completed: true

            });




        return await this.repository.save(
            userChallenge
        );


    }








    async getMyChallenges(

        userId: number,

        userBookId?: number

    ) {


        return await this.repository.find({

            where: {

                user: {
                    id: userId
                },

                ...(userBookId !== undefined
                    ? {
                        userBook: {
                            id: userBookId
                        }
                    }
                    : {})

            },

            relations: {

                challenge: true

            }

        });


    }



}
