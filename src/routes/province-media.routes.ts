import {
    Router
} from "express";


import {
    uploadImages,
    uploadVideos,
    deleteProvinceImage,
    deleteProvinceVideo
}
    from "../controllers/province-media.controller";


import {
    authMiddleware
}
    from "../middleware/auth.middleware";


import {
    upload
}
    from "../config/multer";

import {
    optimizeImages
} from "../middleware/optimize-image.middleware";




const router =
    Router();



router.post(

    "/:id/images",

    authMiddleware,

    upload.array(
        "images",
        10
    ),

    optimizeImages,

    uploadImages

);



router.post(

    "/:id/videos",

    authMiddleware,

    upload.array(
        "videos",
        5
    ),

    uploadVideos

);



router.delete(

    "/images/:imageId",

    authMiddleware,

    deleteProvinceImage

);



router.delete(

    "/videos/:videoId",

    authMiddleware,

    deleteProvinceVideo

);



export default router;
