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
    ApiError
} from "../utils/api-error";



/*
    رفع صورة مفردة وإرجاع مسارها.

    يُستخدم للحقول التي تخزّن مساراً واحداً (صورة الطابع، شعار الشريك،
    صورة المستخدم الشخصية) بدل مطالبة المشرف بلصق رابط خارجي.
*/

const publicPath = (
    file: Express.Multer.File
): string => {

    /*
       multer يعيد مساراً نظامياً (uploads\places\x.png على ويندوز)،
       ونحن نخزّن مساراً عمومياً بشرطات مائلة أمامية.
    */

    return `/${file.path.replace(/\\/g, "/")}`;

};




export const uploadImage =

    asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {


            const file =
                req.file as Express.Multer.File | undefined;



            if (!file) {

                throw new ApiError(
                    400,
                    "No image uploaded"
                );

            }



            res.status(201).json(

                new ApiResponse(

                    true,

                    "Image uploaded",

                    {
                        url: publicPath(file)
                    }

                )

            );


        });




export const uploadImages =

    asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {


            const files =
                (req.files as Express.Multer.File[] | undefined) ?? [];



            if (!files.length) {

                throw new ApiError(
                    400,
                    "No images uploaded"
                );

            }



            res.status(201).json(

                new ApiResponse(

                    true,

                    "Images uploaded",

                    {
                        urls: files.map(publicPath)
                    }

                )

            );


        });
