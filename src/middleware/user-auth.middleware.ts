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



interface UserPayload {

    id: number;

    role: string;

}



export const userAuthMiddleware = (

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
                "Authentication required"
            );

        }



        const token =
            authHeader.split(" ")[1];



        if (!token) {

            throw new ApiError(
                401,
                "Token missing"
            );

        }





        const decoded =

            jwt.verify(

                token,

                env.JWT_SECRET

            ) as UserPayload;





        if (decoded.role !== "USER") {


            throw new ApiError(

                403,

                "Access denied"

            );


        }





        (req as any).user = {

            id: decoded.id,

            role: decoded.role

        };





        next();



    } catch (error) {


        next(error);


    }



};