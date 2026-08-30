import {
    AppDataSource
} from "../config/database";


import {
    QRCode,
    QRTargetType
} from "../entities/qr-code.entity";


import {
    Province
} from "../entities/province.entity";


import {
    Place
} from "../entities/place.entity";


import {
    ApiError
} from "../utils/api-error";


import {
    UserVisitService
} from "./user-visit.service";


import {
    UserBookService
} from "./user-book.service";





export class PublicQRService {



    private qrRepository =
        AppDataSource.getRepository(QRCode);



    private provinceRepository =
        AppDataSource.getRepository(Province);



    private placeRepository =
        AppDataSource.getRepository(Place);




    private visitService =
        new UserVisitService();



    private userBookService =
        new UserBookService();










    async resolveQR(

        serial: string,

        version: string,

        type: QRTargetType,

        targetId: number,

        userId?: number

    ) {





        const qr =

            await this.qrRepository.findOne({

                where: {

                    serial_number: serial,

                    version: version,

                    target_type: type,

                    target_id: targetId

                }

            });







        if (!qr) {


            throw new ApiError(

                404,

                "Invalid QR Code"

            );

        }









        /*
            معرفة الكتيب الخاص بالمستخدم
        */

        let userBookId: number | undefined;


        /*
            هل كانت الزيارة موثّقة قبل هذا المسح؟

            الواجهة تحتاج التمييز بين «تم توثيق زيارتك الآن» و«سبق أن
            زرت هذا المكان» — والفرق يُقرأ قبل الإنشاء لا بعده، لأن
            createVisit يعيد السجل القائم بلا إشارة إلى ذلك.
        */

        let alreadyVisited = false;






        if (userId) {


            const userBook =

                await this.userBookService.getUserBookByQR(

                    userId,

                    serial,

                    version

                );




            if (userBook) {


                userBookId =
                    userBook.id;


            }


        }









        /*
            QR المحافظة
        */

        if (type === QRTargetType.PROVINCE) {



            const province =

                await this.provinceRepository.findOne({

                    where: {

                        id: targetId

                    },


                    relations: {

                        places: true

                    }

                });







            if (!province) {


                throw new ApiError(

                    404,

                    "Province not found"

                );


            }









            if (userId && userBookId) {


                const where = {


                    user: {

                        id: userId

                    },


                    userBook: {

                        id: userBookId

                    },


                    province: {

                        id: province.id

                    }


                };


                alreadyVisited =
                    await this.visitService.hasVisit(where);


                await this.visitService.createVisit(where);


            }







            return {


                type: QRTargetType.PROVINCE,


                alreadyVisited,


                data: province


            };



        }









        /*
            QR المكان
        */

        if (type === QRTargetType.PLACE) {



            const place =

                await this.placeRepository.findOne({

                    where: {

                        id: targetId

                    },


                    relations: {

                        province: true,

                        images: true,

                        videos: true,

                        challenges: true,

                        stamps: true

                    }


                });







            if (!place) {


                throw new ApiError(

                    404,

                    "Place not found"

                );


            }









            /*
                مكان الاستكشاف لا تُوثَّق زيارته ولا يدخل في نسبة التقدّم.
                لا يُولَّد له رمز أصلاً، لكن قد يبقى رمز قديم صالحاً إن
                حُوِّل المكان لاحقاً — فنفتح صفحته دون تسجيل زيارة.
            */

            if (userId && userBookId && !place.is_exploration) {


                const where = {


                    user: {

                        id: userId

                    },


                    userBook: {

                        id: userBookId

                    },


                    place: {

                        id: place.id

                    }


                };


                alreadyVisited =
                    await this.visitService.hasVisit(where);


                await this.visitService.createVisit(where);


            }







            return {


                type: QRTargetType.PLACE,


                alreadyVisited,


                data: place


            };



        }








        throw new ApiError(

            400,

            "Unknown QR Type"

        );



    }



}