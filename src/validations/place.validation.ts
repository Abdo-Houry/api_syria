import { z } from "zod";

import { translationsSchema } from "./translations.validation";



export const createPlaceSchema =
    z.object({


        provinceId:
            z.number(),

        areaId:
            z.number()
                .int()
                .positive()
                .nullable()
                .optional(),

        


        name:
            z.string()
                .min(2),



        summary:
            z.string()
                .optional(),



        description:
            z.string()
                .optional(),



        visit_info:
            z.string()
                .optional(),



        latitude:
            z.number()
                .optional(),



        longitude:
            z.number()
                .optional(),


        isExploration:
            z.boolean()
                .optional()
,



        translations:



            translationsSchema


                .optional()



    });





export const updatePlaceSchema =
    z.object({


        name:
            z.string()
                .optional(),


        summary:
            z.string()
                .optional(),


        description:
            z.string()
                .optional(),


        visit_info:
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

        areaId:
            z.number()
                .int()
                .positive()
                .nullable()
                .optional(),


        isExploration:
            z.boolean()
                .optional()
,



        translations:



            translationsSchema


                .optional()



    });