import express from 'express';
import type { Request, Response } from 'express';
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
);

export const getCourses = async (req: Request, res: Response) => {
  try {
    console.log('Buscando cursos do Supabase...');

    const { data: courses, error: coursesError } = await supabase
      .from("courses")
      .select("id, title, description, level, unlocked, created_at");
    
    console.log('✅ Cursos encontrados:', courses?.length);
    console.log('📊 Cursos:', courses);
    
    if (coursesError) {
      console.error('Erro ao buscar cursos:', coursesError);
      return res.status(500).json({ status: "error", message: coursesError.message });
    }

    const coursesWithModules = await Promise.all(
      (courses || []).map(async (course) => {
        const { data: modules } = await supabase
          .from("modules")
          .select("id, title, level, order_index, created_at")
          .eq("course_id", course.id);
        
        console.log(`Módulos do curso ${course.id}:`, modules?.length);
    
        const modulesWithVideos = await Promise.all(
          (modules || []).map(async (module) => {
            const { data: videos } = await supabase
              .from("videos")
              .select("id, title, url, duration, order_index, created_at")
              .eq("module_id", module.id);
            
            return { ...module, videos: videos || [] };
          })
        );
        
        return { ...course, modules: modulesWithVideos };
      })
    );

    console.log('✅ Resposta final:', JSON.stringify(coursesWithModules, null, 2));

    res.status(200).json({
      status: "success",
      message: "Cursos carregados com sucesso",
      data: coursesWithModules
    });
  } catch (error) {
    console.error('Erro ao buscar cursos:', error);
    res.status(500).json({ status: "error", message: "Erro ao buscar cursos" });
  }
};
