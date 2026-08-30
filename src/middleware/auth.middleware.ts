import {
    Request,
    Response,
    NextFunction
} from "express";


import jwt from "jsonwebtoken";


import { env } from "../config/env";


import { ApiError } from "../utils/api-error";



export interface AuthRequest extends Request {

    admin?: {

        id: number;

        username: string;

    };

}



/*
   استخراج التوكن من ترويسة Authorization
*/

const extractToken = (
    req: Request
): string => {


    const authHeader =
        req.headers.authorization;



    if (!authHeader) {

        throw new ApiError(

            401,

            "Authorization token is required"

        );

    }



    const token =
        authHeader.split(" ")[1];



    if (!token) {

        throw new ApiError(

            401,

            "Invalid authorization format"

        );

    }



    return token;

};




const verifyToken = (
    token: string
) => {


    try {


        return jwt.verify(

            token,

            env.JWT_SECRET

        ) as {

            id: number;

            username?: string;

            role?: string;

        };


    }
    catch (error) {


        throw new ApiError(

            401,

            "Invalid or expired token"

        );


    }

};




/*
   صلاحيات المشرف فقط.

   يُستخدم على كل مسارات إدارة المحتوى
   (المحافظات، الأماكن، التحديات، الطوابع، الشركاء، الأسئلة، الوسائط).
*/

export const authMiddleware = (

    req: AuthRequest,

    res: Response,

    next: NextFunction

) => {


    try {


        const decoded =
            verifyToken(
                extractToken(req)
            );



        if (decoded.role !== "ADMIN") {


            throw new ApiError(

                403,

                "Admin access only"

            );


        }



        req.admin = {

            id: decoded.id,

            username: decoded.username ?? ""

        };


        req.user = {

            id: decoded.id,

            role: "ADMIN"

        };



        next();


    }
    catch (error) {


        next(error);


    }


};




/*
   يقبل المستخدم والمشرف معاً.

   يُستخدم على قراءة محتوى الكتيّب، لأن المستخدم يحتاج
   أماكن كتيّبه وتحدياته وطوابعه وشركاءه.
*/

export const anyAuthMiddleware = (

    req: Request,

    res: Response,

    next: NextFunction

) => {


    try {


        const decoded =
            verifyToken(
                extractToken(req)
            );



        req.user = {

            id: decoded.id,

            role: decoded.role ?? "USER"

        };



        next();


    }
    catch (error) {


        next(error);


    }


};
