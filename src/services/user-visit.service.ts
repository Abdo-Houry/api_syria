import {
    AppDataSource
} from "../config/database";


import {
    UserVisit
} from "../entities/user-visit.entity";



export class UserVisitService {



    private repository =
        AppDataSource.getRepository(UserVisit);




    /* هل سبق توثيق هذه الزيارة بعينها؟ */

    async hasVisit(
        data: any
    ): Promise<boolean> {


        const exists =

            await this.repository.findOne({

                where: data

            });


        return !!exists;


    }




    async createVisit(
        data: any
    ) {


        const exists =

            await this.repository.findOne({

                where: data

            });



        if (exists) {

            return exists;

        }



        const visit =

            this.repository.create(data);



        return await this.repository.save(visit);


    }





    /*
        userBookId اختياري: يحصر الزيارات في رحلة كتيّب واحد،
        وهو ما يمنع اختلاط التقدّم بين الكتيّبات
        عندما يظهر المكان نفسه في أكثر من كتيّب.
    */

    async getUserVisits(
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
                province: true,
                place: true
            },


            order: {
                visited_at: "DESC"
            }


        });


    }



}