import type { Request, Response } from 'express';
import { Router } from 'express';
import { getCourses, getCourseById, createCourse, updateCourse } from '../controllers/courseController.ts';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const courses = await getCourses();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const course = await getCourseById(id);
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const course = await createCourse(req.body);
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const course = await updateCourse(id, req.body);
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});

export default router;