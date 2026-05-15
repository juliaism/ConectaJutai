import express, { Router } from "express";
import { saveProgress, syncProgress } from "../controllers/progressController";
import { authMiddleware } from "../middleware/authMiddleware";

const router: Router = express.Router();

router.post("/", authMiddleware, saveProgress);
router.post("/sync", authMiddleware, syncProgress);

export default router;
