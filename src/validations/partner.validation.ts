import { z } from "zod";

import { translationsSchema } from "./translations.validation";



export const createPartnerSchema =

    z.object({


        name:
            z.string()
                .min(2),



        description:
            z.string()
                .optional(),



        image_url:
            z.string(),



        discount_percentage:
            z.number()
                .min(0)
                .max(100),



        translations:


            translationsSchema


                .optional()



    });







export const updatePartnerSchema =

    z.object({


        name:
            z.string()
                .optional(),



        description:
            z.string()
                .optional(),



        image_url:
            z.string()
                .optional(),



        discount_percentage:
            z.number()
                .min(0)
                .max(100)
                .optional(),



        status:
            z.boolean()
                .optional(),



        translations:


            translationsSchema


                .optional()



    });