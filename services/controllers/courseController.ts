import express from 'express';
import type { Request, Response } from 'express';
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
);

export async function getCourses(req: Request, res: Response): Promise<void> {
  try {
    const { data, error } = await supabase.from("courses").select("*");
    if (error) {
      res.status(400).json({ 
        status: 'error',
        message: error.message 
      });
      return;
    }
    res.status(200).json({
      status: 'success',
      message: 'Cursos carregados com sucesso',
      data: data
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'error',
      message: "Erro interno no servidor" 
    });
  }
}
