import { z } from "zod";

import { translationsSchema } from "./translations.validation";



export const createBookSchema = z.object({

    name:
        z.string()
            .min(2),



    description:
        z.string()
            .optional(),



    provinceId:
        z.number(),



    places:
        z.array(
            z.number()
        )
            .optional()
            .default([]),




    challenges:
        z.array(
            z.number()
        )
            .optional()
            .default([]),




    stamps:
        z.array(
            z.number()
        )
            .optional()
            .default([]),




    partners:
        z.array(
            z.number()
        )
            .optional()
            .default([]),



    translations:
        translationsSchema
            .optional()

});




/*
    تعديل الجواز.

    كل الحقول اختيارية: المرسَل وحده يُطبَّق. تمرير أي مصفوفة محتوى
    يستبدل الارتباط بالكامل، وإغفالها يبقيه كما هو.
*/

export const updateBookSchema = z.object({

    name:
        z.string()
            .min(2)
            .optional(),



    description:
        z.string()
            .optional(),



    provinceId:
        z.number()
            .optional(),



    places:
        z.array(
            z.number()
        )
            .optional(),




    challenges:
        z.array(
            z.number()
        )
            .optional(),




    stamps:
        z.array(
            z.number()
        )
            .optional(),




    partners:
        z.array(
            z.number()
        )
            .optional(),



    status:
        z.boolean()
            .optional(),



    translations:
        translationsSchema
            .optional()

});