import {
    Request,
    Response
} from "express";


import {
    UserDashboardService
} from "../services/user-dashboard.service";


import {
    asyncHandler
} from "../utils/async-handler";


import {
    ApiResponse
} from "../utils/api-response";



const service =
    new UserDashboardService();




export const dashboard =

    asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {


            const userBookId =
                Number(req.params.id);



            const result =

                await service.getDashboard(

                    userBookId,

                    req.user!.id

                );



            res.json(

                new ApiResponse(

                    true,

                    "Dashboard",

                    result

                )

            );


        });
