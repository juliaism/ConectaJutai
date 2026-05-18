import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Image} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import axios from 'axios';

interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl: string;
  modules: any[];
}

export default function GuiasScreen() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingCourseId, setDownloadingCourseId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadedCourses, setDownloadedCourses] = useState<string[]>([]);

  useEffect(() => {
    loadCourses();
    checkDownloadedCourses();
  }, []);


  const loadCourses = async () => {
  try {
    setLoading(true);
    
    const response = await axios.get('http://192.168.86.40:3000/api/courses', {
      timeout: 15000
    });

    console.log('Cursos carregados:', response.data);
    
    const coursesArray = response.data.data || [];
    setCourses(coursesArray);
    
  } catch (error) {
    if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
      Alert.alert('Erro', 'Requisição expirou. Tente novamente.');
    } else {
      console.error('Erro ao carregar cursos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os cursos');
    }
  } finally {
    setLoading(false);
  }
};  
   
  const checkDownloadedCourses = async () => {
    try {
      const downloaded = await AsyncStorage.getItem('downloadedCourses');
      if (downloaded) {
        setDownloadedCourses(JSON.parse(downloaded));
      }
    } catch (error) {
      console.error('Erro ao verificar cursos baixados:', error);
    }
  };

  const downloadCourse = async (course: Course) => {
    try {
      setDownloadingCourseId(course.id);
      setDownloadProgress(0);

      const courseDir = `${FileSystem.documentDirectory}courses/${course.id}`;
      await FileSystem.makeDirectoryAsync(courseDir, { intermediates: true });

      const videoFileName = `${course.id}_video.mp4`;
      const videoPath = `${courseDir}/${videoFileName}`;

      const downloadResumable = FileSystem.createDownloadResumable(
        course.videoUrl,
        videoPath,
        {},
        (downloadProgress) => {
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          setDownloadProgress(progress);
        }
      );

      await downloadResumable.downloadAsync();

      const courseMetadata = {
        id: course.id,
        title: course.title,
        description: course.description,
        imageUrl: course.imageUrl,
        videoPath: videoPath,
        modules: course.modules,
        downloadedAt: new Date().toISOString()
      };

      await AsyncStorage.setItem(`course_${course.id}`, JSON.stringify(courseMetadata));

      const updatedDownloaded = [...downloadedCourses, course.id];
      await AsyncStorage.setItem('downloadedCourses', JSON.stringify(updatedDownloaded));
      setDownloadedCourses(updatedDownloaded);

      Alert.alert('Sucesso', `${course.title} foi baixado com sucesso!`);
    } catch (error) {
      console.error('Erro ao baixar curso:', error);
      Alert.alert('Erro', 'Erro ao baixar o curso. Tente novamente.');
    } finally {
      setDownloadingCourseId(null);
      setDownloadProgress(0);
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

      {courses.map((course) => (
        <View key={course.id} style={styles.courseCard}>
          <Image
            source={{ uri: course.imageUrl }}
            style={styles.courseImage}
          />

          <View style={styles.courseContent}>
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
                onPress={() => downloadCourse(course)}
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
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 3
  },
  courseImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#ECF0F1'
  },
  courseContent: {
    padding: 15
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  downloadButtonDisabled: {
    backgroundColor: '#95A5A6',
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
  }
});