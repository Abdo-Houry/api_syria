import {
    Request,
    Response
} from "express";


import {
    ProvinceMediaService
} from "../services/province-media.service";


import {
    asyncHandler
} from "../utils/async-handler";


import {
    ApiResponse
} from "../utils/api-response";



const service =
    new ProvinceMediaService();





export const uploadImages =
    asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {


            const files =
                req.files as Express.Multer.File[];



            const result =
                await service.addImages(

                    Number(req.params.id),

                    files

                );



            res.json(

                new ApiResponse(

                    true,

                    "Images uploaded",

                    result

                )

            );


        });







export const uploadVideos =
    asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {


            const files =
                req.files as Express.Multer.File[];



            const result =
                await service.addVideos(

                    Number(req.params.id),

                    files

                );



            res.json(

                new ApiResponse(

                    true,

                    "Videos uploaded",

                    result

                )

            );


        });




export const deleteProvinceImage =
    asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {


            await service.removeImage(
                Number(req.params.imageId)
            );



            res.json(
                new ApiResponse(true, "Image deleted")
            );


        });




export const deleteProvinceVideo =
    asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {


            await service.removeVideo(
                Number(req.params.videoId)
            );



            res.json(
                new ApiResponse(true, "Video deleted")
            );


        });