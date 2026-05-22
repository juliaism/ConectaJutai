import express, { Router } from "express";
import { signup, login, resetPassword } from '../controllers/authController.ts';

const router: Router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/reset', resetPassword);

export default router;
