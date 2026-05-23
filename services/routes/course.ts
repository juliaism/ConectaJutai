import express from 'express';
import { getCourses, getCourseById, createCourse, updateCourse } from '../controllers/courseController.ts';

const router = express.Router();

router.get('/', getCourses);         
router.get('/:id', getCourseById);   
router.post('/', createCourse);    
router.put('/:id', updateCourse);   

export default router;