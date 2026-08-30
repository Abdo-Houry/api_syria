import {
    z
} from "zod";


import {
    SUPPORTED_LOCALES
} from "../types/translations";



/*
    ترجمات الحقول النصية لكيان واحد.

    الشكل: { "en": { "name": "...", "summary": "..." }, "de": {...} }

    العربية غير مسموح بها هنا لأنها تُخزَّن في الأعمدة الأصلية،
    وأي حقل فارغ يُهمَل حتى لا تُخزَّن ترجمات فارغة.
*/

const localeKeys =
    SUPPORTED_LOCALES.filter(
        (locale) => locale !== "ar"
    );



export const translationsSchema =

    z.object(

        Object.fromEntries(

            localeKeys.map((locale) => [

                locale,

                z.record(
                    z.string(),
                    z.string()
                ).optional()

            ])

        ) as Record<
            (typeof localeKeys)[number],
            z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>
        >

    )
        .partial()
        /*
           strict حتى يظهر خطأ واضح عند إرسال لغة غير مدعومة
           أو المفتاح "ar" (العربية تُخزَّن في الأعمدة الأصلية)،
           بدل حذفها بصمت وضياع نص المشرف.
        */
        .strict();
