import {
    Router
} from "express";


import {

    createFAQ,

    getFAQs,

    getFAQById,

    updateFAQ,

    deleteFAQ

}
    from "../controllers/faq.controller";


import {
    authMiddleware
} from "../middleware/auth.middleware";



const router =
    Router();




router.post(
    "/",
    authMiddleware,
    createFAQ
);



router.get(
    "/",
    getFAQs
);



router.get(
    "/:id",
    getFAQById
);



router.put(
    "/:id",
    authMiddleware,
    updateFAQ
);



router.delete(
    "/:id",
    authMiddleware,
    deleteFAQ
);



export default router;