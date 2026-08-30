import { z } from "zod";

import { translationsSchema } from "./translations.validation";



export const createFAQSchema =

    z.object({


        question:
            z.string()
                .min(3),



        answer:
            z.string()
                .min(3),



        translations:


            translationsSchema


                .optional()



    });







export const updateFAQSchema =

    z.object({


        question:
            z.string()
                .optional(),



        answer:
            z.string()
                .optional(),



        status:
            z.boolean()
                .optional(),



        translations:


            translationsSchema


                .optional()



    });