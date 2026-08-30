import {
    AppDataSource
} from "../config/database";


import {
    Province
} from "../entities/province.entity";


import {
    ApiError
} from "../utils/api-error";



import {
    CreateProvinceDTO,
    UpdateProvinceDTO
} from "../models/province.model";



export class ProvinceService {


    private repository =
        AppDataSource.getRepository(Province);


    async create(

        data: CreateProvinceDTO
    ) {


        const exists =
            await this.repository.findOne({

                where: {
                    name: data.name
                }

            });



        if (exists) {

            throw new ApiError(
                400,
                "Province already exists"
            );

        }



        const province =
            this.repository.create(data);



        return await this.repository.save(
            province
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

        const province =
            await this.repository.findOne({

                where: {
                    id
                },

                relations: {
                    images: true,
                    videos: true
                }

            });



        if (!province) {

            throw new ApiError(
                404,
                "Province not found"
            );

        }


        return province;

    }





    async update(
        id: number,
        data: UpdateProvinceDTO
    ) {


        const province =
            await this.findById(id);



        Object.assign(
            province,
            data
        );


        return await this.repository.save(
            province
        );

    }





    async delete(
        id: number
    ) {


        const province =
            await this.findById(id);



        await this.repository.softRemove(
            province
        );


        return true;

    }


}