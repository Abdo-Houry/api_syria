import {
    Router
} from "express";


import {
    unifiedLogin
} from "../controllers/auth.controller";

import {
    loginRateLimiter
} from "../middleware/rate-limit.middleware";



const router =
    Router();



/*
    دخول موحّد لكل الأدوار.

    مسارا /api/users/login و /api/admin/login ما زالا يعملان
    للتوافق مع أي تكامل قائم.
*/

router.post(
    "/login",
    loginRateLimiter,
    unifiedLogin
);



export default router;
