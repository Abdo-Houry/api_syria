import QRCode from "qrcode";

import { env } from "../config/env";

import { QRTargetType } from "../entities/qr-code.entity";



export const generateQR = async (

    data: string

) => {


    return await QRCode.toDataURL(

        data

    );


};



/*
   الرابط الذي يُطبع كـ QR.

   الشكل مطابق لمسار الواجهة:
   /qr/:type/:id?serial=...&version=...
*/

export const buildQrValue = (

    targetType: QRTargetType | string,

    targetId: number,

    serial: string,

    version: string

) => {


    const base =
        env.FRONTEND_URL.replace(/\/$/, "");


    const query =
        new URLSearchParams({

            serial,

            version

        }).toString();


    return `${base}/qr/${targetType}/${targetId}?${query}`;


};
