import {
    z
} from "zod";



/*
    تفعيل نسخة كتيّب.

    يقبل إحدى صيغتين:

    1) bookCopyId  — المعرّف الرقمي للنسخة (إدخال يدوي)

    2) serial + version — وهما ما يحمله رمز الـ QR فعلياً،
       لذلك أصبح التفعيل بالمسح ممكناً دون معرفة المعرّف الرقمي.
*/

export const assignBookSchema = z

    .object({

        bookCopyId:
            z.number()
                .int()
                .positive()
                .optional(),


        serial:
            z.string()
                .min(1)
                .optional(),


        version:
            z.string()
                .min(1)
                .optional()

    })

    .refine(

        (data) =>
            data.bookCopyId !== undefined ||
            (!!data.serial && !!data.version),

        {
            message:
                "Provide bookCopyId, or both serial and version"
        }

    );
