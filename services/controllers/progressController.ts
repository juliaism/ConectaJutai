import type { Request, Response } from 'express';
import supabase from '../config/supabaseClient.ts';

export async function checkAndUnlockNextModule(userId: string, courseId: string, moduleId: string): Promise<void> {
  try {
    console.log(`checkAndUnlockNextModule chamado para usuário ${userId}, course ${courseId}, module ${moduleId}`);

    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('modules')
      .eq('id', courseId)
      .single();

    if (courseError || !course) {
      console.error('Erro ao buscar curso:', courseError);
      return;
    }

    const modules = course.modules as any[];
    const currentModuleIndex = modules.findIndex((m: any) => m.id === moduleId);
    if (currentModuleIndex === -1) {
      console.error('Módulo não encontrado no curso');
      return;
    }

    const currentModule = modules[currentModuleIndex];
    const videoIds = currentModule.videos.map((v: any) => v.id);

    const { data: progressData, error: progressError } = await supabase
      .from('user_progress')
      .select('video_id, watched_duration, total_duration')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .eq('module_id', moduleId)
      .in('video_id', videoIds);

    if (progressError) {
      console.error('Erro ao buscar progresso:', progressError);
      return;
    }

    const allWatched = videoIds.every((videoId: string) => {
      const record = progressData?.find((p: any) => p.video_id === videoId);
      if (!record || !record.total_duration) return false;
      const percentage = (record.watched_duration / record.total_duration) * 100;
      return percentage == 100;
    });

    if (allWatched && currentModuleIndex < modules.length - 1) {
      const nextModule = modules[currentModuleIndex + 1];
      nextModule.unlocked = true;

      const { error: updateError } = await supabase
        .from('courses')
        .update({ modules: modules })
        .eq('id', courseId);

      if (updateError) {
        console.error('Erro ao desbloquear próximo módulo:', updateError);
      } else {
        console.log(`Módulo ${nextModule.id} desbloqueado com sucesso`);
      }
    }
  } catch (err) {
    console.error('Erro inesperado em checkAndUnlockNextModule:', err);
  }
}

export async function saveProgress(req: Request, res: Response): Promise<void> {
  try {
    const { userId, courseId, moduleId, videoId, watchedDuration, totalDuration } = req.body;

    if (!userId || !courseId || !moduleId || !videoId || watchedDuration === undefined || totalDuration === undefined) {
      res.status(400).json({ error: 'Campos obrigatórios faltando' });
      return;
    }

    const { error: upsertError } = await supabase
      .from('user_progress')
      .upsert(
        {
          user_id: userId,
          course_id: courseId,
          module_id: moduleId,
          video_id: videoId,
          watched_duration: watchedDuration,
          total_duration: totalDuration,
        },
        { onConflict: 'user_id,course_id,module_id,video_id' }
      );

    if (upsertError) {
      console.error('Erro ao salvar:', upsertError);
      res.status(500).json({ error: 'Erro ao salvar o progresso' });
      return;
    }

    await checkAndUnlockNextModule(userId, courseId, moduleId);

    res.json({ success: true });
  } catch (err) {
    console.error('Erro em saveProgress:', err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

export async function syncProgress(req: Request, res: Response): Promise<void> {
  try {
    const { userId, progressList } = req.body;

    if (!userId || !progressList || !Array.isArray(progressList) || progressList.length === 0) {
      res.status(400).json({ error: 'userId ou progressList ausentes' });
      return;
    }

    for (const item of progressList) {
      const { courseId, moduleId, videoId, watchedDuration, totalDuration } = item;

      if (!courseId || !moduleId || !videoId || watchedDuration === undefined || totalDuration === undefined) {
        console.error('Item de progresso inválido:', item);
        continue;
      }

      const { error: upsertError } = await supabase
        .from('user_progress')
        .upsert(
          {
            user_id: userId,
            course_id: courseId,
            module_id: moduleId,
            video_id: videoId,
            watched_duration: watchedDuration,
            total_duration: totalDuration,
          },
          { onConflict: 'user_id,course_id,module_id,video_id' }
        );

      if (upsertError) {
        console.error('Erro ao salvar item:', item, upsertError);
        continue;
      }

      await checkAndUnlockNextModule(userId, courseId, moduleId);
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Erro em syncProgress:', err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

export async function getCourseProgress(req: Request, res: Response): Promise<void> {
  try {
    const { userId, courseId } = req.params;

    if (!userId || !courseId) {
      res.status(400).json({ error: 'userId ou courseId ausentes' });
      return;
    }

    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('modules')
      .eq('id', courseId)
      .single();

    if (courseError || !course) {
      console.error('Erro ao buscar curso:', courseError);
      res.status(404).json({ error: 'Curso não encontrado' });
      return;
    }

    const modules = course.modules as any[];
    let totalVideos = 0;
    let watchedVideos = 0;
    let completedModules = 0;

    for (const module of modules) {
      const videoIds = module.videos.map((v: any) => v.id);
      totalVideos += videoIds.length;

      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('video_id, watched_duration, total_duration')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .eq('module_id', module.id)
        .in('video_id', videoIds);

      if (progressError) {
        console.error('Erro ao buscar progresso:', progressError);
        continue;
      }

      for (const video of module.videos) {
        const record = progressData?.find((p: any) => p.video_id === video.id);
        if (record && record.total_duration > 0) {
          const percentage = (record.watched_duration / record.total_duration) * 100;
          if (percentage == 100) {
            watchedVideos++;
          }
        }
      }

      const moduleCompleted = videoIds.every((videoId: string) => {
        const record = progressData?.find((p: any) => p.video_id === videoId);
        if (!record || !record.total_duration) return false;
        const percentage = (record.watched_duration / record.total_duration) * 100;
        return percentage == 100;
      });

      if (moduleCompleted) {
        completedModules++;
      }
    }

    const percentage = totalVideos > 0 ? Math.round((watchedVideos / totalVideos) * 100) : 0;

    res.json({
      watchedVideos,
      totalVideos,
      completedModules,
      percentage
    });
  } catch (err) {
    console.error('Erro em getCourseProgress:', err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
}
