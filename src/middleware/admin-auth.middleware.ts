import {
    Request,
    Response,
    NextFunction
} from "express";


import jwt from "jsonwebtoken";


import {
    env
} from "../config/env";


import {
    ApiError
} from "../utils/api-error";





export const adminAuthMiddleware = (


    req: Request,

    res: Response,

    next: NextFunction


) => {


    try {


        const authHeader =

            req.headers.authorization;




        if (!authHeader) {

            throw new ApiError(

                401,

                "No token provided"

            );

        }




        const token =

            authHeader.split(" ")[1];





        if (!token) {

            throw new ApiError(

                401,

                "Invalid token"

            );

        }






        const decoded: any =

            jwt.verify(

                token,

                env.JWT_SECRET

            );






        if (decoded.role !== "ADMIN") {


            throw new ApiError(

                403,

                "Admin access only"

            );


        }






        req.user = {


            id: decoded.id,


            role: decoded.role


        };






        next();



    } catch (error) {


        next(error);


    }


};