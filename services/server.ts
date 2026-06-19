import express from 'express';
import type { Request, Response } from 'express';
import 'dotenv/config'

import authRoutes from "./routes/auth.ts";
import courseRoutes from "./routes/course.ts";
import progressRoutes from "./routes/progress.ts";
import classesRoutes from "./routes/classes.ts";


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/classes", classesRoutes);


app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Backend ConectaJutai rodando" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
