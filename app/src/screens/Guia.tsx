import { Ionicons } from '@expo/vector-icons';
import React, { useState, useRef } from 'react';
import { Alert, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

export default function GuiasScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [conteudo, setConteudo] = useState({ id: '', titulo: '', texto: '', video: null });
  const [concluidos, setConcluidos] = useState<string[]>([]);
  
  const videoRef = useRef(null);

  const abrirManual = (id: string, titulo: string, texto: string, videoSource: any) => {
    setConteudo({ id, titulo, texto, video: videoSource });
    setModalVisible(true);
  };

  const concluirModulo = () => {
    if (!concluidos.includes(conteudo.id)) {
      setConcluidos([...concluidos, conteudo.id]);
    }
    setModalVisible(false);
    Alert.alert("Parabéns!", "Você concluiu este estudo. Continue assim!");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Manuais de Cultivo</Text>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* CARD 1: MANDIOCA */}
        <TouchableOpacity 
          style={[styles.itemCard, concluidos.includes('mandioca') && styles.cardConcluido]}
          onPress={() => abrirManual(
            "mandioca", 
            "Pragas na Mandioca", 
            "1. Use mudas de plantas saudáveis.\n2. Faça a rotação de culturas.\n3. Inspecione as folhas toda semana.",
            require('./madioca.mp4.mp4') 
          )}
        >
          <View style={styles.row}>
            <Text style={styles.itemTitle}>Como evitar pragas na mandioca</Text>
            {concluidos.includes('mandioca') && <Ionicons name="checkmark-circle" size={24} color="#27AE60" />}
          </View>
          <View style={styles.tagContainer}>
            <Text style={styles.tagOffline}>
                {concluidos.includes('mandioca') ? "✅ Concluído" : "🎥 Assistir Vídeo-Aula"}
            </Text>
          </View>
        </TouchableOpacity>

        {/* CARD 2: PREÇO */}
        <TouchableOpacity 
          style={[styles.itemCard, concluidos.includes('preco') && styles.cardConcluido]}
          onPress={() => abrirManual(
            "preco", 
            "Preço da Production", 
            "Para calcular o preço, some:\n- Custo das sementes\n- Horas trabalhadas\n- Adubo e ferramentas.",
            require('./preco.mp4.mp4')
          )}
        >
          <View style={styles.row}>
            <Text style={styles.itemTitle}>Calcule o preço da sua produção</Text>
            {concluidos.includes('preco') && <Ionicons name="checkmark-circle" size={24} color="#27AE60" />}
          </View>
          <View style={styles.tagContainer}>
            <Text style={styles.tagOffline}>
                {concluidos.includes('preco') ? "✅ Concluído" : "🎥 Assistir Vídeo-Aula"}
            </Text>
          </View>
        </TouchableOpacity>

      </ScrollView>

      {/* Janela de Leitura */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
             <Text style={styles.modalTitle}>{conteudo.titulo}</Text>
             <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={30} color="#7F8C8D" />
             </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {conteudo.video && (
              <Video
                ref={videoRef}
                style={styles.realVideoPlayer}
                source={conteudo.video} 
                useNativeControls
                resizeMode={ResizeMode.COVER}
                isLooping
                shouldPlay={modalVisible} 
              />
            )}
            <Text style={styles.modalText}>{conteudo.texto}</Text>
          </ScrollView>

          <TouchableOpacity style={styles.doneButton} onPress={concluirModulo}>
            <Ionicons name="checkmark-done" size={20} color="white" style={{marginRight: 10}} />
            <Text style={styles.doneButtonText}>Marcar Módulo como Concluído</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7F6', padding: 20 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#27AE60', marginTop: 40, marginBottom: 20 },
  itemCard: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 12, marginBottom: 15, elevation: 2, borderLeftWidth: 0 },
  cardConcluido: { borderLeftWidth: 8, borderLeftColor: '#27AE60' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemTitle: { fontSize: 18, fontWeight: 'bold', color: '#2C3E50', marginBottom: 10, flex: 1 },
  tagContainer: { backgroundColor: '#E8F8F5', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 },
  tagOffline: { color: '#27AE60', fontSize: 12, fontWeight: 'bold' },
  modalView: { flex: 1, marginTop: 70, backgroundColor: "white", borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, elevation: 5 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#27AE60', flex: 1 },
  realVideoPlayer: { width: '100%', height: 220, borderRadius: 15, marginBottom: 20, backgroundColor: 'black' },
  modalText: { fontSize: 18, lineHeight: 28, color: '#2C3E50' },
  doneButton: { backgroundColor: "#27AE60", borderRadius: 12, padding: 18, marginTop: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  doneButtonText: { color: "
