import express from 'express';
import { saveProgress, syncProgress, getCourseProgress } from '../controllers/progressController';

const router = express.Router();

router.post('/progress', saveProgress);
router.post('/progress/sync', syncProgress);
router.get('/progress/:userId/:courseId', getCourseProgress);

export default router;