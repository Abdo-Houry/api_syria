import {
    Router
} from "express";


import {
    listUsers,
    getUserDetails
} from "../controllers/admin-user.controller";


import {
    adminAuthMiddleware
} from "../middleware/admin-auth.middleware";




const router =
    Router();




router.get(
    "/",
    adminAuthMiddleware,
    listUsers
);


router.get(
    "/:id",
    adminAuthMiddleware,
    getUserDetails
);




export default router;
