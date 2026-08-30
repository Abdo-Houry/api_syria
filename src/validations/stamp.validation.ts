import { z } from "zod";

import { translationsSchema } from "./translations.validation";



export const createStampSchema =

    z.object({

        placeId:
            z.number(),


        name:
            z.string()
                .min(2),


        description:
            z.string()
                .optional(),


        image_url:
            z.string(),



        translations:


            translationsSchema


                .optional()



    });






export const updateStampSchema =

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


        status:
            z.boolean()
                .optional(),



        translations:


            translationsSchema


                .optional()



    });