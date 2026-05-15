import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function JornadaScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Trilha de Conhecimento</Text>
      <Text style={styles.progressText}>Siga os passos para melhorar o seu cultivo.</Text>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.stepCard}>
          <Text style={styles.stepNumber}>Passo 1</Text>
          <Text style={styles.stepTitle}>O preparo seguro da terra</Text>
          <Text style={styles.stepStatus}>Concluído</Text>
        </View>

        <TouchableOpacity 
          style={[styles.stepCard, styles.stepActive]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.stepNumberActive}>Passo 2 (Clique para ver)</Text>
          <Text style={styles.stepTitleActive}>Cuidados com a adubação</Text>
          <Text style={styles.stepSubtitle}>Vídeo e passo a passo liberados</Text>
        </TouchableOpacity>

        <View style={styles.eventCard}>
          <Text style={styles.eventDate}>DIA 15 - SÁBADO</Text>
          <Text style={styles.eventTitle}>Encontro na Vila</Text>
          <Text style={styles.eventSubtitle}>Traga suas dúvidas sobre adubação para conversar com os técnicos.</Text>
        </View>
      </ScrollView>

      {/* Janela de Atividade com VÍDEO */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            <View style={styles.videoPlayer}>
              <Ionicons name="play-circle" size={50} color="white" />
              <Text style={styles.videoText}>Ver aula do Técnico Agrícola</Text>
            </View>

            <Text style={styles.modalTitle}>O que fazer hoje na roça:</Text>
            <Text style={styles.todoItem}>✅ Verifique a umidade do solo.</Text>
            <Text style={styles.todoItem}>✅ Misture o adubo orgânico.</Text>
            <Text style={styles.todoItem}>✅ Aplique longe do caule.</Text>
            
            <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeBtnText}>Entendido, vou aplicar!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7F6', padding: 20 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#2980B9', marginTop: 40, marginBottom: 5 },
  progressText: { fontSize: 15, color: '#7F8C8D', marginBottom: 25 },
  stepCard: { backgroundColor: '#EAECEE', padding: 20, borderRadius: 10, marginBottom: 15 },
  stepActive: { backgroundColor: '#FFFFFF', borderLeftWidth: 5, borderLeftColor: '#2980B9', elevation: 2 },
  stepNumber: { fontSize: 12, fontWeight: 'bold', color: '#7F8C8D' },
  stepNumberActive: { fontSize: 12, fontWeight: 'bold', color: '#2980B9' },
  stepTitle: { fontSize: 18, fontWeight: 'bold', color: '#7F8C8D' },
  stepTitleActive: { fontSize: 18, fontWeight: 'bold', color: '#2C3E50' },
  stepSubtitle: { fontSize: 14, color: '#27AE60', fontWeight: 'bold', marginTop: 5 },
  stepStatus: { fontSize: 18, fontWeight: 'bold', color: '#7F8C8D' },
  eventCard: { backgroundColor: '#F9E79F', padding: 20, borderRadius: 10, borderStyle: 'dashed', borderWidth: 2, borderColor: '#F1C40F' },
  eventDate: { fontSize: 14, fontWeight: 'bold', color: '#D35400' },
  eventTitle: { fontSize: 20, fontWeight: 'bold', color: '#2C3E50' },
  eventSubtitle: { fontSize: 14, color: '#2C3E50' },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', backgroundColor: 'white', borderRadius: 20, padding: 20, elevation: 10 },
  videoPlayer: { backgroundColor: '#34495E', height: 140, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  videoText: { color: 'white', marginTop: 5, fontWeight: 'bold' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#2980B9' },
  todoItem: { fontSize: 16, marginBottom: 10, color: '#2C3E50' },
  closeBtn: { backgroundColor: '#2980B9', padding: 15, borderRadius: 10, marginTop: 10 },
  closeBtnText: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }
});