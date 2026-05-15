import { Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
);

export async function getCourses(req: Request, res: Response): Promise<void> {
  try {
    const { data, error } = await supabase.from("courses").select("*");

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}
