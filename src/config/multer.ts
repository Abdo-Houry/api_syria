import multer from "multer";

import path from "path";

import fs from "fs";

/*
   uuid@14 حزمة ESM فقط، واستيرادها في مشروع CommonJS
   كان يُفشل `npm run build` بالخطأ TS1479.
   randomUUID مدمجة في Node وتؤدي الغرض نفسه.
*/
import { randomUUID as uuid } from "crypto";

import { ApiError } from "../utils/api-error";



/*
   المجلّد يُشتقّ من مسار الطلب الكامل، فتبقى الملفات مرتّبة حسب نوع المحتوى.

   نستخدم originalUrl لا baseUrl، لأن مسار الرفع العام مركَّب على
   /api/uploads والمجلّد يأتي بعده كجزء من المسار (/api/uploads/stamps/image).

   القيمة لا تُؤخذ من المستخدم مباشرةً — بل تُطابَق مع قائمة مغلقة —
   فلا مجال لتجاوز المسار (path traversal).
*/

const folderFor = (url: string): string => {

    if (url.includes("/places")) return "uploads/places";

    if (url.includes("/provinces")) return "uploads/provinces";

    if (url.includes("/stamps")) return "uploads/stamps";

    if (url.includes("/partners")) return "uploads/partners";

    if (url.includes("/users")) return "uploads/users";

    return "uploads/misc";

};




const storage =
    multer.diskStorage({


        destination: (req, file, cb) => {


            const folder =
                folderFor(req.originalUrl);


            /*
               multer لا ينشئ المجلّد تلقائياً؛ غيابه كان يعني فشل الرفع.
            */

            if (!fs.existsSync(folder)) {

                fs.mkdirSync(folder, {
                    recursive: true
                });

            }


            cb(
                null,
                folder
            );


        },



        filename: (req, file, cb) => {


            const ext =
                path.extname(
                    file.originalname
                ).toLowerCase();


            cb(

                null,

                `${uuid()}${ext}`

            );


        }


    });




const IMAGE_TYPES = /^image\/(jpeg|png|webp|gif|avif|svg\+xml)$/;

const VIDEO_TYPES = /^video\/(mp4|webm|ogg|quicktime|x-matroska)$/;




export const upload =
    multer({

        storage,

        limits: {
            /* 50MB — يكفي لمقطع قصير ويمنع رفع ملفات ضخمة بالخطأ */
            fileSize: 50 * 1024 * 1024
        },

        fileFilter: (req, file, cb) => {


            const isImageField =
                file.fieldname === "images" ||
                file.fieldname === "image";


            if (isImageField) {

                if (!IMAGE_TYPES.test(file.mimetype)) {

                    return cb(
                        new ApiError(
                            400,
                            "Only image files are allowed"
                        )
                    );

                }

                return cb(null, true);

            }



            if (!VIDEO_TYPES.test(file.mimetype)) {

                return cb(
                    new ApiError(
                        400,
                        "Only video files are allowed"
                    )
                );

            }


            cb(null, true);


        }

    });
