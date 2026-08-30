import bcrypt from "bcrypt";

import { AppDataSource } from "../config/database";

import { Admin } from "../entities/admin.entity";


const createAdmin = async()=>{


    await AppDataSource.initialize();



    const repository =
        AppDataSource.getRepository(Admin);



    const exists =
        await repository.findOne({

            where:{
                username:"admin"
            }

        });



    if(exists){

        console.log(
            "Admin already exists"
        );

        process.exit();

    }



    const hashedPassword =
        await bcrypt.hash(

            "123456",

            10

        );



    const admin =
        repository.create({

            username:"admin",

            password:hashedPassword

        });



    await repository.save(admin);



    console.log(
        "Admin created successfully"
    );


    process.exit();

};



createAdmin();