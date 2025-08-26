import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Alert, 
  ScrollView,
  Image 
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../../services/api';
import { API_ENDPOINTS } from '../../../config/api';
import { useAuth } from '../../../context/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const authContext = useAuth();
  const { user, signOut } = authContext;
  const [loading, setLoading] = useState(false); // Mudado para false já que não carregamos mais dados do AsyncStorage
  const [loadingStats, setLoadingStats] = useState(true);
  const [stats, setStats] = useState({
    totalEntregas: 0,
    totalGanhos: 0,
    veiculosCadastrados: 0,
    diasTrabalhados: 0,
    diasConectado: 0
  });

  useEffect(() => {
    console.log('🔍 ProfileScreen - AuthContext completo:', authContext);
    console.log('🔍 ProfileScreen - Usuário atual:', user);
    console.log('🔍 ProfileScreen - Função signOut disponível:', !!signOut);
    loadUserStats();
  }, [user, authContext]);

  const loadUserStats = async () => {
    try {
      setLoadingStats(true);
      const token = await AsyncStorage.getItem('@GestaoEntregadores:token');
      if (!token) return;

      const response = await api.get(API_ENDPOINTS.USER.STATISTICS, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      // Em caso de erro, manter os valores padrão
    } finally {
      setLoadingStats(false);
    }
  };

  const handleEditProfile = () => {
    router.push('/(home)/profile/editar-perfil');
  };

  const handleVeiculos = () => {
    router.push('/(home)/profile/veiculos');
  };

  const handleChangePassword = () => {
    router.push('/(home)/profile/alterar-senha');
  };

  const handleUploadPhoto = () => {
    Alert.alert(
      'Foto de perfil',
      'Escolha uma opção:',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Câmera', onPress: () => console.log('Abrir câmera') },
        { text: 'Galeria', onPress: () => console.log('Abrir galeria') }
      ]
    );
  };

  const handleLogout = async () => {
    console.log('🔍 ProfileScreen - handleLogout chamado');
    console.log('🔍 ProfileScreen - Usuário atual:', user);
    console.log('🔍 ProfileScreen - Função signOut disponível:', !!signOut);
    
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🔄 Iniciando logout...');
              
              // Usar a função signOut do contexto
              await signOut();
              
              console.log('✅ Logout realizado com sucesso');
              
              // Redirecionar para a tela de login
              router.replace('/');
            } catch (error) {
              console.error('❌ Erro ao fazer logout:', error);
              Alert.alert('Erro', 'Erro ao fazer logout. Tente novamente.');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    router.replace('/');
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Meu Perfil</Text>
          <TouchableOpacity style={styles.settingsButton} onPress={handleChangePassword}>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Photo Section */}
        <View style={styles.photoSection}>
          <TouchableOpacity style={styles.photoContainer} onPress={handleUploadPhoto}>
            {user.foto ? (
              <Image source={{ uri: user.foto }} style={styles.profilePhoto} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Ionicons name="person" size={60} color="#ccc" />
              </View>
            )}
            <View style={styles.photoEditButton}>
              <Ionicons name="camera" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.userName}>{user.nome || 'Usuário'}</Text>
          <Text style={styles.userEmail}>{user.email || 'email@exemplo.com'}</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Resumo</Text>
          {loadingStats ? (
            <View style={styles.statsLoading}>
              <Text style={styles.loadingText}>Carregando estatísticas...</Text>
            </View>
          ) : (
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Ionicons name="cube-outline" size={24} color="#007AFF" />
                <Text style={styles.statValue}>{stats.totalEntregas}</Text>
                <Text style={styles.statLabel}>Entregas</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="cash-outline" size={24} color="#34C759" />
                <Text style={styles.statValue}>R$ {stats.totalGanhos.toFixed(2)}</Text>
                <Text style={styles.statLabel}>Lucro</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="car-outline" size={24} color="#FF9500" />
                <Text style={styles.statValue}>{stats.veiculosCadastrados}</Text>
                <Text style={styles.statLabel}>Veículos</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="calendar-outline" size={24} color="#AF52DE" />
                <Text style={styles.statValue}>{stats.diasConectado}</Text>
                <Text style={styles.statLabel}>Dias</Text>
              </View>
            </View>
          )}
        </View>

        {/* Profile Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Gerenciar Conta</Text>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleEditProfile}>
            <View style={styles.actionContent}>
              <Ionicons name="person-outline" size={20} color="#007AFF" />
              <Text style={styles.actionText}>Editar Perfil</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleVeiculos}>
            <View style={styles.actionContent}>
              <Ionicons name="car-outline" size={20} color="#007AFF" />
              <Text style={styles.actionText}>Meus Veículos</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleChangePassword}>
            <View style={styles.actionContent}>
              <Ionicons name="lock-closed-outline" size={20} color="#007AFF" />
              <Text style={styles.actionText}>Alterar Senha</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
         
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.logoutText}>Sair da Conta</Text>
          </TouchableOpacity>
          
        </View>

      </ScrollView>

      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingTop: 50, // Adjust for safe area
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  settingsButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 100, // Aumentar padding para garantir que o botão seja visível
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photoContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  profilePhoto: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  photoEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  statsSection: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  statItem: {
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statsLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  actionsSection: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B30',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
    minWidth: 200,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  logoutSection: {
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 20, // Adicionar margem inferior
  },
  debugText: {
    fontSize: 14,
    color: 'red',
    marginBottom: 10,
  },
});
