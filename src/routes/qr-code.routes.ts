import {
    Router
} from "express";


import {

    createQRCode,

    getQRCodes

}
    from "../controllers/qr-code.controller";


import {
    authMiddleware
} from "../middleware/auth.middleware";



const router =
    Router();



/*
    إنشاء QR

    Admin فقط
*/

router.post(
    "/",
    authMiddleware,
    createQRCode
);





/*
    عرض جميع QR

*/

router.get(
    "/",
    authMiddleware,
    getQRCodes
);




export default router;