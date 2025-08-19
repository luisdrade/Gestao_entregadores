import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AlterarSenhaScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    senhaAtual: false,
    novaSenha: false,
    confirmarSenha: false,
  });
  
  const [formData, setFormData] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: '',
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpar erro do campo quando o usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.senhaAtual.trim()) {
      newErrors.senhaAtual = 'Senha atual é obrigatória';
    }

    if (!formData.novaSenha.trim()) {
      newErrors.novaSenha = 'Nova senha é obrigatória';
    } else if (formData.novaSenha.length < 6) {
      newErrors.novaSenha = 'Nova senha deve ter pelo menos 6 caracteres';
    }

    if (!formData.confirmarSenha.trim()) {
      newErrors.confirmarSenha = 'Confirmação de senha é obrigatória';
    } else if (formData.novaSenha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = 'As senhas não coincidem';
    }

    if (formData.senhaAtual === formData.novaSenha) {
      newErrors.novaSenha = 'A nova senha deve ser diferente da atual';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAlterarSenha = async () => {
    if (!validateForm()) {
      Alert.alert('Erro de Validação', 'Por favor, corrija os erros nos campos destacados.');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implementar chamada para API para alterar a senha
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert('Sucesso', 'Senha alterada com sucesso!', [
        {
          text: 'OK',
          onPress: () => {
            // Limpar formulário
            setFormData({
              senhaAtual: '',
              novaSenha: '',
              confirmarSenha: '',
            });
            setErrors({});
            router.back();
          }
        }
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Erro inesperado ao alterar senha. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Alterar Senha</Text>
          <View style={styles.placeholder} />
        </View>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Altere sua senha</Text>
        <Text style={styles.subtitle}>Digite sua senha atual e a nova senha desejada</Text>

        <View style={styles.form}>
          {/* Senha Atual */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Senha Atual *</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.passwordInput, errors.senhaAtual && styles.inputError]}
                placeholder="Digite sua senha atual"
                value={formData.senhaAtual}
                onChangeText={(value) => handleInputChange('senhaAtual', value)}
                placeholderTextColor="#666"
                secureTextEntry={!showPasswords.senhaAtual}
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => togglePasswordVisibility('senhaAtual')}
              >
                <Ionicons 
                  name={showPasswords.senhaAtual ? "eye-off" : "eye"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>
            {errors.senhaAtual && <Text style={styles.errorText}>{errors.senhaAtual}</Text>}
          </View>

          {/* Nova Senha */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nova Senha *</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.passwordInput, errors.novaSenha && styles.inputError]}
                placeholder="Digite a nova senha"
                value={formData.novaSenha}
                onChangeText={(value) => handleInputChange('novaSenha', value)}
                placeholderTextColor="#666"
                secureTextEntry={!showPasswords.novaSenha}
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => togglePasswordVisibility('novaSenha')}
              >
                <Ionicons 
                  name={showPasswords.novaSenha ? "eye-off" : "eye"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>
            {errors.novaSenha && <Text style={styles.errorText}>{errors.novaSenha}</Text>}
            <Text style={styles.helpText}>Mínimo de 6 caracteres</Text>
          </View>

          {/* Confirmar Nova Senha */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmar Nova Senha *</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.passwordInput, errors.confirmarSenha && styles.inputError]}
                placeholder="Confirme a nova senha"
                value={formData.confirmarSenha}
                onChangeText={(value) => handleInputChange('confirmarSenha', value)}
                placeholderTextColor="#666"
                secureTextEntry={!showPasswords.confirmarSenha}
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => togglePasswordVisibility('confirmarSenha')}
              >
                <Ionicons 
                  name={showPasswords.confirmarSenha ? "eye-off" : "eye"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>
            {errors.confirmarSenha && <Text style={styles.errorText}>{errors.confirmarSenha}</Text>}
          </View>

          {/* Dicas de Segurança */}
          <View style={styles.securityTips}>
            <Text style={styles.securityTitle}>Dicas para uma senha segura:</Text>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color="#34C759" />
              <Text style={styles.tipText}>Use pelo menos 6 caracteres</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color="#34C759" />
              <Text style={styles.tipText}>Combine letras, números e símbolos</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color="#34C759" />
              <Text style={styles.tipText}>Evite informações pessoais</Text>
            </View>
          </View>

          {/* Botão de alterar senha */}
          <TouchableOpacity 
            style={[styles.changeButton, isLoading && styles.buttonDisabled]} 
            onPress={handleAlterarSenha}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.changeButtonText}>Alterar Senha</Text>
            )}
          </TouchableOpacity>
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
  header: {
    backgroundColor: '#007AFF',
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 36,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
  },
  eyeButton: {
    padding: 15,
  },
  inputError: {
    borderColor: '#FF6B6B',
    borderWidth: 2,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 5,
  },
  helpText: {
    color: '#666',
    fontSize: 12,
    marginTop: 5,
    fontStyle: 'italic',
  },
  securityTips: {
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 10,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  tipText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  changeButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  changeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
});
