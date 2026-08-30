import {
    AppDataSource
} from "../config/database";


import {
    Place
} from "../entities/place.entity";


import {
    Province
} from "../entities/province.entity";


import {
    Area
} from "../entities/area.entity";


import {
    Challenge
} from "../entities/challenge.entity";


import {
    Stamp
} from "../entities/stamp.entity";



import {
    ApiError
} from "../utils/api-error";


import {
    CreatePlaceDTO,
    UpdatePlaceDTO
} from "../models/place.model";



export class PlaceService {



    private repository =
        AppDataSource.getRepository(Place);



    private provinceRepository =
        AppDataSource.getRepository(Province);



    private areaRepository =
        AppDataSource.getRepository(Area);



    private challengeRepository =
        AppDataSource.getRepository(Challenge);



    private stampRepository =
        AppDataSource.getRepository(Stamp);




    /*
        المنطقة اختيارية، ويجب أن تتبع المحافظة نفسها.
        undefined ⇒ لا تغيير، null ⇒ إزالة المنطقة.
    */
    private async resolveArea(
        areaId: number | null | undefined,
        provinceId: number
    ) {

        if (areaId === undefined) return undefined;

        if (areaId === null) return null;

        const area =
            await this.areaRepository.findOne({
                where: {
                    id: areaId
                },
                relations: {
                    province: true
                }
            });

        if (!area) {
            throw new ApiError(
                404,
                "Area not found"
            );
        }

        if (area.province?.id !== provinceId) {
            throw new ApiError(
                400,
                "Area does not belong to this province"
            );
        }

        return area;
    }






    async create(
        data: CreatePlaceDTO
    ) {



        const province =
            await this.provinceRepository.findOne({

                where: {
                    id: data.provinceId
                }

            });



        if (!province) {

            throw new ApiError(
                404,
                "Province not found"
            );

        }



        const place =
            this.repository.create({

                name: data.name,

                summary: data.summary,

                description: data.description,

                visit_info: data.visit_info,

                latitude: data.latitude,

                longitude: data.longitude,

                is_exploration: data.isExploration ?? false,

                translations: data.translations,
                province,

                area: await this.resolveArea(
                    data.areaId,
                    province.id
                )
            });



        return await this.repository.save(place);


    }







    async findAll() {


        return await this.repository.find({

            relations: {
                province: true,
                area: true,
                /* بطاقة المكان تعرض أول صورة كغلاف، ولوحة الإدارة تعرض عدد الصور والفيديوهات. */
                images: true,
                videos: true
            },

            order: {
                created_at: "DESC"
            }

        });


    }






    async findById(
        id: number
    ) {


        const place =
            await this.repository.findOne({

                where: {
                    id
                },

                relations: {
                    images: true,
                    videos: true,
                    province: true,
                    area: true
                }

            });



        if (!place) {

            throw new ApiError(
                404,
                "Place not found"
            );

        }



        return place;


    }







    async update(
        id: number,
        data: UpdatePlaceDTO
    ) {


        const place =
            await this.findById(id);

        const { areaId, isExploration, ...rest } = data;

        Object.assign(
            place,
            rest
        );

        /*
            مكان الاستكشاف بلا تحديات ولا طوابع، فتحويل مكان يملكها
            يترك سجلات يتيمة لا تظهر للمستخدم — نرفضه صراحةً.
        */
        if (isExploration !== undefined) {

            if (isExploration && !place.is_exploration) {

                const [challenges, stamps] =
                    await Promise.all([
                        this.challengeRepository.countBy({
                            place: {
                                id: place.id
                            }
                        }),
                        this.stampRepository.countBy({
                            place: {
                                id: place.id
                            }
                        })
                    ]);

                if (challenges > 0 || stamps > 0) {
                    throw new ApiError(
                        400,
                        "Place has challenges or stamps and cannot become an exploration place"
                    );
                }

            }

            place.is_exploration = isExploration;

        }

        if (areaId !== undefined) {
            place.area =
                await this.resolveArea(
                    areaId,
                    place.province.id
                );
        }




        return await this.repository.save(place);


    }







    async delete(
        id: number
    ) {


        const place =
            await this.findById(id);



        await this.repository.softRemove(place);


        return true;


    }



}