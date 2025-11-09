import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../context/AuthContext.jsx';
import { httpClient } from '../../services/clientConfig';
import { API_ENDPOINTS } from '../../config/api';
import CodeInput from '../../components/CodeInput';

export default function RegisterVerifyCodeScreen() {
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutos em segundos
  const [attemptsRemaining, setAttemptsRemaining] = useState(5);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockedUntil, setBlockedUntil] = useState(null);
  const [error, setError] = useState(null);
  
  const router = useRouter();
  const params = useLocalSearchParams();
  const { loginAfterVerification } = useAuth();
  
  const { 
    userEmail, 
    userPhone, 
    verificationMethod, 
    expiresAt, 
    attemptsRemaining: initialAttempts 
  } = params;

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Formatar tempo restante
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Verificar se código está completo
  const isCodeComplete = code.length === 6;

  const handleVerifyCode = async () => {
    if (!isCodeComplete || isVerifying) return;

    setIsVerifying(true);
    setError(null);

    try {
      const response = await httpClient.post(API_ENDPOINTS.AUTH.REGISTER_VERIFY, {
        email: userEmail,
        code: code,
        verification_method: verificationMethod
      });

      if (response.data.success) {
        // Usar a função do AuthContext para fazer login automático
        const { tokens, user } = response.data;
        await loginAfterVerification(tokens, user);
        
        // Redirecionar direto para o dashboard
        router.replace('/(home/home)');
      } else {
        setError(response.data.error || 'Código inválido');
      }
    } catch (error) {
      console.error('Erro ao verificar código:', error);
      
      let errorMessage = 'Erro ao verificar código';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      setError(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (isResending || isBlocked) return;

    setIsResending(true);
    setError(null);

    try {
      console.log('📤 Reenviando código para:', userEmail);
      const response = await httpClient.post(API_ENDPOINTS.AUTH.REGISTER_RESEND, {
        email: userEmail,
        verification_method: verificationMethod || 'email'
      });

      console.log('✅ Resposta do reenvio:', response.data);

      if (response.data.success) {
        setCode(''); // Limpar código atual
        setTimeLeft(600); // Resetar timer
        setAttemptsRemaining(response.data.attempts_remaining || 5);
        
        Alert.alert(
          'Código Reenviado',
          response.data.message || 'Um novo código foi enviado para você.'
        );
      } else {
        // CORRIGIDO: usar response.data ao invés de error.response?.data
        const errorData = response.data;
        if (errorData?.reason === 'max_attempts_exceeded') {
          setIsBlocked(true);
          setError('Você excedeu o limite de tentativas. Tente novamente em 5 minutos.');
        } else {
          setError(errorData?.error || 'Erro ao reenviar código');
        }
      }
    } catch (error) {
      console.error('❌ Erro ao reenviar código:', error);
      
      // Melhor tratamento de erro de rede
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        setError('Tempo de espera esgotado. Verifique sua conexão e tente novamente.');
      } else if (error.code === 'ERR_NETWORK' || !error.response) {
        setError('Erro de conexão. Verifique sua internet e tente novamente.');
      } else {
        const errorData = error.response?.data;
        if (errorData?.reason === 'max_attempts_exceeded') {
          setIsBlocked(true);
          setError('Você excedeu o limite de tentativas. Tente novamente em 5 minutos.');
        } else {
          setError(errorData?.error || errorData?.message || 'Erro ao reenviar código');
        }
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const getMethodDisplayName = () => {
    return 'Email';
  };

  const getMaskedContact = () => {
    const [username, domain] = userEmail.split('@');
    const maskedUsername = username.length > 2 
      ? username[0] + '*'.repeat(username.length - 2) + username[username.length - 1]
      : username;
    return `${maskedUsername}@${domain}`;
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.title}>Verificar Código</Text>
          <Text style={styles.subtitle}>
            Digite o código de 6 dígitos enviado para seu email
          </Text>

          <View style={styles.contactInfo}>
            <Text style={styles.contactText}>
              📧 {getMaskedContact()}
            </Text>
          </View>

          <CodeInput
            value={code}
            onChange={setCode}
            error={error}
            disabled={isVerifying}
          />

          {timeLeft > 0 && (
            <Text style={styles.timerText}>
              ⏰ Tempo restante: {formatTime(timeLeft)}
            </Text>
          )}

          {timeLeft === 0 && (
            <Text style={styles.expiredText}>
              ⚠️ Código expirado. Solicite um novo código.
            </Text>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.verifyButton,
                (!isCodeComplete || isVerifying || timeLeft === 0) && styles.buttonDisabled
              ]}
              onPress={handleVerifyCode}
              disabled={!isCodeComplete || isVerifying || timeLeft === 0}
            >
              {isVerifying ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.verifyButtonText}>Verificar Código</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.resendButton,
                (isResending || isBlocked || attemptsRemaining === 0) && styles.buttonDisabled
              ]}
              onPress={handleResendCode}
              disabled={isResending || isBlocked || attemptsRemaining === 0}
            >
              {isResending ? (
                <ActivityIndicator color="#2B2860" />
              ) : (
                <Text style={styles.resendButtonText}>
                  {isBlocked ? 'Bloqueado' : `Reenviar Código (${attemptsRemaining} restantes)`}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              💡 Não recebeu o código? Verifique sua caixa de spam
            </Text>
            <Text style={styles.infoText}>
              🔒 Você pode solicitar até 5 códigos em 5 minutos
            </Text>
          </View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            disabled={isVerifying || isResending}
          >
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2B2860',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555555',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  contactInfo: {
    backgroundColor: '#e8f4fd',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
    width: '100%',
    maxWidth: 300,
  },
  contactText: {
    fontSize: 16,
    color: '#2B2860',
    textAlign: 'center',
    fontWeight: '500',
  },
  timerText: {
    fontSize: 16,
    color: '#2B2860',
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
  },
  expiredText: {
    fontSize: 16,
    color: '#ff3b30',
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    marginTop: 30,
  },
  verifyButton: {
    backgroundColor: '#2B2860',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#2B2860',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resendButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2B2860',
  },
  resendButtonText: {
    color: '#2B2860',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  infoContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginTop: 30,
    width: '100%',
    maxWidth: 300,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 20,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  backButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
});
