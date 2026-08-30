import {
    Request,
    Response
} from "express";


import {
    UserVisitService
} from "../services/user-visit.service";


import {
    asyncHandler
} from "../utils/async-handler";


import {
    ApiResponse
} from "../utils/api-response";



const service =
    new UserVisitService();




export const myVisits =

    asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {


            const userBookId =
                req.query.userBookId
                    ? Number(req.query.userBookId)
                    : undefined;



            const visits =

                await service.getUserVisits(
                    req.user!.id,
                    userBookId
                );



            res.json(

                new ApiResponse(

                    true,

                    "My visits",

                    visits

                )

            );



        });