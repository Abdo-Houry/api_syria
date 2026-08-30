import {
    Router
} from "express";


import {
    resolveQR
} from "../controllers/public-qr.controller";


import {
    optionalUserAuthMiddleware
} from "../middleware/optional-user-auth.middleware";





const router =
    Router();






/*

Public QR Route

مثال:

/api/qr/000001/001/PLACE/5

*/


router.get(

    "/:serial/:version/:type/:id",

    optionalUserAuthMiddleware,

    resolveQR

);






export default router;