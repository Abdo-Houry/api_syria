import {
    Request,
    Response
} from "express";


import {
    AuthService
} from "../services/auth.service";


import {
    asyncHandler
} from "../utils/async-handler";


import {
    ApiResponse
} from "../utils/api-response";


import {
    unifiedLoginSchema
} from "../validations/auth.validation";



const service =
    new AuthService();




export const unifiedLogin =

    asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {


            const data =
                unifiedLoginSchema.parse(
                    req.body
                );



            const result =
                await service.login(
                    data.identifier,
                    data.password
                );



            res.json(

                new ApiResponse(

                    true,

                    "Login success",

                    result

                )

            );


        });
