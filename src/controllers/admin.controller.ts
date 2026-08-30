import {
    Response
} from "express";


import {
    AuthRequest
} from "../middleware/auth.middleware";


import {
    adminLoginSchema,
    updateAdminProfileSchema
} from "../validations/admin.validation";


import {
    AdminService
} from "../services/admin.service";


import {
    asyncHandler
} from "../utils/async-handler";


import {
    ApiResponse
} from "../utils/api-response";



const adminService = new AdminService();



// ==========================
// Login
// ==========================

export const login =

    asyncHandler(

        async (
            req,
            res: Response
        ) => {


            const data =
                adminLoginSchema.parse(
                    req.body
                );


            const result =
                await adminService.login(

                    data.username,

                    data.password

                );


            res.json(

                new ApiResponse(

                    true,

                    "Login successfully",

                    result

                )

            );


        });




// ==========================
// Profile
// ==========================

export const profile =

    asyncHandler(

        async (
            req: AuthRequest,
            res: Response
        ) => {


            const profile =
                await adminService.getProfile(
                    req.admin!.id
                );

            res.json(
                new ApiResponse(
                    true,
                    "Admin profile",
                    profile
                )
            );
        });


// ==========================
// Update profile
// ==========================

export const updateProfile =
    asyncHandler(
        async (
            req: AuthRequest,
            res: Response
        ) => {
            const data =
                updateAdminProfileSchema.parse(
                    req.body
                );

            const result =
                await adminService.updateProfile(
                    req.admin!.id,
                    data
                );

            res.json(
                new ApiResponse(
                    true,
                    "Profile updated",
                    result
                )
            );
        });