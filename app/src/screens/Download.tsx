import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import {Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator} from 'react-native';
import { downloadGuideService } from '../service/downloadGuiasService';
import { SafeAreaView } from 'react-native-safe-area-context';

interface GuideInfo {
  id: string;
  titulo: string;
  downloadedAt: string;
  size: number;
}

export default function DownloadsScreen() {
  const [downloadedGuides, setDownloadedGuides] = useState<GuideInfo[]>([]);
  const [totalSize, setTotalSize] = useState(0);
  const [availableSpace, setAvailableSpace] = useState(0);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadDownloadsInfo();
  }, []);

  const loadDownloadsInfo = async () => {
    try {
      setLoading(true);

      const guides = await downloadGuideService.getDownloadedGuides();
      setDownloadedGuides(
        guides.map((g) => ({
          id: g.id,
          titulo: g.titulo,
          downloadedAt: g.downloadedAt || '',
          size: g.videoSize || 0,
        }))
      );

      const total = await downloadGuideService.getTotalDownloadedSize();
      setTotalSize(total);

      const available = await downloadGuideService.getAvailableSpace();
      setAvailableSpace(available);
    } catch (err) {
      console.error('Erro ao carregar informações:', err);
      Alert.alert('❌ Erro', 'Erro ao carregar informações de downloads.');
    } finally {
      setLoading(false);
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
              loadDownloadsInfo();
              Alert.alert('✅ Deletado', 'Guia removido com sucesso.');
            } catch (err) {
              Alert.alert('❌ Erro', 'Erro ao deletar guia.');
            }
          },
        },
      ]
    );
  };

  const handleCleanOldGuides = async () => {
    Alert.alert(
      'Limpar Cache',
      'Deletar guias com mais de 30 dias?',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Limpar',
          onPress: async () => {
            try {
              await downloadGuideService.cleanOldGuides(30);
              loadDownloadsInfo();
              Alert.alert('✅ Limpeza Concluída', 'Guias antigos foram removidos.');
            } catch (err) {
              Alert.alert('❌ Erro', 'Erro ao limpar cache.');
            }
          },
        },
      ]
    );
  };

  const handleSyncProgress = async () => {
    try {
      setSyncing(true);
      await downloadGuideService.syncOfflineProgress('user-id');
      Alert.alert('✅ Sincronizado', 'Progresso sincronizado com sucesso.');
    } catch (err) {
      Alert.alert('❌ Erro', 'Erro ao sincronizar progresso.');
    } finally {
      setSyncing(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return 'Data desconhecida';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#27AE60" style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>📥 Meus Downloads</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.spaceCard}>
          <View style={styles.spaceRow}>
            <View>
              <Text style={styles.spaceLabel}>Espaço Usado</Text>
              <Text style={styles.spaceValue}>{formatBytes(totalSize)}</Text>
            </View>
            <View>
              <Text style={styles.spaceLabel}>Espaço Disponível</Text>
              <Text style={styles.spaceValue}>{formatBytes(availableSpace)}</Text>
            </View>
          </View>

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${
                    ((totalSize / (totalSize + availableSpace)) * 100) || 0
                  }%`,
                },
              ]}
            />
          </View>
        </View>

        {downloadedGuides.length > 0 ? (
          <View>
            <Text style={styles.sectionTitle}>
              📚 Guias Baixados ({downloadedGuides.length})
            </Text>

            {downloadedGuides.map((guide) => (
              <View key={guide.id} style={styles.guideCard}>
                <View style={styles.guideInfo}>
                  <Text style={styles.guideTitle}>{guide.titulo}</Text>
                  <Text style={styles.guideDate}>
                    📅 {formatDate(guide.downloadedAt)}
                  </Text>
                  <Text style={styles.guideSize}>
                    💾 {formatBytes(guide.size)}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => handleDeleteGuide(guide.id)}
                  style={styles.deleteBtn}
                >
                  <Ionicons name="trash" size={20} color="#E74C3C" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="cloud-download-outline" size={64} color="#BDC3C7" />
            <Text style={styles.emptyText}>Nenhum guia baixado</Text>
            <Text style={styles.emptySubtext}>
              Volte para "Manuais de Cultivo" e baixe um guia
            </Text>
          </View>
        )}

        {downloadedGuides.length > 0 && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              onPress={handleCleanOldGuides}
              style={styles.cleanButton}
            >
              <Ionicons name="trash-bin" size={18} color="white" />
              <Text style={styles.cleanButtonText}>Limpar Lixeira</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSyncProgress}
              disabled={syncing}
              style={[styles.syncButton, syncing && styles.syncButtonDisabled]}
            >
              {syncing ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Ionicons name="sync" size={18} color="white" />
              )}
              <Text style={styles.syncButtonText}>
                {syncing ? 'Sincronizando...' : 'Sincronizar Progresso'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
  spaceCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  spaceRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  spaceLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    fontWeight: '600',
    marginBottom: 5,
  },
  spaceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27AE60',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#ECF0F1',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#27AE60',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
    marginTop: 10,
  },
  guideCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
  },
  guideInfo: {
    flex: 1,
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  guideDate: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 3,
  },
  guideSize: {
    fontSize: 12,
    color: '#27AE60',
    fontWeight: '600',
  },
  deleteBtn: {
    padding: 10,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 8,
    textAlign: 'center',
  },
  actionButtons: {
    marginTop: 20,
    marginBottom: 30,
    gap: 10,
  },
  cleanButton: {
    backgroundColor: '#F39C12',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  cleanButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 14,
  },
  syncButton: {
    backgroundColor: '#3498DB',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  syncButtonDisabled: {
    opacity: 0.6,
  },
  syncButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 14,
  },
});