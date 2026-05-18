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

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://192.168.86.40:3000/api/courses', { //ip
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        setCourses(data);
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

  const handleAccessModule = (module: Module, courseTitle: string) => {
    if (module.status === 'locked') {
      Alert.alert('Módulo Bloqueado', 'Complete o módulo anterior para desbloquear este.');
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Ionicons name="checkmark-circle" size={20} color="#27AE60" />;
      case 'in_progress':
        return <Ionicons name="time" size={20} color="#F39C12" />;
      case 'locked':
        return <Ionicons name="lock-closed" size={20} color="#95A5A6" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'in_progress':
        return 'Em Progresso';
      case 'locked':
        return 'Bloqueado';
      default:
        return '';
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
      <Text style={styles.title}>Minha Jornada</Text>

      {courses.map((course) => (
        <View key={course.id} style={styles.courseCard}>
          <Text style={styles.courseTitle}>{course.title}</Text>
          <Text style={styles.courseDescription}>{course.description}</Text>

          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${course.progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{Math.round(course.progress)}% concluído</Text>

          {course.modules.map((module) => (
            <View key={module.id} style={styles.moduleCard}>
              <View style={styles.moduleHeader}>
                <View style={styles.moduleInfo}>
                  {getStatusIcon(module.status)}
                  <View style={{ marginLeft: 10, flex: 1 }}>
                    <Text style={styles.moduleTitle}>{module.level}</Text>
                    <Text style={styles.moduleStatus}>{getStatusText(module.status)}</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.accessButton,
                  module.status === 'locked' && styles.accessButtonDisabled
                ]}
                onPress={() => handleAccessModule(module, course.title)}
                disabled={module.status === 'locked'}
              >
                <Text style={styles.accessButtonText}>
                  {module.status === 'locked' ? 'Bloqueado' : 'Acessar'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
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
    fontSize: 20,
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
    marginBottom: 15,
    fontWeight: '500'
  },
  moduleCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#27AE60'
  },
  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  moduleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50'
  },
  moduleStatus: {
    fontSize: 12,
    color: '#95A5A6',
    marginTop: 2
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
