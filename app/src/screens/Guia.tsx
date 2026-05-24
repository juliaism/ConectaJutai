import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import CourseService from "../service/downloadGuiasService.ts"; 

interface Course {
  id: string;
  title: string;
  description: string;
  modules: any[]
}

export interface Module {
  id: string;
  title: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  status: 'locked' | 'in_progress' | 'completed';
  videoUrl: string
}

function getLevelByIndex(index: number): 'Iniciante' | 'Intermediário' | 'Avançado' {
  if (index <= 1) return 'Iniciante';
  if (index <= 3) return 'Intermediário';
  return 'Avançado';
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
    const coursesArray = await CourseService.fetchCourses();
    console.log('Dados:', coursesArray);
    console.log('Total de cursos:', coursesArray.length);
    console.log('IDs de cursos baixados:', coursesArray.map(c => c.id));
    setCourses(coursesArray);
  } catch (error) {
    console.error('Erro ao carregar cursos:', error);
    Alert.alert('Erro', 'Não foi possível carregar os cursos');
  } finally {
    setLoading(false);
  }
};

  const checkDownloadedCourses = async () => {
  try {
    const downloaded = await CourseService.getStoredCourses();
    const downloadedIds = await AsyncStorage.getItem('downloaded_course_ids');
    if (downloadedIds) {
      const ids = JSON.parse(downloadedIds);
      setDownloadedCourses(ids);
      console.log('IDs de cursos baixados:', ids);
      console.log('Cursos carregados:', downloaded);
    }
  } catch (error) {
    console.error('Erro ao verificar cursos baixados:', error);
  }
};   

   async function downloadCourse(course: Course): Promise<void> {
  try {
    setDownloadingCourseId(course.id);
    setDownloadProgress(0);

    console.log('Iniciando download do curso:', course.title);
    console.log('Módulos:', course.modules);

    let totalVideos = 0;
    let downloadedVideos = 0;

    for (const module of course.modules) {
      totalVideos += module.videos?.length || 0;
    }

    console.log(`Total de vídeos a baixar: ${totalVideos}`);

    const videosDir = `${FileSystem.documentDirectory}videos/`;
    await FileSystem.makeDirectoryAsync(videosDir, { intermediates: true });
    for (const module of course.modules) {
      for (const video of module.videos || []) {
        try {
          const fileUri = `${videosDir}${video.id}.mp4`;
          
          console.log(`Baixando vídeo: ${video.title}`);
          console.log(`URL: ${video.url}`);
          
          await FileSystem.downloadAsync(video.url, fileUri);
          
          downloadedVideos++;
          const progress = Math.round((downloadedVideos / totalVideos) * 100);
          setDownloadProgress(progress);
          console.log(`Progresso: ${progress}%`);
        } catch (error) {
          console.error(`Erro ao baixar vídeo ${video.title}:`, error);
          Alert.alert('Aviso', `Falha ao baixar vídeo: ${video.title}`);
        }
      }
    }

    await AsyncStorage.setItem(`course_${course.id}`, JSON.stringify(course));
    console.log('Curso salvo no AsyncStorage');

    await CourseService.saveDownloadedCourseId(course.id);
    console.log('Curso salvo no courseService');

    setDownloadedCourses([...downloadedCourses, course.id]);
    setDownloadingCourseId(null);
    setDownloadProgress(0);

    Alert.alert('Sucesso', 'Curso baixado com sucesso!');
  } catch (error) {
    console.error('Erro ao baixar curso:', error);
    Alert.alert('Erro', 'Falha ao baixar o curso');
    setDownloadingCourseId(null);
    setDownloadProgress(0);
  }
}

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
  }
});