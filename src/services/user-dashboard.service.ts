import {
    AppDataSource
} from "../config/database";


import {
    UserBook
} from "../entities/user-book.entity";


export class UserDashboardService {



    private repository =

        AppDataSource.getRepository(UserBook);





    async getDashboard(

        userBookId: number,

        userId: number

    ) {



        const book =

            await this.repository.findOne({

                where: {

                    id: userBookId,

                    user: {
                        id: userId
                    }

                },


                relations: {


                    book_copy: {

                        book: true

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


                }


            });





        /*
            زيارة المحافظة تُسجَّل كـ UserVisit أيضاً،
            لذلك عدّ كل الزيارات كان يضخّم رقم الأماكن.
            نعدّ الأماكن المتمايزة فقط.
        */

        const visitedPlaceIds =

            new Set(

                (book?.visits ?? [])

                    .filter((visit) => visit.place)

                    .map((visit) => visit.place!.id)

            );



        return {


            book: book?.book_copy?.book,



            stats: {


                placesVisited:

                    visitedPlaceIds.size,


                completedChallenges:

                    book?.challenges.filter(

                        item => item.completed

                    ).length || 0,



                collectedStamps:

                    book?.stamps.length || 0



            },




            recentVisits:

                book?.visits.slice(0, 5),



            recentChallenges:

                book?.challenges.slice(0, 5),



            recentStamps:

                book?.stamps.slice(0, 5)


        };



    }



}