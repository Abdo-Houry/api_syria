import {

    Request,

    Response,

    NextFunction

} from "express";

import { ZodError } from "zod";

import { ApiError } from "../utils/api-error";

export const errorMiddleware = (

    err: Error,

    req: Request,

    res: Response,

    next: NextFunction

) => {

    /*
        أخطاء التحقّق من صحّة المدخلات (zod)
        كانت تصل إلى 500 قبل معالجتها هنا.
    */

    if (err instanceof ZodError) {

        const errors = err.issues.map((issue) => ({

            field: issue.path.join(".") || "body",

            message: issue.message

        }));

        return res.status(400).json({

            success: false,

            message:
                errors[0]
                    ? `${errors[0].field}: ${errors[0].message}`
                    : "Validation error",

            errors

        });

    }

    if (err instanceof ApiError) {

        return res.status(err.statusCode).json({

            success: false,

            message: err.message

        });

    }

    console.error(err);

    return res.status(500).json({

        success: false,

        message: "Internal Server Error"

    });

};
