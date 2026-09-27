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


import {
    loginRateLimiter,
    otpEmailRateLimiter,
    otpIpRateLimiter
} from "../middleware/rate-limit.middleware";



const router =
    Router();




router.post(
    "/register",
    otpIpRateLimiter,
    otpEmailRateLimiter,
    register
);



router.post(
    "/login",
    loginRateLimiter,
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
    otpIpRateLimiter,
    otpEmailRateLimiter,
    resendOtp
);



/*
    استعادة كلمة المرور المنسيّة: طلب الرمز ثم تعيين كلمة جديدة.
*/

router.post(
    "/forgot-password",
    otpIpRateLimiter,
    otpEmailRateLimiter,
    forgotPassword
);



router.post(
    "/reset-password",
    resetPassword
);



export default router;