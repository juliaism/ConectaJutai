import AsyncStorage from '@react-native-async-storage/async-storage';

interface Video {
  id: string;
  title: string;
  url: string;
  duration: number;
}

interface Module {
  id: string;
  title: string;
  videos: Video[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
}

const API_BASE_URL = 'https://conectajutai.onrender.com/api';

const CourseService = {
  async fetchCourses(): Promise<Course[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/courses`);
      if (!response.ok) throw new Error('Failed to fetch courses');
      const courses: Course[] = await response.json();
      await AsyncStorage.setItem('courses', JSON.stringify(courses));
      return courses;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  async getStoredCourses(): Promise<Course[]> {
    try {
      const stored = await AsyncStorage.getItem('courses');
      if (stored) return JSON.parse(stored);
      return [];
    } catch (error) {
      console.error('Error getting stored courses:', error);
      throw error;
    }
  },

  async saveDownloadedCourseId(courseId: string): Promise<void> {
    try {
      const storedIds = await AsyncStorage.getItem('downloaded_course_ids');
      let ids: string[] = storedIds ? JSON.parse(storedIds) : [];
      if (!ids.includes(courseId)) {
        ids.push(courseId);
        await AsyncStorage.setItem('downloaded_course_ids', JSON.stringify(ids));
      }
    } catch (error) {
      console.error('Error saving downloaded course ID:', error);
      throw error;
    }
  },

  async isCourseDownloaded(courseId: string): Promise<boolean> {
    try {
      const storedIds = await AsyncStorage.getItem('downloaded_course_ids');
      if (storedIds) {
        const ids: string[] = JSON.parse(storedIds);
        return ids.includes(courseId);
      }
      return false;
    } catch (error) {
      console.error('Error checking if course is downloaded:', error);
      throw error;
    }
  },

  async deleteCourse(courseId: string): Promise<void> {
    try {
      const storedIds = await AsyncStorage.getItem('downloaded_course_ids');
      if (storedIds) {
        let ids: string[] = JSON.parse(storedIds);
        ids = ids.filter(id => id !== courseId);
        await AsyncStorage.setItem('downloaded_course_ids', JSON.stringify(ids));
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  }
};

export default CourseService;