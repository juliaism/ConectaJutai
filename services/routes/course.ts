import express from 'express';
import { getCourses, getCourseById, createCourse, updateCourse } from '../controllers/courseController.ts';

const router = express.Router();

router.get('/courses', getCourses);

router.get('/courses/:id', getCourseById);

router.post('/courses', createCourse);

router.put('/courses/:id', updateCourse);

export default router;
