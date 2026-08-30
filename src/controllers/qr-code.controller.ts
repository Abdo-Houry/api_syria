import {
    Request,
    Response
} from "express";


import {
    QRCodeService
} from "../services/qr-code.service";


import {
    asyncHandler
} from "../utils/async-handler";


import {
    ApiResponse
} from "../utils/api-response";


import {
    createQRCodeSchema
} from "../validations/qr-code.validation";



const service = new QRCodeService();





export const createQRCode =

    asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {


            const data =
                createQRCodeSchema.parse(
                    req.body
                );



            const qr =
                await service.create(data);



            res.status(201).json(

                new ApiResponse(

                    true,

                    "QR created successfully",

                    qr

                )

            );


        });







export const getQRCodes =

    asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {


            const qrs =
                await service.findAll();



            res.json(

                new ApiResponse(

                    true,

                    "QR Codes",

                    qrs

                )

            );


        });
