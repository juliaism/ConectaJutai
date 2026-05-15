import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function GuiasScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [conteudo, setConteudo] = useState({ titulo: '', texto: '' });

  const abrirManual = (titulo, texto) => {
    setConteudo({ titulo, texto });
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Manuais de Cultivo</Text>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity 
          style={styles.itemCard}
          onPress={() => abrirManual("Pragas na Mandioca", "1. Use mudas de plantas saudáveis.\n2. Faça a rotação de culturas.\n3. Inspecione as folhas toda semana.\n4. Se encontrar manchas, procure o técnico da vila.")}
        >
          <Text style={styles.itemTitle}>Como evitar pragas na mandioca</Text>
          <View style={styles.tagContainer}>
            <Text style={styles.tagOffline}>📱 Vídeo + Texto baixados</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.itemCard}
          onPress={() => abrirManual("Preço da Produção", "Para calcular o preço, some:\n- Custo das sementes\n- Horas trabalhadas\n- Adubo e ferramentas\n\nDivida o total pela quantidade colhida.")}
        >
          <Text style={styles.itemTitle}>Calcule o preço da sua produção</Text>
          <View style={styles.tagContainer}>
            <Text style={styles.tagOffline}>📱 Vídeo + Texto baixados</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Janela de Leitura com VÍDEO */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{conteudo.titulo}</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            
            {/* Simulador de Vídeo */}
            <View style={styles.videoPlayer}>
              <Ionicons name="play-circle" size={60} color="white" />
              <Text style={styles.videoText}>Assistir à aula prática</Text>
            </View>

            <Text style={styles.modalText}>{conteudo.texto}</Text>
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButtonText}>Fechar Material</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7F6', padding: 20 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#27AE60', marginTop: 40, marginBottom: 20 },
  itemCard: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 12, marginBottom: 15, elevation: 2 },
  itemTitle: { fontSize: 18, fontWeight: 'bold', color: '#2C3E50', marginBottom: 10 },
  tagContainer: { backgroundColor: '#E8F8F5', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 },
  tagOffline: { color: '#27AE60', fontSize: 12, fontWeight: 'bold' },
  modalView: { flex: 1, marginTop: 70, backgroundColor: "white", borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, elevation: 5 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: '#27AE60' },
  videoPlayer: { backgroundColor: '#34495E', height: 180, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  videoText: { color: 'white', marginTop: 10, fontWeight: 'bold' },
  modalText: { fontSize: 18, lineHeight: 28, color: '#2C3E50' },
  closeButton: { backgroundColor: "#27AE60", borderRadius: 10, padding: 15, marginTop: 20 },
  closeButtonText: { color: "white", fontWeight: "bold", textAlign: "center", fontSize: 16 }
});