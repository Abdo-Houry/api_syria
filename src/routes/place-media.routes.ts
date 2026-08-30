import {
    Router
} from "express";


import {
    uploadPlaceImages,
    uploadPlaceVideos,
    deletePlaceImage,
    deletePlaceVideo
}
    from "../controllers/place-media.controller";


import {
    upload
} from "../config/multer";


import {
    authMiddleware
} from "../middleware/auth.middleware";



const router =
    Router();



router.post(

    "/:id/images",

    authMiddleware,

    upload.array(
        "images",
        10
    ),

    uploadPlaceImages

);



router.post(

    "/:id/videos",

    authMiddleware,

    upload.array(
        "videos",
        5
    ),

    uploadPlaceVideos

);



router.delete(

    "/images/:imageId",

    authMiddleware,

    deletePlaceImage

);



router.delete(

    "/videos/:videoId",

    authMiddleware,

    deletePlaceVideo

);



export default router;
