import { Router } from "express";
import {
    createArea,
    getAreas,
    getAreaById,
    updateArea,
    deleteArea
} from "../controllers/area.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createArea);
router.get("/", getAreas);
router.get("/:id", getAreaById);
router.put("/:id", authMiddleware, updateArea);
router.delete("/:id", authMiddleware, deleteArea);

export default router;
