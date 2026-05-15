import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter(); 

  const simularSincronizacao = () => {
    Alert.alert(
      "Sincronização Concluída ✅", 
      "Todos os novos manuais e vídeos foram baixados do ponto da vila. Você já pode acessar sem internet!"
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.header}>
        <View>
          <Text style={styles.appName}>Conecta Jutaí</Text>
          <Text style={styles.greeting}>Olá, João. Bom trabalho!</Text>
        </View>
        <Text style={styles.offlineStatus}>Sem internet</Text>
      </View>

      <TouchableOpacity style={styles.syncButton} onPress={simularSincronizacao}>
        <Text style={styles.syncTitle}>Atualizar Materiais na Vila</Text>
        <Text style={styles.syncSubtitle}>Toque aqui quando estiver no centrinho</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cardPrimary} onPress={() => router.push('/guias')}>
        <Text style={styles.cardTitle}>Manuais de Cultivo</Text>
        <Text style={styles.cardSubtitle}>Leituras e vídeos salvos para a roça.</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cardSecondary} onPress={() => router.push('/jornada')}>
        <Text style={styles.cardTitle}>Trilha de Conhecimento</Text>
        <Text style={styles.cardSubtitle}>Siga o passo a passo dos estudos.</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7F6', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40, marginBottom: 30 },
  appName: { fontSize: 14, color: '#27AE60', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 2 },
  greeting: { fontSize: 22, fontWeight: 'bold', color: '#2C3E50' },
  offlineStatus: { fontSize: 14, color: '#7F8C8D', fontWeight: '600' },
  syncButton: { backgroundColor: '#E67E22', padding: 20, borderRadius: 15, alignItems: 'center', marginBottom: 30, elevation: 3 },
  syncTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  syncSubtitle: { color: '#FFF', fontSize: 12, marginTop: 5, opacity: 0.8 },
  cardPrimary: { backgroundColor: '#27AE60', padding: 25, borderRadius: 15, marginBottom: 20 },
  cardSecondary: { backgroundColor: '#2980B9', padding: 25, borderRadius: 15 },
  cardTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  cardSubtitle: { color: '#FFF', fontSize: 14, opacity: 0.9 },
});