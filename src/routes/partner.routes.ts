import {
    Router
} from "express";


import {

    createPartner,

    getPartners,

    getPartnerById,

    updatePartner,

    deletePartner

}
    from "../controllers/partner.controller";


import {
    authMiddleware
} from "../middleware/auth.middleware";



const router =
    Router();




router.post(
    "/",
    authMiddleware,
    createPartner
);



router.get(
    "/",
    getPartners
);



router.get(
    "/:id",
    getPartnerById
);



router.put(
    "/:id",
    authMiddleware,
    updatePartner
);



router.delete(
    "/:id",
    authMiddleware,
    deletePartner
);



export default router;