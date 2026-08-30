import {
    Router
} from "express";


import {

    collectStamp,

    myStamps

}
    from "../controllers/user-stamp.controller";


import {
    userAuthMiddleware
} from "../middleware/user-auth.middleware";



const router =
    Router();





router.post(

    "/collect",

    userAuthMiddleware,

    collectStamp

);





router.get(

    "/",

    userAuthMiddleware,

    myStamps

);





export default router;