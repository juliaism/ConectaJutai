import { Ionicons } from '@expo/vector-icons';
import React, { useState, useRef, useEffect } from 'react';
import {Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { downloadGuideService, GuideData } from '../service/downloadGuiasService';
import { SafeAreaView } from 'react-native-safe-area-context';

interface GuideItem {
  id: string;
  titulo: string;
  texto: string;
  videoSource: any;
  videoUrl?: string;
  videoSize?: number;
}

export default function GuiasScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [conteudo, setConteudo] = useState<GuideData>({
    id: '',
    titulo: '',
    texto: '',
    videoPath: '',
    videoSize: 0,
  });
  const [concluidos, setConcluidos] = useState<string[]>([]);
  const [downloadingGuides, setDownloadingGuides] = useState<string[]>([]);
  const [downloadProgress, setDownloadProgress] = useState<{ [key: string]: number }>({});
  const [downloadedGuides, setDownloadedGuides] = useState<string[]>([]);
  const videoRef = useRef(null);

  const guias: GuideItem[] = [
    {
      id: 'mandioca',
      titulo: 'Como evitar pragas na mandioca',
      texto: '1. Use mudas de plantas saudáveis.\n2. Faça a rotação de culturas.\n3. Inspecione as folhas toda semana.',
      videoSource: require('./madioca.mp4.mp4'),
      videoUrl: 'https://seu-servidor.com/videos/mandioca.mp4',
      videoSize: 50 * 1024 * 1024,
    },
    {
      id: 'preco',
      titulo: 'Calcule o preço da sua produção',
      texto: 'Para calcular o preço, some:\n- Custo das sementes\n- Horas trabalhadas\n- Adubo e ferramentas.',
      videoSource: require('./preco.mp4.mp4'),
      videoUrl: 'https://seu-servidor.com/videos/preco.mp4',
      videoSize: 45 * 1024 * 1024,
    },
  ];

  useEffect(() => {
    loadDownloadedGuides();
  }, []);

  const loadDownloadedGuides = async () => {
    try {
      const guides = await downloadGuideService.getDownloadedGuides();
      setDownloadedGuides(guides.map((g) => g.id));
    } catch (err) {
      console.error('Erro ao carregar guias:', err);
    }
  };

  const handleDownloadGuide = async (guide: GuideItem) => {
    try {
      setDownloadingGuides([...downloadingGuides, guide.id]);

      const guideData: GuideData = {
        id: guide.id,
        titulo: guide.titulo,
        texto: guide.texto,
        videoPath: guide.videoUrl || '',
        videoSize: guide.videoSize || 0,
      };

      await downloadGuideService.downloadGuide(guideData, (progress) => {
        setDownloadProgress((prev) => ({
          ...prev,
          [guide.id]: progress,
        }));
      });

      setDownloadedGuides([...downloadedGuides, guide.id]);
      setDownloadingGuides(downloadingGuides.filter((id) => id !== guide.id));

      Alert.alert('✅ Sucesso', `Guia "${guide.titulo}" baixado com sucesso!`);
    } catch (err) {
      setDownloadingGuides(downloadingGuides.filter((id) => id !== guide.id));
      Alert.alert('❌ Erro', 'Erro ao baixar guia. Tente novamente.');
      console.error('Erro:', err);
    }
  };

  const handleDeleteGuide = async (guideId: string) => {
    Alert.alert(
      'Deletar Guia',
      'Tem certeza que deseja deletar este guia?',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Deletar',
          onPress: async () => {
            try {
              await downloadGuideService.deleteGuide(guideId);
              setDownloadedGuides(downloadedGuides.filter((id) => id !== guideId));
              Alert.alert('✅ Deletado', 'Guia removido com sucesso.');
            } catch (err) {
              Alert.alert('❌ Erro', 'Erro ao deletar guia.');
            }
          },
        },
      ]
    );
  };

  const abrirManual = async (guide: GuideItem) => {
    try {
      let videoPath = guide.videoSource;

      if (downloadedGuides.includes(guide.id)) {
        const downloadedGuide = await downloadGuideService.getDownloadedGuide(guide.id);
        if (downloadedGuide) {
          videoPath = { uri: downloadedGuide.videoPath };
        }
      }

      setConteudo({
        id: guide.id,
        titulo: guide.titulo,
        texto: guide.texto,
        videoPath,
        videoSize: guide.videoSize || 0,
      });
      setModalVisible(true);
    } catch (err) {
      Alert.alert('❌ Erro', 'Erro ao abrir guia.');
    }
  };

  const concluirModulo = () => {
    if (!concluidos.includes(conteudo.id)) {
      setConcluidos([...concluidos, conteudo.id]);
    }
    setModalVisible(false);
    Alert.alert('Parabéns!', 'Você concluiu este estudo. Continue assim!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>📚 Manuais de Cultivo</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {guias.map((guide) => {
          const isDownloading = downloadingGuides.includes(guide.id);
          const isDownloaded = downloadedGuides.includes(guide.id);
          const progress = downloadProgress[guide.id] || 0;

          return (
            <View
              key={guide.id}
              style={[
                styles.itemCard,
                concluidos.includes(guide.id) && styles.cardConcluido,
              ]}
            >
              <TouchableOpacity
                onPress={() => abrirManual(guide)}
                style={styles.cardContent}
              >
                <View style={styles.row}>
                  <Text style={styles.itemTitle}>{guide.titulo}</Text>
                  {concluidos.includes(guide.id) && (
                    <Ionicons name="checkmark-circle" size={24} color="#27AE60" />
                  )}
                </View>

                <View style={styles.tagContainer}>
                  <Text style={styles.tagOffline}>
                    {concluidos.includes(guide.id)
                      ? '✅ Concluído'
                      : '🎥 Assistir Vídeo-Aula'}
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={styles.downloadSection}>
                {isDownloading ? (
                  <View style={styles.downloadingContainer}>
                    <ActivityIndicator color="#27AE60" size="small" />
                    <Text style={styles.downloadingText}>{progress}%</Text>
                  </View>
                ) : isDownloaded ? (
                  <View style={styles.downloadedContainer}>
                    <Ionicons name="checkmark-circle" size={20} color="#27AE60" />
                    <Text style={styles.downloadedText}>Baixado</Text>
                    <TouchableOpacity
                      onPress={() => handleDeleteGuide(guide.id)}
                      style={styles.deleteButton}
                    >
                      <Ionicons name="trash" size={16} color="#E74C3C" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => handleDownloadGuide(guide)}
                    style={styles.downloadButton}
                  >
                    <Ionicons name="download" size={18} color="white" />
                    <Text style={styles.downloadButtonText}>Baixar</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{conteudo.titulo}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={30} color="#7F8C8D" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {conteudo.videoPath && (
              <Video
                ref={videoRef}
                style={styles.realVideoPlayer}
                source={  typeof conteudo.videoPath === 'string'
                         ? { uri: conteudo.videoPath }
                         : conteudo.videoPath}
                useNativeControls
                resizeMode={ResizeMode.COVER}
                isLooping
                shouldPlay={modalVisible}
              />
            )}
            <Text style={styles.modalText}>{conteudo.texto}</Text>
          </ScrollView>

          <TouchableOpacity style={styles.doneButton} onPress={concluirModulo}>
            <Ionicons name="checkmark-done" size={20} color="white" style={{ marginRight: 10 }} />
            <Text style={styles.doneButtonText}>Marcar Módulo como Concluído</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7F6',
    padding: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#27AE60',
    marginTop: 40,
    marginBottom: 20,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    borderLeftWidth: 0,
  },
  cardConcluido: {
    borderLeftWidth: 8,
    borderLeftColor: '#27AE60',
  },
  cardContent: {
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
    flex: 1,
  },
  tagContainer: {
    backgroundColor: '#E8F8F5',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  tagOffline: {
    color: '#27AE60',
    fontSize: 12,
    fontWeight: 'bold',
  },
  downloadSection: {
    borderTopWidth: 1,
    borderTopColor: '#ECF0F1',
    paddingTop: 15,
  },
  downloadButton: {
    backgroundColor: '#27AE60',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  downloadButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 14,
  },
  downloadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  downloadingText: {
    color: '#27AE60',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 14,
  },
  downloadedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#E8F8F5',
    borderRadius: 8,
  },
  downloadedText: {
    color: '#27AE60',
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
  },
  deleteButton: {
    padding: 8,
  },
  modalView: {
    flex: 1,
    marginTop: 70,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#27AE60',
    flex: 1,
  },
  realVideoPlayer: {
    width: '100%',
    height: 220,
    borderRadius: 15,
    marginBottom: 20,
    backgroundColor: 'black',
  },
  modalText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#2C3E50',
  },
  doneButton: {
    backgroundColor: '#27AE60',
    borderRadius: 12,
    padding: 18,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
