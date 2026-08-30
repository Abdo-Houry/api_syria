import {
    Router
} from "express";


import {
    myVisits
} from "../controllers/user-visit.controller";


import {
    userAuthMiddleware
} from "../middleware/user-auth.middleware";



const router =
    Router();



router.get(
    "/",
    userAuthMiddleware,
    myVisits
);



export default router;