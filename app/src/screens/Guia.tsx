import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import axios from 'axios';
import api from '../configApi/api';

interface Course {
  id: string;
  title: string;
  description: string;
  modules: any[];
}

export interface Module {
  id: string;
  title: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  status: 'locked' | 'in_progress' | 'completed';
  videoUrl: string;
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

      // 🚀 MODO HACKATHON: API Comentada para não quebrar sem internet
      /*
      const response = await api.get('/api/courses', { timeout: 12000 }); 
      let coursesArray = [];
      if (Array.isArray(response.data)) {
        coursesArray = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        coursesArray = response.data.data;
      }
      */

      // 👇 DADOS FALSOS (MOCK) PARA A APRESENTAÇÃO - IDs trocados para burlar o cache!
      const mockCourses: Course[] = [
        {
          id: "aula_1", // 🎯 Truque ninja: Mudamos o ID para resetar o download!
          title: "Agroecologia na Prática",
          description: "Aprenda as bases da agricultura sustentável e técnicas para o dia a dia na sua plantação.",
          modules: [
            { id: "mod1", title: "Introdução ao Solo", level: "Iniciante", status: "completed", videoUrl: "" }
          ]
        },
        {
          id: "aula_2",
          title: "Gestão Financeira Familiar",
          description: "Como organizar os ganhos da colheita, precificar produtos e planejar o futuro financeiro.",
          modules: [
            { id: "mod2", title: "Planilhas Básicas", level: "Iniciante", status: "locked", videoUrl: "" }
          ]
        },
        {
          id: "aula_3",
          title: "Técnicas de Irrigação",
          description: "Sistemas eficientes para economizar água e aumentar a produtividade no campo.",
          modules: [
             { id: "mod3", title: "Gotejamento", level: "Intermediário", status: "locked", videoUrl: "" }
          ]
        }
      ];

      console.log('Total de cursos carregados:', mockCourses.length);
      setCourses(mockCourses);

    } catch (error) {
      console.error('ERRO NA REQUISIÇÃO:', error);
      Alert.alert('Erro', 'Não foi possível carregar os cursos');
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

  async function downloadCourse(course: Course): Promise<void> {
    if (!course || !course.modules) {
      Alert.alert('Erro', 'Curso inválido ou sem módulos.');
      return;
    }

    // 🚀 Simulação de Download para o Hackathon
    setDownloadingCourseId(course.id);
    setDownloadProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.2; // Aumenta o progresso simulado
      setDownloadProgress(progress);

      if (progress >= 1) {
        clearInterval(interval);
        setDownloadingCourseId(null);
        
        const newDownloaded = [...downloadedCourses, course.id];
        setDownloadedCourses(newDownloaded);
        AsyncStorage.setItem('downloadedCourses', JSON.stringify(newDownloaded));
        
        // 🎯 A LINHA QUE FALTAVA: Salva o conteúdo inteiro do curso na memória!
        AsyncStorage.setItem(`course_${course.id}`, JSON.stringify(course));
        
        Alert.alert('Sucesso', 'Curso baixado e salvo com sucesso!');
      }
    }, 500); // Meio segundo por etapa
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
    overflow: 'hidden',
    marginTop: 10
  },
  downloadProgressBar: {
    height: '100%',
    backgroundColor: '#27AE60',
    borderRadius: 4
  }
});
