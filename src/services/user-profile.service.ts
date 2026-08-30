import {
    AppDataSource
} from "../config/database";


import {
    User
} from "../entities/user.entity";


import {
    ApiError
} from "../utils/api-error";



export class UserProfileService {



    private repository =
        AppDataSource.getRepository(User);





    async getProfile(
        userId: number
    ) {


        const user =

            await this.repository.findOne({

                where: {
                    id: userId
                },

                select: {
                    id: true,
                    name: true,
                    phone: true,
                    email: true,
                    image: true,
                    status: true,
                    created_at: true
                }

            });



        if (!user) {

            throw new ApiError(
                404,
                "User not found"
            );

        }



        return user;


    }








    async updateProfile(

        userId: number,

        data: any

    ) {



        const user =

            await this.repository.findOne({

                where: {
                    id: userId
                }

            });



        if (!user) {

            throw new ApiError(
                404,
                "User not found"
            );

        }





        Object.assign(
            user,
            data
        );




        return await this.repository.save(user);


    }



}