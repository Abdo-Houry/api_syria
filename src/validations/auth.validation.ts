import {
    z
} from "zod";



export const unifiedLoginSchema = z.object({


    /*
       رقم هاتف المستخدم أو اسم مستخدم المشرف.
    */

    identifier:
        z.string()
            .trim()
            .min(3),



    password:
        z.string()
            .min(1)


});
