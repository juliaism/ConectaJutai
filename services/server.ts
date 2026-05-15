import express, { Request, Response } from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth";
import courseRoutes from "./routes/course";
import moduleRoutes from "./routes/module";
import videoRoutes from "./routes/video";
import progressRoutes from "./routes/progress";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/courses", courseRoutes);
app.use("/modules", moduleRoutes);
app.use("/videos", videoRoutes);
app.use("/progress", progressRoutes);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Backend ConectaJutai rodando" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

