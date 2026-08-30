import {
    Router
} from "express";


import {

    assignBook,

    getMyBooks

}
    from "../controllers/user-book.controller";


import {
    userAuthMiddleware
} from "../middleware/user-auth.middleware";



const router =
    Router();





router.post(

    "/",

    userAuthMiddleware,

    assignBook

);





router.get(

    "/",

    userAuthMiddleware,

    getMyBooks

);





export default router;