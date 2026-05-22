import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { JornadaStackParamList } from '../navigation/Navigation';


interface ModuleScreenParams {
  videoUrl: string;
  moduleId: string;
  userId: string;
  nextModuleId?: string;
  moduleTitle: string;
}

type ModuleScreenNavigationProp = NativeStackNavigationProp<JornadaStackParamList, 'Modulo'>;

export default function ModuleScreen() {
  const route = useRoute();
  const navigation = useNavigation<ModuleScreenNavigationProp>();
  
  const { videoUrl, moduleId, userId, nextModuleId, moduleTitle } = route.params as ModuleScreenParams;

  const [progress, setProgress] = useState(0);
  const [lastSentProgress, setLastSentProgress] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = false;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (player.currentTime && player.duration) {
        const currentProgress = (player.currentTime / player.duration) * 100;
        setProgress(currentProgress);

        const milestones = [5, 25, 50, 75, 90];
        const currentMilestone = milestones.find(
          (m) => currentProgress >= m && lastSentProgress < m
        );

        if (currentMilestone) {
          setLastSentProgress(currentMilestone);
          sendProgressToBackend(currentMilestone);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [player, lastSentProgress]);

  const sendProgressToBackend = async (progressPercentage: number) => {
    try {
      const response = await fetch('http://localhost:3000/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          moduleId,
          progress: progressPercentage,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        console.error('Erro ao enviar progresso:', response.status);
      }
    } catch (error) {
      console.error('Erro ao enviar progresso:', error);
    }
  };

  const handleCompleteModule = async () => {
    try {
      setIsCompleting(true);

      const response = await fetch('http://localhost:3000/api/modules/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          moduleId,
          completedAt: new Date().toISOString()
        })
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Módulo concluído com sucesso!', [
          {
            text: 'OK',
            onPress: () => {
              if (nextModuleId) {
                navigation.navigate('Modulo', {
                  videoUrl: '',
                  moduleId: nextModuleId,
                  userId,
                  moduleTitle: 'Próximo Módulo'
                });
              } else {
                navigation.navigate('JornadaHome');
              }
            }
          }
        ]);
      } else {
        Alert.alert('Erro', 'Não foi possível concluir o módulo');
      }
    } catch (error) {
      console.error('Erro ao concluir módulo:', error);
      Alert.alert('Erro', 'Erro ao conectar com o servidor');
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#27AE60" />
        </TouchableOpacity>
        <Text style={styles.title}>{moduleTitle}</Text>
        <View style={{ width: 24 }} />
      </View>

      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
      />

      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.progressText}>{Math.round(progress)}% assistido</Text>

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => {
            if (isPlaying) {
              player.pause();
            } else {
              player.play();
            }
            setIsPlaying(!isPlaying);
          }}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={24}
            color="#27AE60"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.completeButton}
        onPress={handleCompleteModule}
        disabled={isCompleting}
      >
        <Ionicons name="checkmark-circle" size={20} color="#FFF" />
        <Text style={styles.completeButtonText}>
          {isCompleting ? 'Concluindo...' : 'Concluir Módulo'}
        </Text>
      </TouchableOpacity>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7F6'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#DCDCDC'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    flex: 1,
    textAlign: 'center'
  },
  video: {
    width: '100%',
    height: 250,
    backgroundColor: '#000'
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#ECF0F1',
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 3,
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#27AE60',
    borderRadius: 3
  },
  progressText: {
    fontSize: 12,
    color: '#7F8C8D',
    marginHorizontal: 20,
    marginTop: 8,
    fontWeight: '500'
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    borderWidth: 2,
    borderColor: '#27AE60'
  },
  completeButton: {
    backgroundColor: '#27AE60',
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  completeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8
  }
});