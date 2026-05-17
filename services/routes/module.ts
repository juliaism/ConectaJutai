import express, { Router } from "express"; 
import { getModules } from '../controllers/moduleController.ts';

const router: Router = express.Router();

router.get('/:courseId', getModules);

export default router;
