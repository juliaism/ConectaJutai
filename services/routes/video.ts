import express, { Router } from "express";
import { getVideos } from '../controllers/videoController';

const router: Router = express.Router();

router.get('/:moduleId', getVideos);

export default router;
