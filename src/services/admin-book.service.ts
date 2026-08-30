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





export class AdminBookService {



    private bookRepository =
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
            نفس خطأ BookService: تمرير مصفوفة إلى findBy
            ينتج شرط مساواة بمصفوفة ويفشل الاستعلام.
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
                data.places
            );




        const challenges =

            await findByIds(
                this.challengeRepository,
                data.challenges
            );




        const stamps =

            await findByIds(
                this.stampRepository,
                data.stamps
            );




        const partners =

            await findByIds(
                this.partnerRepository,
                data.partners
            );









        const book =

            this.bookRepository.create({

                name: data.name,

                description: data.description,

                translations: data.translations,

                province,

                places,

                challenges,

                stamps,

                partners

            });






        return await this.bookRepository.save(book);



    }








    async findAll() {



        return await this.bookRepository.find({

            relations: {

                province: true,

                places: true,

                challenges: true,

                stamps: true,

                partners: true,

                copies: true

            }


        });


    }







    async findById(id: number) {



        const book =

            await this.bookRepository.findOne({

                where: {
                    id
                },


                relations: {

                    province: true,

                    places: true,

                    challenges: true,

                    stamps: true,

                    partners: true,

                    copies: true

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






    /*
        تعديل الجواز.

        النسخ المطبوعة ترتبط بالجواز بعلاقة ManyToOne، فتعديل بيانات
        الجواز يظهر فوراً في كل نسخة مرتبطة به دون أي نسخ للبيانات.
        الحقول غير المرسَلة تبقى كما هي، والمصفوفة المرسَلة تستبدل
        ارتباطها بالكامل.
    */

    async update(id: number, data: any) {


        const book =

            await this.findById(id);




        if (data.provinceId !== undefined) {


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


            book.province = province;


        }




        const findByIds = async <T extends { id: number }>(

            repository: {
                findBy: (where: any) => Promise<T[]>
            },

            ids: number[]

        ): Promise<T[]> => {


            if (ids.length === 0) {

                return [];

            }


            return await repository.findBy({

                id: In(ids)

            });


        };




        if (data.name !== undefined) {

            book.name = data.name;

        }


        if (data.description !== undefined) {

            book.description = data.description;

        }


        if (data.status !== undefined) {

            book.status = data.status;

        }


        if (data.translations !== undefined) {

            book.translations = data.translations;

        }


        if (data.places !== undefined) {

            book.places =
                await findByIds(
                    this.placeRepository,
                    data.places
                );

        }


        if (data.challenges !== undefined) {

            book.challenges =
                await findByIds(
                    this.challengeRepository,
                    data.challenges
                );

        }


        if (data.stamps !== undefined) {

            book.stamps =
                await findByIds(
                    this.stampRepository,
                    data.stamps
                );

        }


        if (data.partners !== undefined) {

            book.partners =
                await findByIds(
                    this.partnerRepository,
                    data.partners
                );

        }




        await this.bookRepository.save(book);




        return await this.findById(id);


    }






    async delete(id: number) {


        const result =

            await this.bookRepository.softDelete(id);



        return result;


    }



}