import QRCodeLib from "qrcode";


import {
    AppDataSource
} from "../config/database";


import {
    QRCode
} from "../entities/qr-code.entity";


import {
    BookCopy
} from "../entities/book-copy.entity";


import {
    ApiError
} from "../utils/api-error";


import {
    buildQrValue
} from "../utils/qr-generator";



export class QRCodeService {



    private repository =
        AppDataSource.getRepository(QRCode);



    private bookCopyRepository =
        AppDataSource.getRepository(BookCopy);






    async create(data: any) {



        const copy =
            await this.bookCopyRepository.findOne({

                where: {
                    id: data.bookCopyId
                }

            });



        if (!copy) {

            throw new ApiError(
                404,
                "Book copy not found"
            );

        }





        const url =

            buildQrValue(

                data.target_type,

                data.target_id,

                copy.serial_number,

                copy.version

            );




        const qrImage =

            await QRCodeLib.toDataURL(url);





        const qr =

            this.repository.create({

                book_copy: copy,


                serial_number:
                    copy.serial_number,


                version:
                    copy.version,


                target_type:
                    data.target_type,


                target_id:
                    data.target_id,


                qr_value:
                    url

            });





        await this.repository.save(qr);



        copy.qr_created = true;


        await this.bookCopyRepository.save(copy);



        return {

            qr,

            image: qrImage

        };



    }






    async findAll() {


        return await this.repository.find({

            relations: {
                book_copy: {
                    book: true
                }
            }

        });


    }



}