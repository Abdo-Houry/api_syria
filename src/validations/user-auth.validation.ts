import {
    z
} from "zod";



export const registerUserSchema = z.object({

    name:
        z.string()
            .min(2),



    phone:
        z.string()
            .min(8),



    /*
        البريد إلزامي: هو قناة رمز التحقّق واستعادة كلمة المرور،
        وعليه تقوم مصداقية الحساب.
    */

    email:
        z.string()
            .trim()
            .toLowerCase()
            .email(),



    password:
        z.string()
            .min(6)

});





export const loginUserSchema = z.object({


    phone:
        z.string(),



    password:
        z.string()


});





/* تأكيد البريد بعد إنشاء الحساب. */

export const verifyOtpSchema = z.object({


    email:
        z.string()
            .trim()
            .toLowerCase()
            .email(),



    code:
        z.string()
            .trim()
            .min(4)
            .max(10)


});





/* إعادة إرسال رمز التأكيد. */

export const resendOtpSchema = z.object({


    email:
        z.string()
            .trim()
            .toLowerCase()
            .email()


});





/* طلب استعادة كلمة المرور. */

export const forgotPasswordSchema = z.object({


    email:
        z.string()
            .trim()
            .toLowerCase()
            .email()


});





/* تعيين كلمة مرور جديدة بعد التحقّق من الرمز. */

export const resetPasswordSchema = z.object({


    email:
        z.string()
            .trim()
            .toLowerCase()
            .email(),



    code:
        z.string()
            .trim()
            .min(4)
            .max(10),



    password:
        z.string()
            .min(6)


});