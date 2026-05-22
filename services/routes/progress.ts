import express, { Router } from "express";
import { saveProgress, syncProgress } from "../controllers/progressController.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";

const router: Router = express.Router();

router.post("/", authMiddleware, saveProgress);
router.post("/sync", authMiddleware, syncProgress);

export default router;
