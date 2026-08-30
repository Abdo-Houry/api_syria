import {
    Router
} from "express";


import {

    register,

    login,

    verifyOtp,

    resendOtp,

    forgotPassword,

    resetPassword

}
    from "../controllers/user-auth.controller";



const router =
    Router();




router.post(
    "/register",
    register
);



router.post(
    "/login",
    login
);



/*
    تأكيد البريد برمز التحقّق — هنا تُفتح الجلسة بعد التسجيل.
*/

router.post(
    "/verify-otp",
    verifyOtp
);



router.post(
    "/resend-otp",
    resendOtp
);



/*
    استعادة كلمة المرور المنسيّة: طلب الرمز ثم تعيين كلمة جديدة.
*/

router.post(
    "/forgot-password",
    forgotPassword
);



router.post(
    "/reset-password",
    resetPassword
);



export default router;