import React, { useState, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../../services/api';
import DatePicker from '../../../components/_DataComp';

export default function EditarPerfilScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    dataNascimento: '',
    endereco: '',
    cep: '',
    cidade: '',
    estado: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('@GestaoEntregadores:user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        
        // Preencher formulário com dados existentes
        setFormData({
          nome: userData.nome || '',
          email: userData.email || '',
          telefone: userData.telefone || '',
          cpf: userData.cpf || '',
          dataNascimento: userData.dataNascimento || '',
          endereco: userData.endereco || '',
          cep: userData.cep || '',
          cidade: userData.cidade || '',
          estado: userData.estado || ''
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      Alert.alert('Erro', 'Erro ao carregar dados do usuário');
    }
  };

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

  // Função específica para mudança de data
  const handleDateChange = (date) => {
    handleInputChange('dataNascimento', date);
  };

  // Validar data de nascimento
  const validateDate = (dateString) => {
    if (!dateString) return false;
    
    // Verificar formato DD/MM/AAAA
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!dateRegex.test(dateString)) return false;
    
    const [, day, month, year] = dateString.match(dateRegex);
    const dayNum = parseInt(day);
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    
    // Verificar se é uma data válida
    const date = new Date(yearNum, monthNum - 1, dayNum);
    if (date.getDate() !== dayNum || date.getMonth() !== monthNum - 1 || date.getFullYear() !== yearNum) {
      return false;
    }
    
    // Verificar se não é uma data futura
    const today = new Date();
    if (date > today) return false;
    
    // Verificar se não é muito antiga (mais de 120 anos)
    const minYear = today.getFullYear() - 120;
    if (yearNum < minYear) return false;
    
    return true;
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
    } else if (!validateDate(formData.dataNascimento)) {
      newErrors.dataNascimento = 'Data de nascimento inválida';
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
      // Preparar dados para envio (converter data de DD/MM/AAAA para YYYY-MM-DD)
      const dataToSend = { ...formData };
      
      if (dataToSend.dataNascimento) {
        const [day, month, year] = dataToSend.dataNascimento.split('/');
        dataToSend.data_nascimento = `${year}-${month}-${day}`;
        delete dataToSend.dataNascimento; // Remover campo antigo
      }

      console.log('Dados a serem enviados:', dataToSend);

      // Salvar no backend
      const response = await api.put(`/api/entregadores/${user.id}/`, dataToSend);
      
      console.log('Resposta do backend:', response.data);
      
      if (response.data.success) {
        // Atualizar dados locais com a resposta do backend
        const updatedUserData = {
          ...user,
          ...response.data.user
        };
        
        // Atualizar AsyncStorage
        await AsyncStorage.setItem('@GestaoEntregadores:user', JSON.stringify(updatedUserData));
        
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso!', [
          {
            text: 'OK',
            onPress: () => {
              router.back();
            }
          }
        ]);
      } else {
        throw new Error(response.data.message || 'Erro ao atualizar perfil');
      }
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      console.error('Detalhes do erro:', error.response?.data);
      Alert.alert('Erro', `Erro ao atualizar perfil: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

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

          {/* Data de Nascimento - Usando o componente DatePicker */}
          <DatePicker
            value={formData.dataNascimento}
            onDateChange={handleDateChange}
            placeholder="DD/MM/AAAA"
            label="Data de Nascimento *"
            error={!!errors.dataNascimento}
            errorMessage={errors.dataNascimento}
            style={styles.datePickerContainer}
          />

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
  datePickerContainer: {
    marginTop: 10,
  },
});
