import {
    Router
} from "express";


import {
    createProvince,
    getProvinces,
    getProvinceById,
    updateProvince,
    deleteProvince
}
    from "../controllers/province.controller";


import {
    authMiddleware
} from "../middleware/auth.middleware";



const router = Router();



router.post(

    "/",

    authMiddleware,

    createProvince

);



router.get(

    "/",

    getProvinces

);



router.get(

    "/:id",

    getProvinceById

);



router.put(


    "/:id",

    authMiddleware,

    updateProvince

);



router.delete(

    "/:id",

    authMiddleware,

    deleteProvince

);



export default router;