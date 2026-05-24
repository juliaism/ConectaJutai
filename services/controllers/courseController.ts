import supabase from '../config/supabaseClient.ts';

interface Course {
  id?: number;
  title: string;
  description: string;
  modules: string[];
  created_at?: string;
}

export async function getCourses(): Promise<Course[]> {
  try {
    console.log('Buscando todos os cursos...');
    const { data, error } = await supabase.from('courses').select('*');
    if (error) {
      console.error('Erro ao buscar cursos:', error.message);
      throw new Error(error.message);
    }
    return data as Course[];
  } catch (err) {
    console.error('Erro inesperado em getCourses:', err);
    throw err;
  }
}

export async function getCourseById(id: number): Promise<Course | null> {
  try {
    console.log(`Buscando curso com ID: ${id}`);
    const { data, error } = await supabase.from('courses').select('*').eq('id', id).single();
    if (error) {
      console.error('Erro ao buscar curso por ID:', error.message);
      throw new Error(error.message);
    }
    return data as Course | null;
  } catch (err) {
    console.error('Erro inesperado em getCourseById:', err);
    throw err;
  }
}

export async function createCourse(course: { title: string; description: string; modules: string[] }): Promise<Course> {
  try {
    console.log('Criando novo curso...', course);
    const { data, error } = await supabase.from('courses').insert(course).select('*').single();
    if (error) {
      console.error('Erro ao criar curso:', error.message);
      throw new Error(error.message);
    }
    return data as Course;
  } catch (err) {
    console.error('Erro inesperado em createCourse:', err);
    throw err;
  }
}
export async function updateCourse(id: number, updates: Partial<Course>): Promise<Course> {
  try {
    console.log(`Atualizando curso ID ${id} com:`, updates);
    const { data, error } = await supabase.from('courses').update(updates).eq('id', id).select('*').single();
    if (error) {
      console.error('Erro ao atualizar curso:', error.message);
      throw new Error(error.message);
    }
    return data as Course;
  } catch (err) {
    console.error('Erro inesperado em updateCourse:', err);
    throw err;
  }
}
