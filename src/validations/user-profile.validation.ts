import {
    z
} from "zod";



export const updateProfileSchema = z.object({

    name:
        z.string()
            .min(2)
            .optional(),



    phone:
        z.string()
            .min(8)
            .optional(),



    email:
        z.string()
            .email()
            .optional(),



    image:
        z.string()
            .optional()

});