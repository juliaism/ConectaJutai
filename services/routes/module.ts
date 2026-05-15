import express, { Router } from "express"; 
import { getModules } from '../controllers/moduleController';

const router: Router = express.Router();

router.get('/:courseId', getModules);

export default router;
