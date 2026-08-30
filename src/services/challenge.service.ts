import {
    AppDataSource
} from "../config/database";


import {
    Challenge
} from "../entities/challenge.entity";


import {
    Place
} from "../entities/place.entity";


import {
    ApiError
} from "../utils/api-error";


import {

    CreateChallengeDTO,

    UpdateChallengeDTO

} from "../models/challenge.model";




export class ChallengeService {



    private repository =
        AppDataSource.getRepository(Challenge);



    private placeRepository =
        AppDataSource.getRepository(Place);






    async create(
        data: CreateChallengeDTO
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


        /* مكان الاستكشاف تعريفي بحت — لا يقبل تحديات. */
        if (place.is_exploration) {

            throw new ApiError(
                400,
                "Exploration places cannot have challenges"
            );

        }



        const challenge =

            this.repository.create({

                title: data.title,

                description: data.description,

                type: data.type ?? "discovery",

                options: data.options,

                correct_option: data.correct_option,

                translations: data.translations,

                place

            });



        return await this.repository.save(
            challenge
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


        const challenge =
            await this.repository.findOne({

                where: {
                    id
                },

                relations: {
                    place: true
                }

            });



        if (!challenge) {

            throw new ApiError(
                404,
                "Challenge not found"
            );

        }



        return challenge;


    }







    async update(
        id: number,
        data: UpdateChallengeDTO
    ) {


        const challenge =
            await this.findById(id);

        Object.assign(
            challenge,
            data
        );

        /*
            عند تعديل الخيارات وحدها يجب أن يبقى دليل الإجابة ضمن المدى.
        */
        if (
            challenge.options &&
            challenge.correct_option != null &&
            challenge.correct_option >= challenge.options.length
        ) {
            throw new ApiError(
                400,
                "correct_option is out of range"
            );
        }



        return await this.repository.save(
            challenge
        );


    }







    async delete(
        id: number
    ) {


        const challenge =
            await this.findById(id);



        await this.repository.softRemove(
            challenge
        );



        return true;


    }


}