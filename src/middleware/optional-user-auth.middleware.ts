import {
    Request,
    Response,
    NextFunction
} from "express";


import jwt from "jsonwebtoken";


import {
    env
} from "../config/env";




export const optionalUserAuthMiddleware = (

    req: Request,

    res: Response,

    next: NextFunction

) => {


    try {


        const authHeader =
            req.headers.authorization;



        if (!authHeader) {

            return next();

        }




        const token =
            authHeader.split(" ")[1];



        if (!token) {

            return next();

        }




        const decoded: any =

            jwt.verify(

                token,

                env.JWT_SECRET

            );





        if (decoded.role === "USER") {


            req.user = {

                id: decoded.id,

                role: decoded.role

            };


        }



        next();



    } catch (error) {


        next();


    }



};