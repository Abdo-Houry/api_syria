import {
    Request,
    Response
} from "express";


import {
    UserProfileService
} from "../services/user-profile.service";


import {
    asyncHandler
} from "../utils/async-handler";


import {
    ApiResponse
} from "../utils/api-response";


import {
    updateProfileSchema
} from "../validations/user-profile.validation";



const service =
    new UserProfileService();





export const getProfile =

    asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {


            const userId =
                (req as any).user.id;



            const user =

                await service.getProfile(
                    userId
                );



            res.json(

                new ApiResponse(

                    true,

                    "Profile",

                    user

                )

            );


        });








export const updateProfile =

    asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {


            const userId =
                (req as any).user.id;



            const data =

                updateProfileSchema.parse(
                    req.body
                );




            const user =

                await service.updateProfile(

                    userId,

                    data

                );




            res.json(

                new ApiResponse(

                    true,

                    "Profile updated",

                    user

                )

            );


        });