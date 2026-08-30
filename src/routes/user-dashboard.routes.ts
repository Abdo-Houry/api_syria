import {
    Router
} from "express";


import {
    dashboard
} from "../controllers/user-dashboard.controller";


import {
    userAuthMiddleware
} from "../middleware/user-auth.middleware";


const router =
    Router();



router.get(

    "/:id",

    userAuthMiddleware,

    dashboard

);



export default router;