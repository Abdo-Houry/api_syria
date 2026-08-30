import {
    Router
} from "express";


import {

    createBook,

    getBooks,

    getBookById

}
    from "../controllers/book.controller";


import {
    authMiddleware,
    anyAuthMiddleware
} from "../middleware/auth.middleware";



const router =
    Router();



router.post(
    "/",
    authMiddleware,
    createBook
);



/*
   قائمة كل الكتيّبات: للمشرف فقط.
*/

router.get(
    "/",
    authMiddleware,
    getBooks
);



/*
   محتوى كتيّب واحد: متاح للمستخدم أيضاً،
   لأنه مصدر أماكن كتيّبه وتحدياته وطوابعه وشركائه.
*/

router.get(
    "/:id",
    anyAuthMiddleware,
    getBookById
);



export default router;
