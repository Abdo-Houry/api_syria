import { z } from "zod";
import { translationsSchema } from "./translations.validation";

/*
    خيارات الإجابة — من 2 إلى 6 خيارات، ودليل الإجابة الصحيحة ضمن المدى.
*/
const optionsSchema =
    z.array(z.string().trim().min(1))
        .min(2)
        .max(6);

export const createChallengeSchema =
    z.object({
        placeId: z.number(),
        title: z.string().min(2),
        description: z.string().optional(),
        type: z.string().optional(),
        options: optionsSchema,
        correct_option: z.number().int().min(0),
        translations: translationsSchema.optional()
    }).refine(
        (data) => data.correct_option < data.options.length,
        {
            message: "correct_option is out of range",
            path: ["correct_option"]
        }
    );

export const updateChallengeSchema =
    z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        type: z.string().optional(),
        status: z.boolean().optional(),
        options: optionsSchema.optional(),
        correct_option: z.number().int().min(0).optional(),
        translations: translationsSchema.optional()
    }).refine(
        (data) =>
            data.options === undefined ||
            data.correct_option === undefined ||
            data.correct_option < data.options.length,
        {
            message: "correct_option is out of range",
            path: ["correct_option"]
        }
    );
