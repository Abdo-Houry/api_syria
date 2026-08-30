import {
    AppDataSource
} from "../config/database";


import {
    Stamp
} from "../entities/stamp.entity";


import {
    Place
} from "../entities/place.entity";


import {
    ApiError
} from "../utils/api-error";


import {

    CreateStampDTO,

    UpdateStampDTO

} from "../models/stamp.model";




export class StampService {



    private repository =
        AppDataSource.getRepository(Stamp);



    private placeRepository =
        AppDataSource.getRepository(Place);






    async create(
        data: CreateStampDTO
    ) {



        const place =
            await this.placeRepository.findOne({

                where: {
                    id: data.placeId
                }

            });



        if (!place) {

            throw new ApiError(
                404,
                "Place not found"
            );

        }


        /* مكان الاستكشاف تعريفي بحت — لا يقبل طوابع. */
        if (place.is_exploration) {

            throw new ApiError(
                400,
                "Exploration places cannot have stamps"
            );

        }




        const stamp =

            this.repository.create({

                name: data.name,

                description: data.description,

                image_url: data.image_url,

                translations: data.translations,

                place

            });



        return await this.repository.save(
            stamp
        );


    }








    async findAll() {


        return await this.repository.find({

            relations: {
                place: true
            },

            order: {
                created_at: "DESC"
            }

        });


    }








    async findById(
        id: number
    ) {


        const stamp =
            await this.repository.findOne({

                where: {
                    id
                },

                relations: {
                    place: true
                }

            });



        if (!stamp) {

            throw new ApiError(
                404,
                "Stamp not found"
            );

        }



        return stamp;


    }








    async update(
        id: number,
        data: UpdateStampDTO
    ) {


        const stamp =
            await this.findById(id);



        Object.assign(
            stamp,
            data
        );



        return await this.repository.save(
            stamp
        );


    }








    async delete(
        id: number
    ) {


        const stamp =
            await this.findById(id);



        await this.repository.softRemove(
            stamp
        );



        return true;


    }


}