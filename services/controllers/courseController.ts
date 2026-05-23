import type { Request, Response } from 'express';
import supabase from '../config/supabaseClient.ts';

export const getCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('GET /courses called');
    const { data, error } = await supabase
      .from('courses')
      .select('id, title, description, modules');

    if (error) {
      console.error('Erro ao buscar cursos:', error);
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('Erro geral:', err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};

export const getCourseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    console.log(`GET /courses/${id} called`);

    const { data, error } = await supabase
      .from('courses')
      .select('id, title, description, modules')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar cursos:', error);
      res.status(404).json({ error: 'Curso não encontrado' });
      return;
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('Erro geral:', err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};

export const createCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, modules } = req.body;
    console.log('POST /cursos chamado com:', { title, description, modules });

    if (!title || !modules) {
      res.status(400).json({ error: 'Título e módulos são obrigatórios' });
      return;
    }

    const { data, error } = await supabase
      .from('courses')
      .insert([{ title, description, modules }])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar curso:', error);
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(201).json(data);
  } catch (err) {
    console.error('Erro geral:', err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};

export const updateCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, modules } = req.body;
    console.log(`PUT /courses/${id} called with:`, { title, description, modules });

    if (!title && !description && !modules) {
      res.status(400).json({ error: 'É necessário atualizar pelo menos um campo' });
      return;
    }

    const { data, error } = await supabase
      .from('courses')
      .update({ title, description, modules })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar o curso:', error);
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('Erro geral:', err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};
