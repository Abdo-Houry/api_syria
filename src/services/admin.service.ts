import { AppDataSource } from "../config/database";

import { Admin } from "../entities/admin.entity";

import bcrypt from "bcrypt";

import { ApiError } from "../utils/api-error";

import { generateToken } from "../utils/jwt";
import { UpdateAdminProfileInput } from "../validations/admin.validation";


export class AdminService {


    private repository =
        AppDataSource.getRepository(Admin);



    async login(
        username:string,
        password:string
    ){


        const admin =
            await this.repository.findOne({

                where:{
                    username
                }

            });



        if(!admin){

            throw new ApiError(
                401,
                "Invalid username or password"
            );

        }



        const isPasswordValid =
            await bcrypt.compare(

                password,

                admin.password

            );



        if(!isPasswordValid){

            throw new ApiError(
                401,
                "Invalid username or password"
            );

        }



        const token =
            generateToken({

                id:admin.id,

                username:admin.username,

                /*
                   مطلوب من adminAuthMiddleware
                   الذي يتحقق من role === "ADMIN"
                */
                role:"ADMIN"

            });



        return {

            admin:{
                id:admin.id,
                username:admin.username
            },

            token

        };


    }



    async getProfile(
        id: number
    ) {
        const admin =
            await this.repository.findOne({
                where: { id }
            });

        if (!admin) {
            throw new ApiError(
                404,
                "Admin not found"
            );
        }

        return {
            id: admin.id,
            username: admin.username
        };
    }

    /*
        تغيير اسم المستخدم و/أو كلمة المرور بعد التحقّق من كلمة المرور الحالية.
    */
    async updateProfile(
        id: number,
        data: UpdateAdminProfileInput
    ) {
        const admin =
            await this.repository.findOne({
                where: { id }
            });

        if (!admin) {
            throw new ApiError(
                404,
                "Admin not found"
            );
        }

        const valid =
            await bcrypt.compare(
                data.currentPassword,
                admin.password
            );

        if (!valid) {
            throw new ApiError(
                401,
                "Current password is incorrect"
            );
        }

        if (
            data.username !== undefined &&
            data.username !== admin.username
        ) {
            const taken =
                await this.repository.findOne({
                    where: {
                        username: data.username
                    }
                });

            if (taken) {
                throw new ApiError(
                    400,
                    "Username already taken"
                );
            }

            admin.username = data.username;
        }

        if (data.newPassword !== undefined) {
            admin.password =
                await bcrypt.hash(
                    data.newPassword,
                    10
                );
        }

        await this.repository.save(admin);

        /*
            التوكن يحمل اسم المستخدم، لذلك نعيد توكناً جديداً بعد التغيير.
        */
        const token =
            generateToken({
                id: admin.id,
                username: admin.username,
                role: "ADMIN"
            });

        return {
            admin: {
                id: admin.id,
                username: admin.username
            },
            token
        };
    }
}
