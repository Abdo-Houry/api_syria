import bcrypt from "bcrypt";

import { AppDataSource } from "../config/database";

import { Admin } from "../entities/admin.entity";

import { env } from "../config/env";


/* أدنى طول مقبول لكلمة مرور المشرف — حساب واحد يفتح لوحة التحكّم كاملة. */
const MIN_PASSWORD_LENGTH = 8;


const createAdmin = async()=>{


    /*
        كلمة المرور تأتي من البيئة لا من الكود.

        كانت مكتوبة هنا حرفياً، فأي نسخة من المشروع تعرف كلمة مرور
        لوحة التحكّم. الآن يتوقّف السكربت إن لم تُضبط، بدل أن ينشئ
        حساباً بكلمة مرور معروفة.
    */

    const username = env.ADMIN_USERNAME.trim();

    const password = env.ADMIN_PASSWORD;


    if(!password){

        console.error(
            "ADMIN_PASSWORD is not set — add it to .env then run this again."
        );

        process.exit(1);

    }


    if(password.length < MIN_PASSWORD_LENGTH){

        console.error(
            `ADMIN_PASSWORD must be at least ${MIN_PASSWORD_LENGTH} characters.`
        );

        process.exit(1);

    }



    await AppDataSource.initialize();



    const repository =
        AppDataSource.getRepository(Admin);



    const exists =
        await repository.findOne({

            where:{
                username
            }

        });



    if(exists){

        console.log(
            `Admin "${username}" already exists`
        );

        process.exit();

    }



    const hashedPassword =
        await bcrypt.hash(

            password,

            10

        );



    const admin =
        repository.create({

            username,

            password:hashedPassword

        });



    await repository.save(admin);



    console.log(
        `Admin "${username}" created successfully`
    );


    process.exit();

};



createAdmin();
