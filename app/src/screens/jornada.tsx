import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Module {
  id: string;
  title: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  status: 'completed' | 'in_progress' | 'locked';
  videoUrl: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
  progress: number;
}

export default function JornadaScreen({ navigation }: any) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('456');
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  useEffect(() => {
    loadDownloadedCourses();

    const unsubscribe = navigation.addListener('focus', () => {
      loadDownloadedCourses();
    });

    return unsubscribe;
  }, [navigation]);

  const loadDownloadedCourses = async () => {
    try {
      setLoading(true);

      const downloadedIds = await AsyncStorage.getItem('downloadedCourses');
      const downloadedArray = downloadedIds ? JSON.parse(downloadedIds) : [];

      console.log('IDs de cursos baixados:', downloadedArray);

      const coursesArray: Course[] = [];

      for (const courseId of downloadedArray) {
        const courseData = await AsyncStorage.getItem(`course_${courseId}`);
        if (courseData) {
          const course = JSON.parse(courseData);
          coursesArray.push({
            id: course.id,
            title: course.title,
            description: course.description,
            modules: course.modules || [],
            progress: 0 
          });
        }
      }

      console.log('Cursos carregados:', coursesArray);
      setCourses(coursesArray);
    } catch (error) {
      console.error('Erro ao carregar cursos baixados:', error);
      Alert.alert('Erro', 'Erro ao carregar cursos');
    } finally {
      setLoading(false);
    }
  };

  const toggleCourseExpand = (courseId: string) => {
    setExpandedCourseId(expandedCourseId === courseId ? null : courseId);
  };

  const isModuleUnlocked = (modules: Module[], currentIndex: number): boolean => {
    if (currentIndex === 0) return true;
    const previousModule = modules[currentIndex - 1];
    return previousModule?.status === 'completed';
  };

  const getUnlockMessage = (modules: Module[], currentIndex: number): string => {
    if (currentIndex === 0) return '';
    const previousModule = modules[currentIndex - 1];
    return `Desbloqueado após terminar ${previousModule?.level}`;
  };

  const handleAccessModule = (module: Module, courseTitle: string, modules: Module[], moduleIndex: number) => {
    if (!isModuleUnlocked(modules, moduleIndex)) {
      Alert.alert('Módulo Bloqueado', getUnlockMessage(modules, moduleIndex));
      return;
    }

    navigation.navigate('Modulo', {
      videoUrl: module.videoUrl,
      moduleId: module.id,
      userId: userId,
      moduleTitle: `${courseTitle} - ${module.level}`
    });
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
      <Text style={styles.title}>Minha Jornada</Text>

      {courses.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="cloud-download-outline" size={64} color="#BDC3C7" />
          <Text style={styles.emptyText}>Nenhum curso baixado</Text>
          <Text style={styles.emptySubtext}>Baixe um curso em "Guias" para começar sua jornada</Text>
        </View>
      ) : (
        courses.map((course) => (
          <View key={course.id}>
            <TouchableOpacity
              style={styles.courseCard}
              onPress={() => toggleCourseExpand(course.id)}
            >
              <View style={styles.courseCardContent}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <View style={styles.progressContainer}>
                    <View style={[styles.progressBar, { width: `${course.progress}%` }]} />
                  </View>
                  <Text style={styles.progressText}>{Math.round(course.progress)}% concluído</Text>
                </View>
                <Ionicons
                  name={expandedCourseId === course.id ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color="#27AE60"
                />
              </View>
            </TouchableOpacity>
            {expandedCourseId === course.id && (
              <View style={styles.modulesContainer}>
                {course.modules.map((module, index) => {
                  const isUnlocked = isModuleUnlocked(course.modules, index);
                  const unlockMessage = getUnlockMessage(course.modules, index);

                  return (
                    <View key={module.id} style={styles.moduleCard}>
                      <Text style={styles.moduleLevelText}>{module.level}</Text>

                      <TouchableOpacity
                        style={[
                          styles.accessButton,
                          !isUnlocked && styles.accessButtonDisabled
                        ]}
                        onPress={() => handleAccessModule(module, course.title, course.modules, index)}
                        disabled={!isUnlocked}
                      >
                        <Text style={styles.accessButtonText}>
                          {isUnlocked ? 'Acessar' : unlockMessage}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        ))
      )}

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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 16
  },
  emptySubtext: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 8
  },
  courseCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 10,
    elevation: 3,
    borderLeftWidth: 6,
    borderLeftColor: '#27AE60'
  },
  courseCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 12
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#ECF0F1',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#27AE60',
    borderRadius: 4
  },
  progressText: {
    fontSize: 12,
    color: '#7F8C8D',
    fontWeight: '500'
  },
  modulesContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#27AE60'
  },
  moduleCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#27AE60'
  },
  moduleLevelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 10,
    textAlign: 'center'
  },
  accessButton: {
    backgroundColor: '#27AE60',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  accessButtonDisabled: {
    backgroundColor: '#BDC3C7',
    opacity: 0.6
  },
  accessButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold'
  }
});