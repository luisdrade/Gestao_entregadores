import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext.jsx';
import { httpClient } from '../../services/clientConfig';
import { API_ENDPOINTS } from '../../config/api';

export default function TwoFactorSetupScreen() {
  const { user, signOut } = useAuth();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [setupLoading, setSetupLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Iniciar setup do 2FA automaticamente
    start2FASetup();
  }, []);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const start2FASetup = async () => {
    try {
      setSetupLoading(true);
      const response = await httpClient.post(API_ENDPOINTS.AUTH.TWO_FA_SETUP);
      
      if (response.data.success) {
        setEmailSent(true);
        setCountdown(600); // 10 minutos
        Alert.alert(
          'Código Enviado! 📧',
          `Um código de verificação foi enviado para ${user?.email}. Verifique sua caixa de entrada e spam.`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Erro', response.data.message || 'Erro ao enviar código');
      }
    } catch (error) {
      console.error('Erro no setup 2FA:', error);
      Alert.alert(
        'Erro',
        error.response?.data?.message || 'Erro ao configurar 2FA'
      );
    } finally {
      setSetupLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!code || code.length !== 6) {
      Alert.alert('Erro', 'Digite um código de 6 dígitos');
      return;
    }

    try {
      setLoading(true);
      const response = await httpClient.post(API_ENDPOINTS.AUTH.TWO_FA_VERIFY, {
        code: code,
      });

      if (response.data.success) {
        Alert.alert(
          'Sucesso! 🎉',
          '2FA ativado com sucesso! Sua conta agora está mais segura.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Redirecionar para home ou perfil
                // O AuthContext já vai atualizar o estado
              },
            },
          ]
        );
      } else {
        Alert.alert('Erro', response.data.message || 'Código inválido');
      }
    } catch (error) {
      console.error('Erro na verificação:', error);
      Alert.alert(
        'Erro',
        error.response?.data?.message || 'Erro ao verificar código'
      );
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    if (countdown > 0) {
      Alert.alert('Aguarde', `Aguarde ${countdown} segundos para reenviar`);
      return;
    }

    await start2FASetup();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>🔒 Ativar 2FA</Text>
            <Text style={styles.subtitle}>
              Adicione uma camada extra de segurança à sua conta
            </Text>
          </View>

          <View style={styles.content}>
            {!emailSent ? (
              <View style={styles.setupContainer}>
                <ActivityIndicator size="large" color="#667eea" />
                <Text style={styles.setupText}>
                  Configurando autenticação de 2 fatores...
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.emailContainer}>
                  <Text style={styles.emailLabel}>Código enviado para:</Text>
                  <Text style={styles.emailText}>{user?.email}</Text>
                </View>

                <View style={styles.codeContainer}>
                  <Text style={styles.codeLabel}>Digite o código de 6 dígitos:</Text>
                  <TextInput
                    style={styles.codeInput}
                    value={code}
                    onChangeText={setCode}
                    placeholder="123456"
                    keyboardType="number-pad"
                    maxLength={6}
                    textAlign="center"
                    autoFocus
                  />
                </View>

                <View style={styles.timerContainer}>
                  <Text style={styles.timerText}>
                    ⏰ Código expira em: {formatTime(countdown)}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.verifyButton, loading && styles.buttonDisabled]}
                  onPress={verifyCode}
                  disabled={loading || code.length !== 6}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.verifyButtonText}>Verificar Código</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.resendButton}
                  onPress={resendCode}
                  disabled={countdown > 0}
                >
                  <Text style={[
                    styles.resendButtonText,
                    countdown > 0 && styles.resendButtonDisabled
                  ]}>
                    {countdown > 0 ? `Reenviar em ${formatTime(countdown)}` : 'Reenviar Código'}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            <View style={styles.infoContainer}>
              <Text style={styles.infoTitle}>ℹ️ Sobre o 2FA</Text>
              <Text style={styles.infoText}>
                • Você receberá um código por email sempre que fizer login
              </Text>
              <Text style={styles.infoText}>
                • Dispositivos confiáveis não precisarão de 2FA
              </Text>
              <Text style={styles.infoText}>
                • Mantenha seu email seguro para proteger sua conta
              </Text>
            </View>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                Alert.alert(
                  'Cancelar 2FA',
                  'Tem certeza que deseja cancelar a ativação do 2FA?',
                  [
                    { text: 'Continuar', style: 'cancel' },
                    {
                      text: 'Cancelar',
                      style: 'destructive',
                      onPress: () => {
                        // Voltar para tela anterior
                      },
                    },
                  ]
                );
              }}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#5a6c7d',
    textAlign: 'center',
    lineHeight: 24,
  },
  content: {
    flex: 1,
  },
  setupContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  setupText: {
    fontSize: 16,
    color: '#5a6c7d',
    marginTop: 20,
    textAlign: 'center',
  },
  emailContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emailLabel: {
    fontSize: 14,
    color: '#5a6c7d',
    marginBottom: 5,
  },
  emailText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  codeContainer: {
    marginBottom: 20,
  },
  codeLabel: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  codeInput: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 20,
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  timerText: {
    fontSize: 14,
    color: '#dc3545',
    fontWeight: '600',
  },
  verifyButton: {
    backgroundColor: '#667eea',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: '#adb5bd',
    shadowOpacity: 0,
    elevation: 0,
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  resendButtonText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
  },
  resendButtonDisabled: {
    color: '#adb5bd',
  },
  infoContainer: {
    backgroundColor: '#e3f2fd',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
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
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: '#6c757d',
    fontSize: 14,
  },
});













