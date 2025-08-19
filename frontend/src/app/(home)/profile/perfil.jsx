import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import TopNavBar from '../../../components/_NavBar_Superior';

export default function ProfileScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState({
    nome: 'João Silva',
    email: 'joao@email.com',
    telefone: '(11) 99999-9999',
    cpf: '123.456.789-00',
    foto: null,
    dataNascimento: '15/03/1990',
    endereco: 'Rua das Flores, 123 - São Paulo/SP'
  });

  const [stats, setStats] = useState({
    totalEntregas: 1250,
    totalGanhos: 8750.00,
    veiculosCadastrados: 2,
    diasTrabalhados: 45
  });

  const handleEditProfile = () => {
    router.push('/(home)/profile/editar-perfil');
  };

  const handleVeiculos = () => {
    router.push('/(home)/profile/veiculos');
  };

  const handleChangePassword = () => {
    router.push('/(home)/profile/alterar-senha');
  };

  const handleSettings = () => {
    router.push('/(home)/profile/configuracoes');
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => {
            // Implementar logout
            console.log('Logout realizado');
          }
        }
      ]
    );
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Meu Perfil</Text>
          <TouchableOpacity style={styles.settingsButton} onPress={handleSettings}>
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
            {userProfile.foto ? (
              <Image source={{ uri: userProfile.foto }} style={styles.profilePhoto} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Ionicons name="person" size={60} color="#ccc" />
              </View>
            )}
            <View style={styles.photoEditButton}>
              <Ionicons name="camera" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.userName}>{userProfile.nome}</Text>
          <Text style={styles.userEmail}>{userProfile.email}</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Resumo</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Ionicons name="cube-outline" size={24} color="#007AFF" />
              <Text style={styles.statValue}>{stats.totalEntregas}</Text>
              <Text style={styles.statLabel}>Entregas</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="cash-outline" size={24} color="#34C759" />
              <Text style={styles.statValue}>R$ {stats.totalGanhos.toFixed(2)}</Text>
              <Text style={styles.statLabel}>Ganhos</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="car-outline" size={24} color="#FF9500" />
              <Text style={styles.statValue}>{stats.veiculosCadastrados}</Text>
              <Text style={styles.statLabel}>Veículos</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="calendar-outline" size={24} color="#AF52DE" />
              <Text style={styles.statValue}>{stats.diasTrabalhados}</Text>
              <Text style={styles.statLabel}>Dias</Text>
            </View>
          </View>
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
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
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
    height: 100,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginBottom: 10,
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
    paddingBottom: 100, // Espaço para a barra inferior
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
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  actionsSection: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B30',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});
