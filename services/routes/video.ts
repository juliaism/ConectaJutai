import express, { Router } from "express";
import {getVideos, getVideoById, updateVideoProgress, markVideoAsWatched, getUserVideoProgress, getModuleProgress, getUserTotalProgress} from "../controllers/videoController";

const router: Router = express.Router();

router.get("/module/:moduleId", getVideos);
router.get("/:videoId", getVideoById);

router.put("/:videoId/progress", updateVideoProgress);
router.put("/:videoId/watched", markVideoAsWatched);
router.get("/:userId/:videoId/progress", getUserVideoProgress);
router.get("/:userId/module/:moduleId/progress", getModuleProgress);
router.get("/:userId/progress", getUserTotalProgress);

export default router;