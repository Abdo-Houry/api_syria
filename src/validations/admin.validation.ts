import { z } from "zod";


export const adminLoginSchema =
z.object({

    username:
        z.string()
        .min(3,"Username is required"),


    password:
        z.string()
        .min(6,"Password must be at least 6 characters")

});


export type AdminLoginInput =
    z.infer<typeof adminLoginSchema>;

/*
    تحديث حساب المشرف — الاسم و/أو كلمة المرور.
    كلمة المرور الحالية مطلوبة دائماً لتأكيد الهوية.
*/
export const updateAdminProfileSchema =
z.object({
    username:
        z.string()
        .trim()
        .min(3, "Username must be at least 3 characters")
        .optional(),
    currentPassword:
        z.string()
        .min(1, "Current password is required"),
    newPassword:
        z.string()
        .min(6, "Password must be at least 6 characters")
        .optional()
}).refine(
    (data) => data.username !== undefined || data.newPassword !== undefined,
    {
        message: "Nothing to update",
        path: ["username"]
    }
);

export type UpdateAdminProfileInput =
    z.infer<typeof updateAdminProfileSchema>;
