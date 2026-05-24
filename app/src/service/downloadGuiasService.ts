import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface GuideData {
  id: string;
  titulo: string;
  texto: string;
  videoPath: string;
  videoSize: number;
  downloadedAt?: string;
}

const GUIDES_DIR = `${FileSystem.documentDirectory}guides/`;
const GUIDES_CACHE_KEY = 'downloaded_guides';

export const downloadGuideService = {
  ensureGuideDirectory: async (): Promise<void> => {
    try {
      const dirInfo = await FileSystem.getInfoAsync(GUIDES_DIR);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(GUIDES_DIR, { intermediates: true });
      }
    } catch (err) {
      console.error('Erro ao criar diretório:', err);
    }
  },

  downloadGuide: async (
    guide: GuideData,
    onProgress?: (progress: number) => void
  ): Promise<GuideData> => {
    try {
      await downloadGuideService.ensureGuideDirectory();

      const guideDir = `${GUIDES_DIR}${guide.id}/`;
      await FileSystem.makeDirectoryAsync(guideDir, { intermediates: true });

      const videoFileName = `${guide.id}.mp4`;
      const videoPath = `${guideDir}${videoFileName}`;

      const downloadResumable = FileSystem.createDownloadResumable(
        guide.videoPath,
        videoPath,
        {},
        (downloadProgress) => {
          const progress = 
            downloadProgress.totalBytesWritten / 
            downloadProgress.totalBytesExpectedToWrite;
          onProgress?.(Math.round(progress * 100));
        }
      );

      const result = await downloadResumable.downloadAsync();

      if (!result?.uri) {
        throw new Error('Erro ao baixar vídeo');
      }

      const guideMetadata: GuideData = {
        ...guide,
        videoPath: result.uri,
        downloadedAt: new Date().toISOString(),
      };

      const downloadedGuides = await downloadGuideService.getDownloadedGuides();
      const updatedGuides = downloadedGuides.filter((g) => g.id !== guide.id);
      updatedGuides.push(guideMetadata);

      await AsyncStorage.setItem(
        GUIDES_CACHE_KEY,
        JSON.stringify(updatedGuides)
      );

      return guideMetadata;
    } catch (err) {
      console.error('Erro ao baixar guia:', err);
      throw err;
    }
  },

  getDownloadedGuides: async (): Promise<GuideData[]> => {
    try {
      const cached = await AsyncStorage.getItem(GUIDES_CACHE_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  },

  isGuideDownloaded: async (guideId: string): Promise<boolean> => {
    try {
      const guides = await downloadGuideService.getDownloadedGuides();
      return guides.some((g) => g.id === guideId);
    } catch {
      return false;
    }
  },

  getDownloadedGuide: async (guideId: string): Promise<GuideData | null> => {
    try {
      const guides = await downloadGuideService.getDownloadedGuides();
      return guides.find((g) => g.id === guideId) || null;
    } catch {
      return null;
    }
  },

  deleteGuide: async (guideId: string): Promise<void> => {
    try {
      const guideDir = `${GUIDES_DIR}${guideId}/`;
      await FileSystem.deleteAsync(guideDir);

      const guides = await downloadGuideService.getDownloadedGuides();
      const updated = guides.filter((g) => g.id !== guideId);
      await AsyncStorage.setItem(GUIDES_CACHE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Erro ao deletar guia:', err);
    }
  },

  getAvailableSpace: async (): Promise<number> => {
    try {
      return await FileSystem.getFreeDiskStorageAsync();
    } catch {
      return 0;
    }
  },

 getTotalDownloadedSize: async (): Promise<number> => {
  try {
    const dirInfo = await FileSystem.getInfoAsync(GUIDES_DIR);
    if (!dirInfo.exists) return 0;

    const files = await FileSystem.readDirectoryAsync(GUIDES_DIR);
    let totalSize = 0;

    for (const file of files) {
      const filePath = `${GUIDES_DIR}${file}`;
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      
      if (fileInfo.exists && !fileInfo.isDirectory) {
        try {
          const stat = await FileSystem.getInfoAsync(filePath);
          if (stat && typeof stat === 'object' && 'size' in stat) {
            totalSize += (stat as any).size || 0;
          }
        } catch {
          continue;
        }
      }
    }
    return totalSize;
  } catch {
    return 0;
  }
},

cleanOldGuides: async (daysOld: number = 30): Promise<void> => {
  try {
    const guides = await downloadGuideService.getDownloadedGuides();
    const now = new Date().getTime();
    const thirtyDaysAgo = now - daysOld * 24 * 60 * 60 * 1000;

    for (const guide of guides) {
      if (guide.downloadedAt) {
        const downloadDate = new Date(guide.downloadedAt).getTime();
        
        if (downloadDate < thirtyDaysAgo) {
          console.log(`Deletando guia antigo: ${guide.id}`);
          await downloadGuideService.deleteGuide(guide.id);
        }
      }
    }

    console.log('Limpeza de guias antigos concluída');
  } catch (err) {
    console.error('Erro ao limpar guias:', err);
    throw err;
  }
},

syncOfflineProgress: async (userId: string): Promise<void> => {
  try {
    const guides = await downloadGuideService.getDownloadedGuides();
    
    if (!guides || guides.length === 0) {
      console.log('Nenhum guia para sincronizar');
      return;
    }
    
    console.log(`Sincronizando ${guides.length} guias...`);

    console.log('Sincronização concluída');
  } catch (err) {
    console.error('Erro ao sincronizar:', err);
    throw err;
  }
},
};