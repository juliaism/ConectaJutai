import express, { Router } from "express";
import { getCourses } from '../controllers/courseController';

const router: Router = express.Router();

router.get('/', getCourses);

export default router;
