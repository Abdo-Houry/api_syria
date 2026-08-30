import {
    AppDataSource
} from "../config/database";


import {
    Partner
} from "../entities/partner.entity";


import {
    ApiError
} from "../utils/api-error";


import {

    CreatePartnerDTO,

    UpdatePartnerDTO

} from "../models/partner.model";





export class PartnerService {



    private repository =
        AppDataSource.getRepository(Partner);






    async create(
        data: CreatePartnerDTO
    ) {



        const partner =
            this.repository.create(data);



        return await this.repository.save(
            partner
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


        const partner =
            await this.repository.findOne({

                where: {
                    id
                }

            });



        if (!partner) {

            throw new ApiError(
                404,
                "Partner not found"
            );

        }



        return partner;


    }








    async update(
        id: number,
        data: UpdatePartnerDTO
    ) {


        const partner =
            await this.findById(id);



        Object.assign(
            partner,
            data
        );



        return await this.repository.save(
            partner
        );


    }








    async delete(
        id: number
    ) {


        const partner =
            await this.findById(id);



        await this.repository.softRemove(
            partner
        );



        return true;


    }



}