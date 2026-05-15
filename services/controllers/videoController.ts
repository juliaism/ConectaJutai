import { Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
);

export async function getVideos(req: Request, res: Response): Promise<void> {
  const { moduleId } = req.params;

  try {
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .eq("module_id", moduleId)
      .order("order_index", { ascending: true });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}

