import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
  progress: number;
}

interface Module {
  id: string;
  title: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  status: 'completed' | 'in_progress' | 'locked';
  videoUrl: string;
  nextModuleId?: string;
}

export default function JornadaScreen({ navigation }: any) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('456');
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://192.168.86.40:3000/api/courses', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const response_data = await response.json();
        console.log('Cursos carregados:', response_data);
        const coursesArray = response_data.data || [];
        setCourses(coursesArray);
      } else {
        Alert.alert('Erro', 'Não foi possível carregar os cursos');
      }
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
      Alert.alert('Erro', 'Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const toggleCourseExpand = (courseId: string) => {
    setExpandedCourseId(expandedCourseId === courseId ? null : courseId);
  };

  // ✅ Verificar se o módulo anterior foi concluído
  const isModuleUnlocked = (modules: Module[], currentIndex: number): boolean => {
    if (currentIndex === 0) return true; // Iniciante sempre desbloqueado
    
    const previousModule = modules[currentIndex - 1];
    return previousModule?.status === 'completed';
  };

  // ✅ Obter mensagem de desbloqueio
  const getUnlockMessage = (modules: Module[], currentIndex: number): string => {
    if (currentIndex === 0) return '';
    
    const previousModule = modules[currentIndex - 1];
    return `Desbloqueado após terminar ${previousModule?.level}`;
  };

  const handleAccessModule = (module: Module, courseTitle: string, modules: Module[], moduleIndex: number) => {
    // ✅ Verificar se está desbloqueado
    if (!isModuleUnlocked(modules, moduleIndex)) {
      Alert.alert('Módulo Bloqueado', getUnlockMessage(modules, moduleIndex));
      return;
    }

    navigation.navigate('Modulo', {
      videoUrl: module.videoUrl,
      moduleId: module.id,
      userId: userId,
      nextModuleId: module.nextModuleId,
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

      {courses.map((course) => (
        <View key={course.id}>
          {/* CARD COLAPSÁVEL */}
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

          {/* MÓDULOS EXPANDIDOS */}
          {expandedCourseId === course.id && (
            <View style={styles.modulesContainer}>
              {course.modules.map((module, index) => {
                const isUnlocked = isModuleUnlocked(course.modules, index);
                const unlockMessage = getUnlockMessage(course.modules, index);

                return (
                  <View key={module.id} style={styles.moduleCard}>
                    {/* APENAS NÍVEL */}
                    <Text style={styles.moduleLevelText}>{module.level}</Text>

                    {/* BOTÃO DE ACESSO */}
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