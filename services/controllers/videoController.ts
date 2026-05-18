import express from 'express';
import type { Request, Response } from 'express';
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
);

function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export async function getVideos(req: Request, res: Response): Promise<void> {
  const { moduleId } = req.params;

  if (!isValidUUID(moduleId)) {
    res.status(400).json({ error: "ID do módulo inválido" });
    return;
  }

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

    if (!data || data.length === 0) {
      res.json({ message: "Nenhum vídeo encontrado", videos: [] });
      return;
    }

    res.json(data);
  } catch (err) {
    console.error("Erro ao buscar vídeos:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}

export async function getVideoById(req: Request, res: Response): Promise<void> {
  const { videoId } = req.params;

  if (!isValidUUID(videoId)) {
    res.status(400).json({ error: "ID do vídeo inválido" });
    return;
  }

  try {
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .eq("id", videoId)
      .single();

    if (error) {
      res.status(404).json({ error: "Vídeo não encontrado" });
      return;
    }

    res.json(data);
  } catch (err) {
    console.error("Erro ao buscar vídeo:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}

export async function updateVideoProgress(req: Request, res: Response): Promise<void> {
  const { videoId } = req.params;
  const { progress, userId } = req.body;

  if (!isValidUUID(videoId) || !isValidUUID(userId)) {
    res.status(400).json({ error: "IDs inválidos" });
    return;
  }

  if (progress === undefined || progress === null || progress < 0 || progress > 100) {
    res.status(400).json({ error: "Progresso deve estar entre 0 e 100" });
    return;
  }

  try {
    const { data, error } = await supabase
      .from("user_video_progress")
      .upsert({
        user_id: userId,
        video_id: videoId,
        progress: Math.round(progress),
        updated_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.json({
      message: "Progresso atualizado com sucesso",
      data: data?.[0],
    });
  } catch (err) {
    console.error("Erro ao atualizar progresso:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}

export async function markVideoAsWatched(req: Request, res: Response): Promise<void> {
  const { videoId } = req.params;
  const { userId } = req.body;

  if (!isValidUUID(videoId) || !isValidUUID(userId)) {
    res.status(400).json({ error: "IDs inválidos" });
    return;
  }

  try {
    const { data, error } = await supabase
      .from("user_video_progress")
      .upsert({
        user_id: userId,
        video_id: videoId,
        progress: 100,
        watched: true,
        watched_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.json({
      message: "Vídeo marcado como assistido",
      data: data?.[0],
    });
  } catch (err) {
    console.error("Erro ao marcar como assistido:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}

export async function getUserVideoProgress(req: Request, res: Response): Promise<void> {
  const { userId, videoId } = req.params;

  // Validar IDs
  if (!isValidUUID(userId) || !isValidUUID(videoId)) {
    res.status(400).json({ error: "IDs inválidos" });
    return;
  }

  try {
    const { data, error } = await supabase
      .from("user_video_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("video_id", videoId)
      .single();

    if (error) {
      res.json({
        user_id: userId,
        video_id: videoId,
        progress: 0,
        watched: false,
      });
      return;
    }

    res.json(data);
  } catch (err) {
    console.error("Erro ao buscar progresso do vídeo:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}

export async function getModuleProgress(req: Request, res: Response): Promise<void> {
  const { userId, moduleId } = req.params;

  if (!isValidUUID(userId) || !isValidUUID(moduleId)) {
    res.status(400).json({ error: "IDs inválidos" });
    return;
  }

  try {
    const { data: videos, error: videosError } = await supabase
      .from("videos")
      .select("id")
      .eq("module_id", moduleId);

    if (videosError) {
      res.status(400).json({ error: videosError.message });
      return;
    }

    if (!videos || videos.length === 0) {
      res.json({
        moduleId,
        userId,
        progress: 0,
        watched: 0,
        total: 0,
        percentage: 0,
      });
      return;
    }

    const videoIds = videos.map((v) => v.id);
    const { data: progress, error: progressError } = await supabase
      .from("user_video_progress")
      .select("*")
      .eq("user_id", userId)
      .in("video_id", videoIds);

    if (progressError) {
      res.status(400).json({ error: progressError.message });
      return;
    }

    const watched = progress?.filter((p) => p.watched).length || 0;
    const total = videos.length;
    const percentage = Math.round((watched / total) * 100);

    res.json({
      moduleId,
      userId,
      progress: percentage,
      watched,
      total,
      videos: progress || [],
    });
  } catch (err) {
    console.error("Erro ao buscar progresso do módulo:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}

export async function getUserTotalProgress(req: Request, res: Response): Promise<void> {
  const { userId } = req.params;

  // Validar ID
  if (!isValidUUID(userId)) {
    res.status(400).json({ error: "ID de usuário inválido" });
    return;
  }

  try {
    const { data: allVideos, error: videosError } = await supabase
      .from("videos")
      .select("id");

    if (videosError) {
      res.status(400).json({ error: videosError.message });
      return;
    }

    const { data: userProgress, error: progressError } = await supabase
      .from("user_video_progress")
      .select("*")
      .eq("user_id", userId);

    if (progressError) {
      res.status(400).json({ error: progressError.message });
      return;
    }

    const watched = userProgress?.filter((p) => p.watched).length || 0;
    const total = allVideos?.length || 0;
    const percentage = total > 0 ? Math.round((watched / total) * 100) : 0;

    res.json({
      userId,
      totalProgress: percentage,
      videosWatched: watched,
      totalVideos: total,
      progressDetails: userProgress || [],
    });
  } catch (err) {
    console.error("Erro ao buscar progresso total:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}
