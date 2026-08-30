import {
    Router
} from "express";


import {

    createStamp,

    getStamps,

    getStampById,

    updateStamp,

    deleteStamp

}
    from "../controllers/stamp.controller";


import {
    authMiddleware
} from "../middleware/auth.middleware";



const router =
    Router();



router.post(
    "/",
    authMiddleware,
    createStamp
);



router.get(
    "/",
    getStamps
);



router.get(
    "/:id",
    getStampById
);



router.put(
    "/:id",
    authMiddleware,
    updateStamp
);



router.delete(
    "/:id",
    authMiddleware,
    deleteStamp
);



export default router;