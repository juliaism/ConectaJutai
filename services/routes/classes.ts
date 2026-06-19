import express from "express";
import { getClasses } from "../controllers/classesController.ts";

const router = express.Router();

router.get("/", getClasses);

export default router;
