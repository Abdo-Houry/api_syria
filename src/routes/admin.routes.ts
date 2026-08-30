import { Router } from "express";

import {
    login,
    profile,
    updateProfile
} from "../controllers/admin.controller";

import {
    authMiddleware
} from "../middleware/auth.middleware";


const router = Router();

// ==========================
// Login
// ==========================
router.post(
    "/login",
    login
);


// ==========================
// Profile
// ==========================
router.get(
    "/profile",
    authMiddleware,
    profile
);

router.put(
    "/profile",
    authMiddleware,
    updateProfile
);


export default router;