import {
    Router
} from "express";


import {

    createBook,

    getBooks,

    getBook,

    updateBook,

    deleteBook

}
    from "../controllers/admin-book.controller";
import { adminAuthMiddleware } from "../middleware/admin-auth.middleware";





const router =
    Router();



router.post(

    "/",

    adminAuthMiddleware,

    createBook

);



router.get(

    "/",

    adminAuthMiddleware,

    getBooks

);



router.get(

    "/:id",

    adminAuthMiddleware,

    getBook

);



router.put(

    "/:id",

    adminAuthMiddleware,

    updateBook

);



router.delete(

    "/:id",

    adminAuthMiddleware,

    deleteBook

);



export default router;