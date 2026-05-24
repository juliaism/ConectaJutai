import axios from 'axios';

const API_BASE_URL = 'https://conectajutai.onrender.com/api';

export interface VideoResponse {
  id: string;
  module_id: string;
  title: string;
  description: string;
  url: string;
  duration: number;
  order_index: number;
  thumbnail?: string;
}

export interface ProgressResponse {
  user_id: string;
  video_id: string;
  progress: number;
  watched: boolean;
  watched_at?: string;
}

export const videoApiService = {
  getVideosByModule: async (moduleId: string): Promise<VideoResponse[]> => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/videos/module/${moduleId}`
      );
      return response.data;
    } catch (err) {
      console.error('Erro ao buscar vídeos:', err);
      throw err;
    }
  },

  getVideoById: async (videoId: string): Promise<VideoResponse> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/videos/${videoId}`);
      return response.data;
    } catch (err) {
      console.error('Erro ao buscar vídeo:', err);
      throw err;
    }
  },

  updateVideoProgress: async (
    videoId: string,
    progress: number,
    userId: string
  ): Promise<ProgressResponse> => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/videos/${videoId}/progress`,
        { progress, userId }
      );
      return response.data.data;
    } catch (err) {
      console.error('Erro ao atualizar progresso:', err);
      throw err;
    }
  },

  markVideoAsWatched: async (
    videoId: string,
    userId: string
  ): Promise<ProgressResponse> => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/videos/${videoId}/watched`,
        { userId }
      );
      return response.data.data;
    } catch (err) {
      console.error('Erro ao marcar como assistido:', err);
      throw err;
    }
  },

  getUserVideoProgress: async (
    userId: string,
    videoId: string
  ): Promise<ProgressResponse> => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/videos/${userId}/${videoId}/progress`
      );
      return response.data;
    } catch (err) {
      console.error('Erro ao buscar progresso:', err);
      throw err;
    }
  },

  getModuleProgress: async (
    userId: string,
    moduleId: string
  ): Promise<{
    moduleId: string;
    userId: string;
    progress: number;
    watched: number;
    total: number;
    percentage: number;
    videos: ProgressResponse[];
  }> => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/videos/${userId}/module/${moduleId}/progress`
      );
      return response.data;
    } catch (err) {
      console.error('Erro ao buscar progresso do módulo:', err);
      throw err;
    }
  },

  getUserTotalProgress: async (userId: string): Promise<{
    userId: string;
    totalProgress: number;
    videosWatched: number;
    totalVideos: number;
    progressDetails: ProgressResponse[];
  }> => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/videos/${userId}/progress`
      );
      return response.data;
    } catch (err) {
      console.error('Erro ao buscar progresso total:', err);
      throw err;
    }
  },

  syncOfflineProgress: async (
    userId: string,
    progressList: Array<{ videoId: string; progress: number }>
  ): Promise<void> => {
    try {
      for (const item of progressList) {
        await videoApiService.updateVideoProgress(
          item.videoId,
          item.progress,
          userId
        );
      }
      console.log('Progresso sincronizado com sucesso');
    } catch (err) {
      console.error('Erro ao sincronizar progresso:', err);
      throw err;
    }
  },
};