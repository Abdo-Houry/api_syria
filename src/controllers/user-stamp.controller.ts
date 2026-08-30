import {
    Request,
    Response
} from "express";


import {
    UserStampService
} from "../services/user-stamp.service";


import {
    asyncHandler
} from "../utils/async-handler";


import {
    ApiResponse
} from "../utils/api-response";


import {
    collectStampSchema
} from "../validations/user-stamp.validation";



const service =
    new UserStampService();





export const collectStamp =

    asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {


            const data =

                collectStampSchema.parse(
                    req.body
                );




            const result =

                await service.collect(

                    req.user!.id,

                    data.stampId,

                    data.userBookId

                );




            res.json(

                new ApiResponse(

                    true,

                    "Stamp collected",

                    result

                )

            );



        });








export const myStamps =

    asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {


            const userBookId =
                req.query.userBookId
                    ? Number(req.query.userBookId)
                    : undefined;



            const result =

                await service.getMyStamps(

                    req.user!.id,

                    userBookId

                );




            res.json(

                new ApiResponse(

                    true,

                    "My stamps",

                    result

                )

            );



        });