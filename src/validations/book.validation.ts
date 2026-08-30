import { z } from "zod";

import { translationsSchema } from "./translations.validation";



export const createBookSchema =

    z.object({


        name:
            z.string()
                .min(3),



        description:
            z.string()
                .optional(),



        provinceId:
            z.number(),



        placeIds:
            z.array(
                z.number()
            ),



        challengeIds:
            z.array(
                z.number()
            ),



        stampIds:
            z.array(
                z.number()
            ),



        partnerIds:
            z.array(
                z.number()
            ),



        translations:


            translationsSchema


                .optional()



    });