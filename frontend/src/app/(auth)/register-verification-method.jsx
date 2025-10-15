import React, { useState } from 'react';
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
import { httpClient } from '../../services/clientConfig';
import { API_ENDPOINTS } from '../../config/api';

export default function RegisterVerificationMethodScreen() {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const { userEmail, userPhone } = params;

  // Mascarar email e telefone para exibição
  const maskEmail = (email) => {
    if (!email) return '';
    const [username, domain] = email.split('@');
    const maskedUsername = username.length > 2 
      ? username[0] + '*'.repeat(username.length - 2) + username[username.length - 1]
      : username;
    return `${maskedUsername}@${domain}`;
  };

  const maskPhone = (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length >= 10) {
      const ddd = cleaned.substring(0, 2);
      const firstPart = cleaned.substring(2, 6);
      const lastPart = cleaned.substring(cleaned.length - 4);
      return `(${ddd}) ${firstPart[0]}${firstPart[1]}**-${lastPart}`;
    }
    return phone;
  };

  const handleMethodSelect = async (method) => {
    if (isLoading) return;
    
    setSelectedMethod(method);
    setIsLoading(true);

    try {
      // Enviar requisição para gerar e enviar código
      const response = await httpClient.post(API_ENDPOINTS.AUTH.REGISTER_RESEND, {
        email: userEmail,
        verification_method: method
      });

      if (response.data.success) {
        // Navegar para tela de verificação de código
        router.push({
          pathname: '/register-verify-code',
          params: {
            userEmail,
            userPhone,
            verificationMethod: method,
            expiresAt: response.data.expires_at,
            attemptsRemaining: response.data.attempts_remaining
          }
        });
      } else {
        Alert.alert('Erro', response.data.error || 'Erro ao enviar código');
      }
    } catch (error) {
      console.error('Erro ao enviar código:', error);
      
      let errorMessage = 'Erro ao enviar código de verificação';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      Alert.alert('Erro', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>Verificação de Cadastro</Text>
          <Text style={styles.subtitle}>
            Enviaremos o código de verificação para seu email
          </Text>

          <View style={styles.methodsContainer}>
            {/* Opção Email - Única opção */}
            <TouchableOpacity
              style={[
                styles.methodButton,
                selectedMethod === 'email' && styles.methodButtonSelected,
                isLoading && styles.methodButtonDisabled
              ]}
              onPress={() => handleMethodSelect('email')}
              disabled={isLoading}
            >
              <View style={styles.methodIcon}>
                <Text style={styles.methodIconText}>📧</Text>
              </View>
              <View style={styles.methodContent}>
                <Text style={styles.methodTitle}>Receber por Email</Text>
                <Text style={styles.methodDescription}>
                  Enviaremos o código para {maskEmail(userEmail)}
                </Text>
              </View>
              {selectedMethod === 'email' && isLoading && (
                <ActivityIndicator size="small" color="#2B2860" />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              💡 O código de verificação expira em 10 minutos
            </Text>
            <Text style={styles.infoText}>
              🔒 Você pode solicitar até 5 códigos em 5 minutos
            </Text>
          </View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            disabled={isLoading}
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
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 22,
  },
  methodsContainer: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 30,
  },
  methodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  methodButtonSelected: {
    borderColor: '#2B2860',
    backgroundColor: '#f8f9fa',
  },
  methodButtonDisabled: {
    opacity: 0.6,
  },
  methodIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodIconText: {
    fontSize: 24,
  },
  methodContent: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2B2860',
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  infoContainer: {
    backgroundColor: '#e8f4fd',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
    width: '100%',
    maxWidth: 400,
  },
  infoText: {
    fontSize: 14,
    color: '#2B2860',
    marginBottom: 8,
    textAlign: 'center',
  },
  backButton: {
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
