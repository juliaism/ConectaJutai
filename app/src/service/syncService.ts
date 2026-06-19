import AsyncStorage from '@react-native-async-storage/async-storage';
import { videoApiService } from './videoApiService';
import NetInfo from '@react-native-community/netinfo';

const OFFLINE_PROGRESS_KEY = 'offline_progress';
const SYNC_QUEUE_KEY = 'sync_queue';

export const syncService = {
  saveOfflineProgress: async (
    userId: string,
    videoId: string,
    progress: number
  ): Promise<void> => {
    try {
      const offlineData = await AsyncStorage.getItem(OFFLINE_PROGRESS_KEY);
      const progressList = offlineData ? JSON.parse(offlineData) : [];

      const index = progressList.findIndex(
        (p: any) => p.videoId === videoId && p.userId === userId
      );

      if (index >= 0) {
        progressList[index].progress = progress;
        progressList[index].timestamp = new Date().toISOString();
      } else {
        progressList.push({
          userId,
          videoId,
          progress,
          timestamp: new Date().toISOString(),
        });
      }

      await AsyncStorage.setItem(
        OFFLINE_PROGRESS_KEY,
        JSON.stringify(progressList)
      );
      console.log('Progresso salvo offline');
    } catch (err) {
      console.error('Erro ao salvar progresso offline:', err);
    }
  },

  syncWhenOnline: async (userId: string): Promise<void> => {
    try {
      const state = await NetInfo.fetch();
      if (!state.isConnected) {
        console.log('Sem conexão. Aguardando...');
        return;
      }

      const offlineData = await AsyncStorage.getItem(OFFLINE_PROGRESS_KEY);
      if (!offlineData) {
        console.log('Nenhum dado para sincronizar');
        return;
      }

      const progressList = JSON.parse(offlineData);
      const userProgress = progressList.filter(
        (p: any) => p.userId === userId
      );

      if (userProgress.length === 0) {
        console.log('Nenhum progresso do usuário para sincronizar');
        return;
      }

      console.log(`🔄 Sincronizando ${userProgress.length} itens...`);

      for (const item of userProgress) {
        try {
          await videoApiService.updateVideoProgress(
            item.videoId,
            item.progress,
            userId
          );
        } catch (err) {
          console.error(`Erro ao sincronizar ${item.videoId}:`, err);
        }
      }

      const remainingProgress = progressList.filter(
        (p: any) => p.userId !== userId
      );
      if (remainingProgress.length > 0) {
        await AsyncStorage.setItem(
          OFFLINE_PROGRESS_KEY,
          JSON.stringify(remainingProgress)
        );
      } else {
        await AsyncStorage.removeItem(OFFLINE_PROGRESS_KEY);
      }

      console.log('Sincronização concluída');
    } catch (err) {
      console.error('Erro ao sincronizar:', err);
    }
  },

  startAutoSync: (userId: string): (() => void) => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        console.log('Conexão restaurada. Sincronizando...');
        syncService.syncWhenOnline(userId);
      }
    });

    return unsubscribe;
  },

  getOfflineProgress: async (): Promise<any[]> => {
    try {
      const data = await AsyncStorage.getItem(OFFLINE_PROGRESS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  clearOfflineProgress: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(OFFLINE_PROGRESS_KEY);
      console.log('Dados offline limpos');
    } catch (err) {
      console.error('Erro ao limpar dados offline:', err);
    }
  },
};