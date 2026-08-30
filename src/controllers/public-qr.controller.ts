import {
    Request,
    Response
} from "express";


import {
    asyncHandler
} from "../utils/async-handler";


import {
    ApiResponse
} from "../utils/api-response";


import {
    PublicQRService
} from "../services/public-qr.service";


import {
    QRTargetType
} from "../entities/qr-code.entity";





const service =
    new PublicQRService();









export const resolveQR =

    asyncHandler(

        async (

            req: Request,

            res: Response

        ) => {



            const {

                serial,

                version,

                type,

                id


            } = req.params as {


                serial: string;


                version: string;


                type: string;


                id: string;


            };








            const result =

                await service.resolveQR(


                    serial,


                    version,


                    type as QRTargetType,


                    Number(id),


                    req.user?.id


                );








            res.json(

                new ApiResponse(

                    true,

                    "QR Data",

                    result

                )

            );



        }

    );