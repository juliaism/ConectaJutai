import express from 'express';
import type { Request, Response } from 'express';
import dotenv from "dotenv";

import authRoutes from "./routes/auth.ts";
import courseRoutes from "./routes/course.ts";
import moduleRoutes from "./routes/module.ts";
import videoRoutes from "./routes/video.ts";
import progressRoutes from "./routes/progress.ts";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/progress", progressRoutes);


app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Backend ConectaJutai rodando" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

