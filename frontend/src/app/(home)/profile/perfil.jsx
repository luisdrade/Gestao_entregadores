import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Alert, 
  ScrollView,
  Image,
  ActivityIndicator,
  Linking,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../../services/clientConfig';
import { API_CONFIG, API_ENDPOINTS } from '../../../config/api';
import { useAuth } from '../../../context/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const authContext = useAuth();
  const { user, signOut, updateUserPhoto } = authContext;
  const [loading, setLoading] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);
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
    buildPhotoUrl();
  }, [user, authContext]);

  const buildPhotoUrl = () => {
    try {
      const baseUrl = API_CONFIG.BASE_URL;
      
      console.log('🔍 buildPhotoUrl - user.foto:', user?.foto);
      console.log('🔍 buildPhotoUrl - stats.foto:', stats?.foto);
      
      // Priorizar foto do usuário atual
      if (user?.foto) {
        if (user.foto.startsWith('http')) {
          console.log('🔍 buildPhotoUrl - Usando user.foto com http:', user.foto);
          setPhotoUrl(user.foto);
        } else {
          // Construir URL completa
          const fullUrl = `${baseUrl}${user.foto}`;
          console.log('🔍 buildPhotoUrl - Construindo URL completa:', fullUrl);
          setPhotoUrl(fullUrl);
        }
      } else if (stats?.foto) {
        if (stats.foto.startsWith('http')) {
          console.log('🔍 buildPhotoUrl - Usando stats.foto com http:', stats.foto);
          setPhotoUrl(stats.foto);
        } else {
          const fullUrl = `${baseUrl}${stats.foto}`;
          console.log('🔍 buildPhotoUrl - Construindo URL completa das stats:', fullUrl);
          setPhotoUrl(fullUrl);
        }
      } else {
        console.log('🔍 buildPhotoUrl - Nenhuma foto encontrada');
        setPhotoUrl(null);
      }
    } catch (error) {
      console.error('Erro ao construir URL da foto:', error);
      setPhotoUrl(null);
    }
  };

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
        // Reconstruir URL da foto após carregar estatísticas
        setTimeout(() => buildPhotoUrl(), 100);
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
    showPhotoOptions();
  };

  const showPhotoOptions = () => {
    Alert.alert(
      'Gerenciar Foto de Perfil',
      'Escolha uma opção:',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Upload Manual', 
          onPress: () => uploadManualPhoto()
        },
        { 
          text: 'Limpar Foto', 
          onPress: () => clearPhoto()
        },
        {
          text: 'Abrir Web',
          onPress: () => openWebUpload()
        },
        {
          text: 'Tentar Câmera',
          onPress: () => tryNativeImagePicker()
        }
      ]
    );
  };

  const tryNativeImagePicker = async () => {
    try {
      // Tentar importar dinamicamente
      const ImagePicker = await import('expo-image-picker');
      
      if (ImagePicker && ImagePicker.requestCameraPermissionsAsync) {
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (cameraStatus === 'granted' && mediaLibraryStatus === 'granted') {
          Alert.alert(
            'Selecionar Foto',
            'Escolha como deseja adicionar uma foto:',
            [
              { text: 'Cancelar', style: 'cancel' },
              { 
                text: 'Câmera', 
                onPress: () => pickImageFromCamera(ImagePicker)
              },
              { 
                text: 'Galeria', 
                onPress: () => pickImageFromLibrary(ImagePicker)
              },
            ]
          );
        } else {
          Alert.alert(
            'Permissões Necessárias',
            'Para usar a câmera e galeria, conceda as permissões nas configurações do dispositivo.',
            [
              { text: 'OK' },
              { text: 'Configurações', onPress: () => ImagePicker.openSettingsAsync() }
            ]
          );
        }
      } else {
        throw new Error('ImagePicker não funcional');
      }
    } catch (error) {
      console.log('❌ ImagePicker não disponível:', error.message);
      Alert.alert(
        'Funcionalidade Indisponível',
        'O seletor de imagens nativo não está disponível. Use as outras opções.',
        [{ text: 'OK' }]
      );
    }
  };

  const pickImageFromCamera = async (ImagePicker) => {
    try {
      setUploadingPhoto(true);
      
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const image = result.assets[0];
        if (image.base64) {
          await uploadImageToServer(image.base64);
        }
      }
    } catch (error) {
      console.error('Erro ao usar câmera:', error);
      Alert.alert('Erro', 'Erro ao usar câmera. Tente outra opção.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const pickImageFromLibrary = async (ImagePicker) => {
    try {
      setUploadingPhoto(true);
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const image = result.assets[0];
        if (image.base64) {
          await uploadImageToServer(image.base64);
        }
      }
    } catch (error) {
      console.error('Erro ao usar galeria:', error);
      Alert.alert('Erro', 'Erro ao usar galeria. Tente outra opção.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const uploadManualPhoto = async () => {
    try {
      setUploadingPhoto(true);
      
      // Upload de uma imagem de teste (1x1 pixel transparente)
      const base64Image = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
      
      Alert.alert(
        'Upload Manual',
        'Enviando foto de teste...',
        [{ text: 'OK' }]
      );
      
      await uploadImageToServer(base64Image);
    } catch (error) {
      console.error('Erro no upload manual:', error);
      Alert.alert('Erro', 'Erro ao fazer upload manual.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const openWebUpload = () => {
    Alert.alert(
      'Upload via Web',
      'Para fazer upload de fotos, acesse a versão web do sistema.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Abrir Web', 
          onPress: () => {
            const webUrl = `${API_CONFIG.BASE_URL}/admin/`;
            Linking.openURL(webUrl);
          }
        }
      ]
    );
  };

  const uploadImageToServer = async (base64Image) => {
    try {
      console.log('🔄 Iniciando upload da foto...');
      const token = await AsyncStorage.getItem('@GestaoEntregadores:token');
      if (!token) {
        Alert.alert('Erro', 'Token não encontrado. Faça login novamente.');
        return;
      }

      // Preparar dados para envio
      const fotoData = `data:image/jpeg;base64,${base64Image}`;
      
      console.log('🔍 Token encontrado, fazendo requisição para:', API_ENDPOINTS.USER.UPLOAD_PHOTO);
      console.log('🔍 Tamanho do base64:', base64Image.length);
      
      const response = await api.post(API_ENDPOINTS.USER.UPLOAD_PHOTO, {
        foto: fotoData,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Resposta do servidor:', response.data);

      if (response.data.success) {
        console.log('✅ Upload bem-sucedido, foto_url:', response.data.foto_url);
        
        // Atualizar foto no contexto
        await updateUserPhoto(response.data.foto_url);
        
        // Reconstruir URL da foto após upload
        setTimeout(() => buildPhotoUrl(), 100);
        
        Alert.alert('Sucesso', 'Foto atualizada com sucesso!');
      } else {
        Alert.alert('Erro', response.data.error || 'Erro ao enviar foto.');
      }
    } catch (error) {
      console.error('❌ Erro ao enviar foto:', error);
      console.error('❌ Detalhes do erro:', error.response?.data);
      
      let errorMessage = 'Erro ao enviar foto. Tente novamente.';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Erro', errorMessage);
    }
  };

  const clearPhoto = async () => {
    try {
      await updateUserPhoto(null);
      setPhotoUrl(null);
      Alert.alert('Sucesso', 'Foto removida com sucesso!');
    } catch (error) {
      console.error('Erro ao limpar foto:', error);
      Alert.alert('Erro', 'Erro ao limpar foto.');
    }
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
          <TouchableOpacity 
            style={styles.photoContainer} 
            onPress={handleUploadPhoto}
            disabled={uploadingPhoto}
          >
            {photoUrl ? (
              <Image 
                source={{ 
                  uri: photoUrl,
                  headers: {
                    'Cache-Control': 'no-cache'
                  }
                }} 
                style={styles.profilePhoto}
                onError={(error) => {
                  console.log('❌ Erro ao carregar imagem:', error.nativeEvent);
                  setPhotoUrl(null);
                }}
              />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Ionicons name="person" size={60} color="#ccc" />
              </View>
            )}
            <View style={styles.photoEditButton}>
              {uploadingPhoto ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="camera" size={16} color="#fff" />
              )}
            </View>
          </TouchableOpacity>
          <Text style={styles.userName}>{user.nome || 'Usuário'}</Text>
          <Text style={styles.userEmail}>@{user.username || 'usuario'}</Text>
          {uploadingPhoto && (
            <Text style={styles.uploadingText}>Atualizando foto...</Text>
          )}
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
                <Text style={styles.statLabel}>Ganhos</Text>
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
  uploadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  infoText: {
    marginTop: 5,
    fontSize: 12,
    color: '#007AFF',
    fontStyle: 'italic',
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

