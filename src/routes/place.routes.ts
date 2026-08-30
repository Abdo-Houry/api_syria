import {
    Router
} from "express";


import {
    createPlace,
    getPlaces,
    getPlaceById,
    updatePlace,
    deletePlace
}
    from "../controllers/place.controller";


import {
    authMiddleware
} from "../middleware/auth.middleware";



const router =
    Router();



router.post(
    "/",
    authMiddleware,
    createPlace
);



router.get(
    "/",
    getPlaces
);



router.get(
    "/:id",
    getPlaceById
);



router.put(
    "/:id",
    authMiddleware,
    updatePlace
);



router.delete(
    "/:id",
    authMiddleware,
    deletePlace
);



export default router;