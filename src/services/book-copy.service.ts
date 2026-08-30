import {
    AppDataSource
} from "../config/database";


import {
    BookCopy
} from "../entities/book-copy.entity";


import {
    Book
} from "../entities/book.entity";


import {
    QRCode,
    QRTargetType
} from "../entities/qr-code.entity";


import {
    ApiError
} from "../utils/api-error";


import {
    buildQrValue
} from "../utils/qr-generator";





export class BookCopyService {



    private repository =
        AppDataSource.getRepository(BookCopy);



    private bookRepository =
        AppDataSource.getRepository(Book);



    private qrRepository =
        AppDataSource.getRepository(QRCode);









    async create(data: any) {



        const book =

            await this.bookRepository.findOne({

                where: {
                    id: data.bookId
                },


                relations: {
                    province: true,
                    places: true
                }

            });






        if (!book) {


            throw new ApiError(

                404,

                "Book not found"

            );


        }








        /*
            المنع عند تطابق السيريال والإصدار معاً فقط.

            نفس السيريال بإصدار مختلف نسخةٌ جديدة مشروعة — إعادة طبع
            الجواز بإصدار لاحق — وله رموز QR مستقلة لأن الرمز يحمل
            السيريال والإصدار معاً.
        */

        const exists =

            await this.repository.findOne({

                where: {

                    serial_number: data.serial_number,

                    version: data.version

                }

            });





        if (exists) {


            throw new ApiError(

                400,

                "Serial number already exists for this version"

            );


        }









        const copy =

            this.repository.create({

                book,

                serial_number: data.serial_number,

                version: data.version

            });






        const savedCopy =

            await this.repository.save(copy);











        /*
            إنشاء رموز الـ QR.

            كان السجل يُحفظ باسم علاقة خاطئ (bookCopy بدل book_copy)
            وبدون qr_value رغم أنه عمود إلزامي وفريد، فيفشل الإدراج.
        */


        const createQr = async (

            targetType: QRTargetType,

            targetId: number

        ) => {


            await this.qrRepository.save({

                book_copy: savedCopy,


                target_type: targetType,


                target_id: targetId,


                serial_number:
                    data.serial_number,


                version:
                    data.version,


                qr_value:
                    buildQrValue(

                        targetType,

                        targetId,

                        data.serial_number,

                        data.version

                    )

            });


        };




        await createQr(

            QRTargetType.PROVINCE,

            book.province.id

        );




        for (const place of book.places) {


            /*
               أماكن الاستكشاف تعريفية بلا توثيق زيارة،
               فلا يُولَّد لها رمز QR في نسخة الكتيّب.
            */
            if (place.is_exploration) continue;


            await createQr(

                QRTargetType.PLACE,

                place.id

            );


        }





        savedCopy.qr_created = true;


        await this.repository.save(savedCopy);







        return savedCopy;


    }









    async findAll() {



        return await this.repository.find({

            relations: {

                book: true,

                qrs: true

            },


            order: {

                created_at: "DESC"

            }

        });


    }









    async findByBook(

        bookId: number

    ) {



        return await this.repository.find({

            where: {

                book: {

                    id: bookId

                }

            },


            relations: {

                book: true,

                qrs: true

            }

        });


    }









    async findById(

        id: number

    ) {



        const copy =

            await this.repository.findOne({

                where: {

                    id

                },


                relations: {

                    book: true,

                    qrs: true

                }

            });





        if (!copy) {


            throw new ApiError(

                404,

                "Book copy not found"

            );

        }




        return copy;


    }









    async update(

        id: number,

        data: any

    ) {



        const copy =

            await this.findById(id);



        Object.assign(

            copy,

            data

        );



        return await this.repository.save(copy);


    }









    async delete(

        id: number

    ) {



        const copy =

            await this.findById(id);



        await this.repository.softRemove(copy);



        return true;


    }



}