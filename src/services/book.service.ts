import {
    In
} from "typeorm";


import {
    AppDataSource
} from "../config/database";


import {
    Book
} from "../entities/book.entity";


import {
    Province
} from "../entities/province.entity";


import {
    Place
} from "../entities/place.entity";


import {
    Challenge
} from "../entities/challenge.entity";


import {
    Stamp
} from "../entities/stamp.entity";


import {
    Partner
} from "../entities/partner.entity";


import {
    ApiError
} from "../utils/api-error";




export class BookService {



    private repository =
        AppDataSource.getRepository(Book);



    private provinceRepository =
        AppDataSource.getRepository(Province);



    private placeRepository =
        AppDataSource.getRepository(Place);



    private challengeRepository =
        AppDataSource.getRepository(Challenge);



    private stampRepository =
        AppDataSource.getRepository(Stamp);



    private partnerRepository =
        AppDataSource.getRepository(Partner);






    async create(data: any) {



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





        /*
            كانت المصفوفة تُمرَّر مباشرة إلى findBy
            فينتج شرط مساواة بمصفوفة ويفشل الاستعلام.
            الصحيح هو In(...) مع تجاهل القوائم الفارغة.
        */

        const findByIds = async <T extends { id: number }>(

            repository: {
                findBy: (where: any) => Promise<T[]>
            },

            ids?: number[]

        ): Promise<T[]> => {


            if (!ids || ids.length === 0) {

                return [];

            }


            return await repository.findBy({

                id: In(ids)

            });


        };



        const places =
            await findByIds(
                this.placeRepository,
                data.placeIds
            );



        const challenges =
            await findByIds(
                this.challengeRepository,
                data.challengeIds
            );



        const stamps =
            await findByIds(
                this.stampRepository,
                data.stampIds
            );



        const partners =
            await findByIds(
                this.partnerRepository,
                data.partnerIds
            );






        const book =
            this.repository.create({

                name: data.name,

                description: data.description,

                translations: data.translations,

                province,

                places,

                challenges,

                stamps,

                partners

            });




        return await this.repository.save(book);


    }








    async findAll() {


        return await this.repository.find({

            relations: {
                province: true,

                /*
                    صور الأماكن مطلوبة لبطاقات صفحة الأماكن،
                    ومحافظة المكان لعرض اسمها على البطاقة.
                */
                places: {
                    images: true,
                    province: true,
                    area: true
                },

                challenges: true,
                stamps: true,
                partners: true
            },

            order: {
                created_at: "DESC"
            }

        });


    }









    async findById(
        id: number
    ) {


        const book =
            await this.repository.findOne({

                where: {
                    id
                },

                relations: {
                    province: true,

                    /*
                        الواجهة تبني بطاقات الأماكن من محتوى الكتيّب،
                        فتحتاج صورة الغلاف واسم المحافظة مع كل مكان.
                    */
                    places: {
                        images: true,
                        province: true,
                        area: true
                    },

                    challenges: {
                        place: true
                    },

                    stamps: {
                        place: true
                    },

                    partners: true
                }

            });



        if (!book) {

            throw new ApiError(
                404,
                "Book not found"
            );

        }



        return book;


    }








    async update(
        id: number,
        data: any
    ) {


        const book =
            await this.findById(id);



        Object.assign(
            book,
            data
        );



        return await this.repository.save(book);


    }








    async delete(
        id: number
    ) {


        const book =
            await this.findById(id);



        await this.repository.softRemove(book);



        return true;


    }



}