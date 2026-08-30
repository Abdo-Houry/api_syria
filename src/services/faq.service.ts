import {
    AppDataSource
} from "../config/database";


import {
    FAQ
} from "../entities/faq.entity";


import {
    ApiError
} from "../utils/api-error";


import {

    CreateFAQDTO,

    UpdateFAQDTO

} from "../models/faq.model";





export class FAQService {



    private repository =
        AppDataSource.getRepository(FAQ);







    async create(
        data: CreateFAQDTO
    ) {


        const faq =
            this.repository.create(data);



        return await this.repository.save(
            faq
        );


    }








    async findAll() {


        return await this.repository.find({

            order: {
                created_at: "DESC"
            }

        });


    }








    async findById(
        id: number
    ) {


        const faq =
            await this.repository.findOne({

                where: {
                    id
                }

            });



        if (!faq) {

            throw new ApiError(
                404,
                "FAQ not found"
            );

        }



        return faq;


    }








    async update(
        id: number,
        data: UpdateFAQDTO
    ) {


        const faq =
            await this.findById(id);



        Object.assign(
            faq,
            data
        );



        return await this.repository.save(
            faq
        );


    }








    async delete(
        id: number
    ) {


        const faq =
            await this.findById(id);



        await this.repository.softRemove(
            faq
        );



        return true;


    }



}