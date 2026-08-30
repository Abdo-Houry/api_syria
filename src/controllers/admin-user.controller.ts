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


import {
    AdminUserService
} from "../services/admin-user.service";




const service =
    new AdminUserService();




export const listUsers =

    asyncHandler(

        async (
            _req: Request,
            res: Response
        ) => {


            const users =
                await service.list();


            res.json(
                new ApiResponse(
                    true,
                    "Users",
                    users
                )
            );


        });




export const getUserDetails =

    asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {


            const id =
                Number(req.params.id);


            if (!Number.isInteger(id) || id <= 0) {

                throw new ApiError(
                    400,
                    "Invalid user id"
                );

            }


            const details =
                await service.findById(id);


            res.json(
                new ApiResponse(
                    true,
                    "User details",
                    details
                )
            );


        });
