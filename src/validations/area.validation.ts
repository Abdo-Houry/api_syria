import { z } from "zod";
import { translationsSchema } from "./translations.validation";

export const createAreaSchema = z.object({
    provinceId: z.number().int().positive(),
    name: z.string().min(2),
    description: z.string().optional(),
    translations: translationsSchema.optional()
});

export const updateAreaSchema = z.object({
    provinceId: z.number().int().positive().optional(),
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    status: z.boolean().optional(),
    translations: translationsSchema.optional()
});
