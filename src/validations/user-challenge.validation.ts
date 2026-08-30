import {
    z
} from "zod";



export const solveChallengeSchema = z.object({

    challengeId:
        z.number(),



    answer:
        z.string()
            .min(1),



    /*
        نسخة الكتيّب التي يُحتسب فيها الإنجاز.
        اختياري: يُستنتج من كتيّبات المستخدم عند غيابه.
    */

    userBookId:
        z.number()
            .int()
            .positive()
            .optional()

});
