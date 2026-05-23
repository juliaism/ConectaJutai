import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import { Ionicons } from '@expo/vector-icons';
import api from '../configApi/api';

interface Video {
  id: string;
  title: string;
  url: string;
  duration?: number;
}

interface Module {
  id: string;
  title: string;
  videos: Video[];
}

interface Course {
  id: string;
  title: string;
  modules: Module[];
  description: string;
}


export default function GuiasScreen() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadedVideos, setDownloadedVideos] = useState<string[]>([]);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [expandedCourses, setExpandedCourses] = useState<{ [key: string]: boolean }>({});
  const [expandedModules, setExpandedModules] = useState<{ [key: string]: boolean }>({});
  const [downloadingVideoId, setDownloadingVideoId] = useState<string | null>(null);
  const [downloadingCourseId, setDownloadingCourseId] = useState<string | null>(null);
  const [downloadedCourses, setDownloadedCourses] = useState<string[]>([]);

  useEffect(() => {
    fetchCourses();
    loadDownloadedVideos();
  }, []);

 const fetchCourses = async () => {
  try {
    const response = await api.get('/api/courses');
    console.log('Response:', response.data);
    
    let coursesData = response.data?.courses;
    
    if (!coursesData) {
      coursesData = response.data?.data;
    }
    
    if (!coursesData) {
      coursesData = response.data;
    }
    
    if (!coursesData) {
      setCourses([]);
    } else {
      setCourses(coursesData);
    }
  } catch (error) {
    console.error('Erro ao buscar cursos:', error);
    Alert.alert('Erro', 'Não foi possível carregar os cursos.');
    setCourses([]);
  } finally {
    setLoading(false);
  }
};

  const loadDownloadedVideos = async () => {
    try {
      const stored = await AsyncStorage.getItem('downloadedVideos');
      if (stored) {
        setDownloadedVideos(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Error loading downloaded videos:', error);
    }
  };

  const saveDownloadedVideos = async (videos: string[]) => {
    try {
      await AsyncStorage.setItem('downloadedVideos', JSON.stringify(videos));
    } catch (error) {
      console.log('Error saving downloaded videos:', error);
    }
  };

  const toggleCourse = (courseId: string) => {
    setExpandedCourses(prev => ({ ...prev, [courseId]: !prev[courseId] }));
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const downloadVideo = async (video: Video) => {
    if (downloadingVideoId) return;
    setDownloadingVideoId(video.id);
    try {
      const fileUri = FileSystem.documentDirectory + `${video.id}.mp4`;
      const downloadResumable = FileSystem.createDownloadResumable(
        video.url,
        fileUri,
        {},
        (downloadProgress) => {
          const progress = downloadProgress.totalBytesExpectedToWrite > 0
            ? downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite
            : 0;
          setDownloadProgress(prev => ({ ...prev, [video.id]: progress }));
        }
      );
      const result = await downloadResumable.downloadAsync();
      if (result && result.uri) {
        const newDownloaded = [...downloadedVideos, video.id];
        setDownloadedVideos(newDownloaded);
        saveDownloadedVideos(newDownloaded);
        Alert.alert('Success', 'Video downloaded successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to download video.');
    } finally {
      setDownloadingVideoId(null);
      setDownloadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[video.id];
        return newProgress;
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#27AE60" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Guias de Aprendizado</Text>

      {courses.map(course => (
        <View key={course.id} style={styles.courseCard}>
          <Text style={styles.courseTitle}>{course.title}</Text>
          <Text style={styles.courseDescription}>{course.description}</Text>

           {downloadingCourseId === course.id ? (
            <View style={styles.downloadProgressContainer}>
              <View style={[styles.downloadProgressBar, { width: `${downloadProgress * 100}%` }]} />
            </View>
              ) : (
                <TouchableOpacity
              style={[
                styles.downloadButton,
                downloadedCourses.includes(course.id) && styles.downloadButtonDisabled
              ]}
              onPress={() => downloadedCourses(courses)}
              disabled={downloadedCourses.includes(course.id)}
            >
              <Ionicons
                name={downloadedCourses.includes(course.id) ? 'checkmark-circle' : 'download'}
                size={20}
                color="#FFF"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.downloadButtonText}>
                {downloadedCourses.includes(course.id) ? '✅ Baixado' : '📥 Baixar'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
       <View style={{ height: 30 }} />
    </ScrollView>
  );
}
         

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7F6',
    padding: 20
  },
   title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#27AE60',
    marginBottom: 20,
    marginTop: 10
  },
   courseCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    borderLeftWidth: 6,
    borderLeftColor: '#27AE60'
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8
  },
   courseDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 15,
    lineHeight: 20
  },
    downloadButton: {
    backgroundColor: '#27AE60',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  downloadButtonDisabled: {
    backgroundColor: '#BDC3C7',
    opacity: 0.6
  },
   downloadButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold'
  },
  downloadProgressContainer: {
    height: 8,
    backgroundColor: '#ECF0F1',
    borderRadius: 4,
    overflow: 'hidden'
  },
  downloadProgressBar: {
    height: '100%',
    backgroundColor: '#27AE60',
    borderRadius: 4
  },
  contentContainer: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F7F6',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#27AE60',
  },
  courseContainer: {
    marginBottom: 16,
    backgroundColor: '#FFF',
    borderRadius: 8,
    overflow: 'hidden',
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#27AE60',
  },
  moduleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  videoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingLeft: 16,
  },
  videoTitle: {
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  videoActions: {
    marginLeft: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressText: {
    marginRight: 4,
    fontSize: 12,
    color: '#27AE60',
  },
});
