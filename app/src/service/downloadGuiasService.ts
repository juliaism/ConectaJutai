import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';

interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
}

interface Module {
  id: string;
  title: string;
  videos: Video[];
}

interface Video {
  id: string;
  title: string;
  url: string;
  duration: number;
}

interface GuideInfo {
  id: string;
  courseId: string;
  title: string;
  filePath: string;
  size: number;
}

const API_BASE_URL = 'https://conectajutai.onrender.com/api';
const DOWNLOADED_COURSE_IDS_KEY = 'downloaded_course_ids';

const CourseService = {
  async fetchCourses(): Promise<Course[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/courses`);
      const courses: Course[] = await response.json();
      await AsyncStorage.setItem('courses', JSON.stringify(courses));
      return courses;
    } catch (error) {
      console.error('Falha ao buscar cursos:', error);
      return [];
    }
  },

  async getStoredCourses(): Promise<Course[]> {
    try {
      const data = await AsyncStorage.getItem('courses');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Falha ao obter cursos armazenados:', error);
      return [];
    }
  },

  async saveDownloadedCourseId(courseId: string): Promise<void> {
    try {
      const storedIds = await AsyncStorage.getItem(DOWNLOADED_COURSE_IDS_KEY);
      const ids: string[] = storedIds ? JSON.parse(storedIds) : [];
      if (!ids.includes(courseId)) {
        ids.push(courseId);
        await AsyncStorage.setItem(DOWNLOADED_COURSE_IDS_KEY, JSON.stringify(ids));
      }
    } catch (error) {
      console.error('Falha ao salvar ID do curso baixado:', error);
    }
  },

  async isCourseDownloaded(courseId: string): Promise<boolean> {
    try {
      const storedIds = await AsyncStorage.getItem(DOWNLOADED_COURSE_IDS_KEY);
      const ids: string[] = storedIds ? JSON.parse(storedIds) : [];
      return ids.includes(courseId);
    } catch (error) {
      console.error('Falha ao verificar status de download do curso:', error);
      return false;
    }
  },

  async deleteCourse(courseId: string): Promise<void> {
    try {
      const storedIds = await AsyncStorage.getItem(DOWNLOADED_COURSE_IDS_KEY);
      const ids: string[] = storedIds ? JSON.parse(storedIds) : [];
      const updatedIds = ids.filter(id => id !== courseId);
      await AsyncStorage.setItem(DOWNLOADED_COURSE_IDS_KEY, JSON.stringify(updatedIds));

      const dirPath = `${FileSystem.documentDirectory}videos/${courseId}`;
      const dirInfo = await FileSystem.getInfoAsync(dirPath);
      if (dirInfo.exists) {
        await FileSystem.deleteAsync(dirPath, { idempotent: true });
      }
    } catch (error) {
      console.error('Falha ao deletar curso:', error);
    }
  },

  async getDownloadedGuides(): Promise<GuideInfo[]> {
    try {
      const dirPath = `${FileSystem.documentDirectory}videos`;
      const dirInfo = await FileSystem.getInfoAsync(dirPath);
      if (!dirInfo.exists) {
        return [];
      }
      const fileNames = await FileSystem.readDirectoryAsync(dirPath);
      const guides: GuideInfo[] = [];
      for (const fileName of fileNames) {
        const filePath = `${dirPath}/${fileName}`;
        const fileInfo = await FileSystem.getInfoAsync(filePath);
        if (!fileInfo.exists) continue;
        const parts = fileName.split('_');
        const guideInfo: GuideInfo = {
          id: parts[1] || fileName,
          courseId: parts[0] || 'unknown',
          title: fileName,
          filePath,
          size: fileInfo.size || 0,
        };
        guides.push(guideInfo);
      }
      return guides;
    } catch (error) {
      console.error('Falha ao obter guias baixados:', error);
      return [];
    }
  },

  async getTotalDownloadedSize(): Promise<number> {
    try {
      const guides = await this.getDownloadedGuides();
      return guides.reduce((total, guide) => total + guide.size, 0);
    } catch (error) {
      console.error('Falha ao obter tamanho total baixado:', error);
      return 0;
    }
  },

  async getAvailableSpace(): Promise<number> {
    try {
      const freeBytes = await FileSystem.getFreeDiskStorageAsync();
      return freeBytes;
    } catch (error) {
      console.error('Falha ao obter espaço disponível:', error);
      return 0;
    }
  },

  async deleteGuide(guideId: string, courseId: string): Promise<void> {
    try {
      const filePath = `${FileSystem.documentDirectory}videos/${courseId}/${guideId}.mp4`;
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(filePath, { idempotent: true });
      }
    } catch (error) {
      console.error('Falha ao deletar guia:', error);
    }
  },

  async cleanOldGuides(daysOld: number): Promise<void> {
    try {
      const now = Date.now();
      const maxAge = daysOld * 24 * 60 * 60 * 1000;
      const dirPath = `${FileSystem.documentDirectory}videos`;
      const dirInfo = await FileSystem.getInfoAsync(dirPath);
      if (!dirInfo.exists) return;
      const fileNames = await FileSystem.readDirectoryAsync(dirPath);
      for (const fileName of fileNames) {
        const filePath = `${dirPath}/${fileName}`;
        const fileInfo = await FileSystem.getInfoAsync(filePath);
        if (!fileInfo.exists) continue;
        if (fileInfo.modificationTime) {
          const fileAge = now - fileInfo.modificationTime * 1000;
          if (fileAge > maxAge) {
            await FileSystem.deleteAsync(filePath, { idempotent: true });
          }
        }
      }
    } catch (error) {
      console.error('Falha ao limpar guias antigos:', error);
    }
  },

  async syncOfflineProgress(): Promise<void> {
    try {
      console.log('Sincronizando progresso offline');
    } catch (error) {
      console.error('Falha ao sincronizar progresso offline:', error);
    }
  },
};

export default CourseService;


