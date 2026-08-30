import {
    Request,
    Response
} from "express";


import {
    UserAuthService
} from "../services/user-auth.service";


import {
    asyncHandler
} from "../utils/async-handler";


import {
    ApiResponse
} from "../utils/api-response";


import {
    registerUserSchema,
    loginUserSchema,
    verifyOtpSchema,
    resendOtpSchema,
    forgotPasswordSchema,
    resetPasswordSchema
} from "../validations/user-auth.validation";



const service =
    new UserAuthService();





export const register =

    asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {


            const data =

                registerUserSchema.parse(
                    req.body
                );



            const result =

                await service.register(data);



            res.status(201).json(

                new ApiResponse(

                    true,

                    "Verification code sent",

                    result

                )

            );


        });








export const verifyOtp =

    asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {


            const data =

                verifyOtpSchema.parse(
                    req.body
                );



            const result =

                await service.verifyEmail(data);



            res.json(

                new ApiResponse(

                    true,

                    "Email verified",

                    result

                )

            );


        });








export const resendOtp =

    asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {


            const data =

                resendOtpSchema.parse(
                    req.body
                );



            const result =

                await service.resendVerification(data);



            res.json(

                new ApiResponse(

                    true,

                    "Verification code sent",

                    result

                )

            );


        });








export const forgotPassword =

    asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {


            const data =

                forgotPasswordSchema.parse(
                    req.body
                );



            const result =

                await service.forgotPassword(data);



            res.json(

                new ApiResponse(

                    true,

                    "Reset code sent",

                    result

                )

            );


        });








export const resetPassword =

    asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {


            const data =

                resetPasswordSchema.parse(
                    req.body
                );



            const result =

                await service.resetPassword(data);



            res.json(

                new ApiResponse(

                    true,

                    "Password updated",

                    result

                )

            );


        });








export const login =

    asyncHandler(

        async (
            req: Request,
            res: Response
        ) => {


            const data =

                loginUserSchema.parse(
                    req.body
                );



            const result =

                await service.login(data);



            res.json(

                new ApiResponse(

                    true,

                    "Login success",

                    result

                )

            );


        });