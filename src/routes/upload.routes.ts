import {
    Router
} from "express";


import {
    uploadImage,
    uploadImages
} from "../controllers/upload.controller";


import {
    upload
} from "../config/multer";


import {
    anyAuthMiddleware
} from "../middleware/auth.middleware";

import {
    optimizeImages
} from "../middleware/optimize-image.middleware";




const router =
    Router();



/*
    رفع صور عامة.

    مفتوح للمستخدم والمشرف: المشرف يرفع صور الطوابع والشركاء،
    والمستخدم يرفع صورته الشخصية.

    مسار المجلّد يُشتقّ من الجزء الأخير من الرابط (stamps / partners / users).
*/

router.post(

    "/:folder/image",

    anyAuthMiddleware,

    upload.single("image"),

    optimizeImages,

    uploadImage

);



router.post(

    "/:folder/images",

    anyAuthMiddleware,

    upload.array("images", 10),

    optimizeImages,

    uploadImages

);



export default router;
