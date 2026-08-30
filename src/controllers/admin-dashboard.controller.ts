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
    AdminDashboardService
} from "../services/admin-dashboard.service";





const service =
    new AdminDashboardService();







export const getAdminStatistics =

    asyncHandler(

        async (

            req: Request,

            res: Response

        ) => {



            const statistics =

                await service.getStatistics();





            res.json(

                new ApiResponse(

                    true,

                    "Dashboard statistics",

                    statistics

                )

            );


        });

