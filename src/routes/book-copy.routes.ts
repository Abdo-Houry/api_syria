import {
    Router
} from "express";


import {

    createBookCopy,

    getBookCopies,

    getCopiesByBook,

    getBookCopy,

    updateBookCopy,

    deleteBookCopy

}

    from "../controllers/book-copy.controller";



import {
    adminAuthMiddleware
} from "../middleware/admin-auth.middleware";





const router =
    Router();





router.post(

    "/",

    adminAuthMiddleware,

    createBookCopy

);





router.get(

    "/",

    adminAuthMiddleware,

    getBookCopies

);





router.get(

    "/book/:bookId",

    adminAuthMiddleware,

    getCopiesByBook

);





router.get(

    "/:id",

    adminAuthMiddleware,

    getBookCopy

);





router.put(

    "/:id",

    adminAuthMiddleware,

    updateBookCopy

);





router.delete(

    "/:id",

    adminAuthMiddleware,

    deleteBookCopy

);





export default router;