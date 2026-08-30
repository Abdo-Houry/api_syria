import {
    Request,
    Response
} from "express";


import {
    PlaceMediaService
} from "../services/place-media.service";


import {
    asyncHandler
} from "../utils/async-handler";


import {
    ApiResponse
} from "../utils/api-response";



const service =
    new PlaceMediaService();




export const uploadPlaceImages =
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

                    "Place images uploaded",

                    result

                )

            );


        });







export const uploadPlaceVideos =
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

                    "Place videos uploaded",

                    result

                )

            );


        });




export const deletePlaceImage =
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




export const deletePlaceVideo =
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