import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../context/AuthContext';
import { httpClient } from '../../../services/clientConfig';
import { API_ENDPOINTS } from '../../../config/api';

export default function TwoFactorSettingsScreen() {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [settingUp, setSettingUp] = useState(false);

  useEffect(() => {
    check2FAStatus();
  }, []);

  const check2FAStatus = async () => {
    try {
      setLoading(true);
      const response = await httpClient.get(API_ENDPOINTS.AUTH.TWO_FA_STATUS);
      
      if (response.data.success) {
        setTwoFactorEnabled(response.data.enabled);
      }
    } catch (error) {
      console.error('Erro ao verificar status 2FA:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle2FA = async () => {
    if (twoFactorEnabled) {
      // Desabilitar 2FA
      Alert.alert(
        'Desabilitar 2FA',
        'Tem certeza que deseja desabilitar a autenticação de 2 fatores? Isso reduzirá a segurança da sua conta.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Desabilitar',
            style: 'destructive',
            onPress: disable2FA,
          },
        ]
      );
    } else {
      // Ativar 2FA
      Alert.alert(
        'Ativar 2FA',
        'Deseja ativar a autenticação de 2 fatores? Você receberá códigos por email para fazer login.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Ativar',
            onPress: enable2FA,
          },
        ]
      );
    }
  };

  const enable2FA = async () => {
    try {
      setSettingUp(true);
      
      // Iniciar setup do 2FA
      const response = await httpClient.post(API_ENDPOINTS.AUTH.TWO_FA_SETUP);
      
      if (response.data.success) {
        Alert.alert(
          'Código Enviado! 📧',
          `Um código de verificação foi enviado para ${user?.email}. Verifique sua caixa de entrada e spam.`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Navegar para tela de setup
                // router.push('/(auth)/2fa-setup');
              },
            },
          ]
        );
      } else {
        Alert.alert('Erro', response.data.message || 'Erro ao ativar 2FA');
      }
    } catch (error) {
      console.error('Erro ao ativar 2FA:', error);
      Alert.alert(
        'Erro',
        error.response?.data?.message || 'Erro ao ativar 2FA'
      );
    } finally {
      setSettingUp(false);
    }
  };

  const disable2FA = async () => {
    try {
      setSettingUp(true);
      
      // Solicitar código para desabilitar
      const response = await httpClient.post(API_ENDPOINTS.AUTH.TWO_FA_DISABLE);
      
      if (response.data.success) {
        Alert.alert(
          'Código Enviado! 📧',
          `Um código de verificação foi enviado para ${user?.email} para confirmar a desativação do 2FA.`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Navegar para tela de verificação de desativação
                // router.push('/(auth)/2fa-disable');
              },
            },
          ]
        );
      } else {
        Alert.alert('Erro', response.data.message || 'Erro ao desabilitar 2FA');
      }
    } catch (error) {
      console.error('Erro ao desabilitar 2FA:', error);
      Alert.alert(
        'Erro',
        error.response?.data?.message || 'Erro ao desabilitar 2FA'
      );
    } finally {
      setSettingUp(false);
    }
  };

  const force2FA = async () => {
    Alert.alert(
      'Forçar 2FA',
      'Isso fará com que todos os dispositivos precisem de 2FA no próximo login. Tem certeza?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Forçar',
          style: 'destructive',
          onPress: async () => {
            try {
              setSettingUp(true);
              const response = await httpClient.post(API_ENDPOINTS.AUTH.FORCE_2FA);
              
              if (response.data.success) {
                Alert.alert('Sucesso', '2FA será obrigatório em todos os dispositivos no próximo login.');
              } else {
                Alert.alert('Erro', response.data.message || 'Erro ao forçar 2FA');
              }
            } catch (error) {
              console.error('Erro ao forçar 2FA:', error);
              Alert.alert('Erro', 'Erro ao forçar 2FA');
            } finally {
              setSettingUp(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loadingText}>Carregando configurações...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>🔒 Autenticação de 2 Fatores</Text>
          <Text style={styles.subtitle}>
            Adicione uma camada extra de segurança à sua conta
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.settingCard}>
            <View style={styles.settingHeader}>
              <Text style={styles.settingTitle}>2FA Ativado</Text>
              <Switch
                value={twoFactorEnabled}
                onValueChange={handleToggle2FA}
                disabled={settingUp}
                trackColor={{ false: '#e9ecef', true: '#667eea' }}
                thumbColor={twoFactorEnabled ? '#ffffff' : '#f4f3f4'}
              />
            </View>
            <Text style={styles.settingDescription}>
              {twoFactorEnabled
                ? 'Você receberá códigos por email para fazer login'
                : 'Ative para receber códigos de verificação por email'}
            </Text>
          </View>

          {twoFactorEnabled && (
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>ℹ️ Como Funciona</Text>
              <Text style={styles.infoText}>
                • Você receberá um código por email sempre que fizer login
              </Text>
              <Text style={styles.infoText}>
                • Dispositivos confiáveis não precisarão de 2FA
              </Text>
              <Text style={styles.infoText}>
                • Códigos expiram em 10 minutos
              </Text>
              <Text style={styles.infoText}>
                • Mantenha seu email seguro
              </Text>
            </View>
          )}

          {twoFactorEnabled && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={force2FA}
              disabled={settingUp}
            >
              <Text style={styles.actionButtonText}>
                Forçar 2FA em Todos os Dispositivos
              </Text>
            </TouchableOpacity>
          )}

          <View style={styles.securityCard}>
            <Text style={styles.securityTitle}>🛡️ Dicas de Segurança</Text>
            <Text style={styles.securityText}>
              • Use senhas fortes e únicas
            </Text>
            <Text style={styles.securityText}>
              • Mantenha seu email seguro
            </Text>
            <Text style={styles.securityText}>
              • Não compartilhe códigos de verificação
            </Text>
            <Text style={styles.securityText}>
              • Faça logout em dispositivos públicos
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#5a6c7d',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#5a6c7d',
    textAlign: 'center',
    lineHeight: 22,
  },
  content: {
    padding: 20,
  },
  settingCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  settingDescription: {
    fontSize: 14,
    color: '#5a6c7d',
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a148c',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#5a6c7d',
    marginBottom: 5,
    lineHeight: 20,
  },
  actionButton: {
    backgroundColor: '#ff6b6b',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  securityCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  securityText: {
    fontSize: 14,
    color: '#5a6c7d',
    marginBottom: 5,
    lineHeight: 20,
  },
});



