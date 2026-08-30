import {
    Router
} from "express";


import {
    getAdminStatistics
} from "../controllers/admin-dashboard.controller";


import {
    adminAuthMiddleware
} from "../middleware/admin-auth.middleware";





const router =
    Router();





router.get(

    "/statistics",

    adminAuthMiddleware,

    getAdminStatistics

);





export default router;