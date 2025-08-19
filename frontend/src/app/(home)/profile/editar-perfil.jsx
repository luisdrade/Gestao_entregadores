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
import TopNavBar from '../../../components/_NavBar_Superior';

export default function EditarPerfilScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: 'João Silva',
    email: 'joao@email.com',
    telefone: '(11) 99999-9999',
    cpf: '123.456.789-00',
    dataNascimento: '15/03/1990',
    endereco: 'Rua das Flores, 123 - São Paulo/SP',
    cep: '01234-567',
    cidade: 'São Paulo',
    estado: 'SP'
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.trim().length < 3) {
      newErrors.nome = 'Nome deve ter pelo menos 3 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    }

    if (!formData.dataNascimento.trim()) {
      newErrors.dataNascimento = 'Data de nascimento é obrigatória';
    }

    if (!formData.endereco.trim()) {
      newErrors.endereco = 'Endereço é obrigatório';
    }

    if (!formData.cep.trim()) {
      newErrors.cep = 'CEP é obrigatório';
    }

    if (!formData.cidade.trim()) {
      newErrors.cidade = 'Cidade é obrigatória';
    }

    if (!formData.estado.trim()) {
      newErrors.estado = 'Estado é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSalvar = async () => {
    if (!validateForm()) {
      Alert.alert('Erro de Validação', 'Por favor, corrija os erros nos campos destacados.');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implementar chamada para API para salvar o perfil
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!', [
        {
          text: 'OK',
          onPress: () => {
            router.back();
          }
        }
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Erro inesperado ao atualizar perfil. Tente novamente.');
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
          <Text style={styles.headerTitle}>Editar Perfil</Text>
          <View style={styles.placeholder} />
        </View>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Edite suas informações pessoais</Text>

        <View style={styles.form}>
          {/* Nome */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome completo *</Text>
            <TextInput
              style={[styles.input, errors.nome && styles.inputError]}
              placeholder="Digite seu nome completo"
              value={formData.nome}
              onChangeText={(value) => handleInputChange('nome', value)}
              placeholderTextColor="#666"
            />
            {errors.nome && <Text style={styles.errorText}>{errors.nome}</Text>}
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="Digite seu email"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          {/* Telefone */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Telefone *</Text>
            <TextInput
              style={[styles.input, errors.telefone && styles.inputError]}
              placeholder="(11) 99999-9999"
              value={formData.telefone}
              onChangeText={(value) => handleInputChange('telefone', value)}
              placeholderTextColor="#666"
              keyboardType="phone-pad"
            />
            {errors.telefone && <Text style={styles.errorText}>{errors.telefone}</Text>}
          </View>

          {/* CPF */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>CPF *</Text>
            <TextInput
              style={[styles.input, errors.cpf && styles.inputError]}
              placeholder="123.456.789-00"
              value={formData.cpf}
              onChangeText={(value) => handleInputChange('cpf', value)}
              placeholderTextColor="#666"
              keyboardType="numeric"
            />
            {errors.cpf && <Text style={styles.errorText}>{errors.cpf}</Text>}
          </View>

          {/* Data de Nascimento */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Data de Nascimento *</Text>
            <TextInput
              style={[styles.input, errors.dataNascimento && styles.inputError]}
              placeholder="DD/MM/AAAA"
              value={formData.dataNascimento}
              onChangeText={(value) => handleInputChange('dataNascimento', value)}
              placeholderTextColor="#666"
              keyboardType="numeric"
            />
            {errors.dataNascimento && <Text style={styles.errorText}>{errors.dataNascimento}</Text>}
          </View>

          {/* Endereço */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Endereço *</Text>
            <TextInput
              style={[styles.input, styles.textArea, errors.endereco && styles.inputError]}
              placeholder="Rua, número, bairro"
              value={formData.endereco}
              onChangeText={(value) => handleInputChange('endereco', value)}
              placeholderTextColor="#666"
              multiline
              numberOfLines={2}
            />
            {errors.endereco && <Text style={styles.errorText}>{errors.endereco}</Text>}
          </View>

          {/* CEP, Cidade e Estado em linha */}
          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>CEP *</Text>
              <TextInput
                style={[styles.input, errors.cep && styles.inputError]}
                placeholder="01234-567"
                value={formData.cep}
                onChangeText={(value) => handleInputChange('cep', value)}
                placeholderTextColor="#666"
                keyboardType="numeric"
              />
              {errors.cep && <Text style={styles.errorText}>{errors.cep}</Text>}
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>Cidade *</Text>
              <TextInput
                style={[styles.input, errors.cidade && styles.inputError]}
                placeholder="São Paulo"
                value={formData.cidade}
                onChangeText={(value) => handleInputChange('cidade', value)}
                placeholderTextColor="#666"
              />
              {errors.cidade && <Text style={styles.errorText}>{errors.cidade}</Text>}
            </View>
          </View>

          {/* Estado */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Estado *</Text>
            <TextInput
              style={[styles.input, errors.estado && styles.inputError]}
              placeholder="SP"
              value={formData.estado}
              onChangeText={(value) => handleInputChange('estado', value)}
              placeholderTextColor="#666"
              maxLength={2}
              autoCapitalize="characters"
            />
            {errors.estado && <Text style={styles.errorText}>{errors.estado}</Text>}
          </View>

          {/* Botão de salvar */}
          <TouchableOpacity 
            style={[styles.saveButton, isLoading && styles.buttonDisabled]} 
            onPress={handleSalvar}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Salvar Alterações</Text>
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
    width: 36, // Mesmo tamanho do botão voltar para centralizar o título
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
    marginBottom: 30,
    textAlign: 'center',
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
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    minHeight: 80,
    paddingTop: 15,
    textAlignVertical: 'top',
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
  row: {
    flexDirection: 'row',
    gap: 15,
  },
  halfWidth: {
    flex: 1,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
});
