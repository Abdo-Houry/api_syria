import {
    z
} from "zod";



export const collectStampSchema = z.object({

    stampId:
        z.number(),



    /*
        نسخة الكتيّب التي يُضاف إليها الطابع.
        اختياري: يُستنتج من كتيّبات المستخدم عند غيابه.
    */

    userBookId:
        z.number()
            .int()
            .positive()
            .optional()

});
