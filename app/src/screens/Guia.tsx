import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import axios from 'axios';
import api from '../configApi/api';

interface Course {
  id: string;
  title: string;
  description: string;
  videourl: string;
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
    const response = await api.get('/api/courses', { timeout: 15000 });
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
     console.log('📦 Curso completo:', JSON.stringify(course, null, 2));
  console.log('📚 Módulos:', course.modules);
  console.log('📹 Total de vídeos:', course.modules?.reduce((acc, m) => acc + (m.videos?.length || 0), 0));
  if (!course || !course.modules) {
    Alert.alert('Erro', 'Curso inválido');
    return;
  }

  const totalVideos = course.modules.reduce((acc, mod) => acc + (mod.videos?.length || 0), 0);
  if (totalVideos === 0) {
    Alert.alert('Aviso', 'Nenhum vídeo para baixar');
    return;
  }

  setDownloadingCourseId(course.id);
  let videosDownloaded = 0;

  try {
    for (const module of course.modules) {
      if (!module.videos) continue;
      for (const video of module.videos) {
        const fileUri = `${FileSystem.documentDirectory}${video.id}.mp4`;
        await FileSystem.downloadAsync(video.url, fileUri);
        videosDownloaded++;
        setDownloadProgress(videosDownloaded / totalVideos);
      }
    }

    await AsyncStorage.setItem(`course_${course.id}`, JSON.stringify(course));

    const updatedCourses = [...new Set([...downloadedCourses, course.id])];
    setDownloadedCourses(updatedCourses);
    await AsyncStorage.setItem('downloadedCourses', JSON.stringify(updatedCourses));

    Alert.alert('Sucesso', 'Curso baixado com sucesso!');
  } catch (error) {
    Alert.alert('Erro', 'Falha ao baixar curso');
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