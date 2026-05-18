import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function JornadaScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Jornada de Aprendizado</Text>
      <Text style={styles.subtitle}>Módulo 1: Preparação do Solo</Text>

      <View style={styles.headerCard}>
        <Ionicons name="map" size={40} color="#27AE60" />
        <Text style={styles.headerCardText}>
          Siga o passo a passo abaixo para iniciar sua plantação com sucesso e segurança.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>1. Limpeza do Terreno</Text>
        <Text style={styles.cardText}>Retire galhos secos e pedras maiores antes de começar o plantio. Deixe a terra respirar.</Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>2. Adubação Orgânica</Text>
        <Text style={styles.cardText}>Utilize a compostagem feita pela própria comunidade para enriquecer a terra sem gastar dinheiro.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>3. Demarcação</Text>
        <Text style={styles.cardText}>Meça os espaços corretamente para que cada planta tenha a área ideal para crescer saudável.</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7F6', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#27AE60', marginTop: 40 },
  subtitle: { fontSize: 18, color: '#2C3E50', marginBottom: 20, fontWeight: 'bold' },
  headerCard: { flexDirection: 'row', backgroundColor: '#E8F8F5', padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 25 },
  headerCardText: { flex: 1, marginLeft: 15, fontSize: 16, color: '#2C3E50', fontWeight: '500', lineHeight: 22 },
  card: { backgroundColor: '#FFF', padding: 20, borderRadius: 12, marginBottom: 15, elevation: 2, borderLeftWidth: 6, borderLeftColor: '#27AE60' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#2C3E50', marginBottom: 8 },
  cardText: { fontSize: 16, color: '#7F8C8D', lineHeight: 24 }
});
