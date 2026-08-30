import {
    Router
} from "express";


import {

    getProfile,

    updateProfile

}
    from "../controllers/user-profile.controller";
import { userAuthMiddleware } from "../middleware/user-auth.middleware";





const router =
    Router();



router.get(

    "/",

    userAuthMiddleware,

    getProfile

);




router.put(

    "/",

    userAuthMiddleware,

    updateProfile

);



export default router;