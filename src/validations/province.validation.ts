import { z } from "zod";

import { translationsSchema } from "./translations.validation";


export const createProvinceSchema = z.object({

    name:
        z.string()
        .min(
            2,
            "Province name is required"
        ),


    summary:
        z.string()
        .optional(),


    description:
        z.string()
        .optional(),


    latitude:
        z.number()
        .optional(),


    longitude:
        z.number()
        .optional(),


    translations:
        translationsSchema
            .optional()

});



export const updateProvinceSchema = z.object({

    name:
        z.string()
        .min(2)
        .optional(),


    summary:
        z.string()
        .optional(),


    description:
        z.string()
        .optional(),


    latitude:
        z.number()
        .optional(),


    longitude:
        z.number()
        .optional(),


    status:
        z.boolean()
        .optional(),


    translations:
        translationsSchema
            .optional()

});