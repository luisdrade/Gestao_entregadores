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
  Platform,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { registroTrabalho } from '../../../services/clientConfig';
import HeaderWithBack from '../../../components/_Header.jsx';
import TopNavBar from '../../../components/_NavBar_Superior';
import DatePicker from '../../../components/_DataComp';
import TimePicker from '../../../components/_HoraComp';

export default function TrabalhadoScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [selectedPaymentType, setSelectedPaymentType] = useState('');
  const [valorPacote, setValorPacote] = useState('');
  const [formData, setFormData] = useState({
    data: '',
    horaInicio: '',
    horaFim: '',
    quantidadeEntregues: '',
    quantidadeNaoEntregues: '',
    tipoPagamento: '',
    valor: '',
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






  const selectPaymentType = (type) => {
    setSelectedPaymentType(type);
    handleInputChange('tipoPagamento', type);
    // Limpar valores quando mudar o tipo de pagamento
    handleInputChange('valor', '');
    setValorPacote('');
  };

  const handleValorPacoteChange = (value) => {
    setValorPacote(value);
    // Calcular valor total automaticamente
    if (formData.quantidadeEntregues && value) {
      const quantidade = parseInt(formData.quantidadeEntregues) || 0;
      const valorUnitario = parseFloat(value) || 0;
      const valorTotal = (quantidade * valorUnitario).toFixed(2);
      handleInputChange('valor', valorTotal);
    }
  };

  const handleQuantidadeEntreguesChange = (value) => {
    handleInputChange('quantidadeEntregues', value);
    // Recalcular valor total se for por pacote
    if (selectedPaymentType === 'Por Pacote' && valorPacote) {
      const quantidade = parseInt(value) || 0;
      const valorUnitario = parseFloat(valorPacote) || 0;
      const valorTotal = (quantidade * valorUnitario).toFixed(2);
      handleInputChange('valor', valorTotal);
    }
  };



  const validateForm = () => {
    const newErrors = {};

    // Validações de campos obrigatórios (componentes garantem formato)
    if (!formData.data.trim()) {
      newErrors.data = 'Data é obrigatória';
    }

    if (!formData.horaInicio.trim()) {
      newErrors.horaInicio = 'Hora de início é obrigatória';
    }

    if (!formData.horaFim.trim()) {
      newErrors.horaFim = 'Hora de fim é obrigatória';
    }

    if (!formData.quantidadeEntregues.trim()) {
      newErrors.quantidadeEntregues = 'Quantidade de entregas é obrigatória';
    } else if (isNaN(formData.quantidadeEntregues) || parseInt(formData.quantidadeEntregues) < 0) {
      newErrors.quantidadeEntregues = 'Quantidade deve ser um número positivo';
    }

    if (!formData.quantidadeNaoEntregues.trim()) {
      newErrors.quantidadeNaoEntregues = 'Quantidade de não entregas é obrigatória';
    } else if (isNaN(formData.quantidadeNaoEntregues) || parseInt(formData.quantidadeNaoEntregues) < 0) {
      newErrors.quantidadeNaoEntregues = 'Quantidade deve ser um número positivo';
    }

    if (!formData.tipoPagamento.trim()) {
      newErrors.tipoPagamento = 'Tipo de pagamento é obrigatório';
    }

    if (!formData.valor.trim()) {
      newErrors.valor = 'Valor é obrigatório';
    } else if (isNaN(formData.valor) || parseFloat(formData.valor) <= 0) {
      newErrors.valor = 'Valor deve ser um número positivo';
    }

    // Validação de lógica de negócio: hora fim deve ser maior que hora início
    if (formData.horaInicio && formData.horaFim) {
      const inicio = new Date(`2000-01-01 ${formData.horaInicio}`);
      const fim = new Date(`2000-01-01 ${formData.horaFim}`);
      if (fim <= inicio) {
        newErrors.horaFim = 'Hora de fim deve ser maior que hora de início';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegistrar = async () => {
    if (!validateForm()) {
      Alert.alert('Erro de Validação', 'Por favor, corrija os erros nos campos destacados.');
      return;
    }

    setIsLoading(true);
    try {
      // Preparar dados para a API
      const apiData = {
        data: formData.data,
        hora_inicio: formData.horaInicio,
        hora_fim: formData.horaFim,
        quantidade_entregues: parseInt(formData.quantidadeEntregues),
        quantidade_nao_entregues: parseInt(formData.quantidadeNaoEntregues),
        tipo_pagamento: formData.tipoPagamento,
        valor: parseFloat(formData.valor),
      };

      const result = await registroTrabalho(apiData);

      if (result.success) {
        Alert.alert('Sucesso', result.message, [
          {
            text: 'OK',
            onPress: () => {
              // Limpar formulário
              setFormData({
                data: '',
                horaInicio: '',
                horaFim: '',
                quantidadeEntregues: '',
                quantidadeNaoEntregues: '',
                tipoPagamento: '',
                valor: '',
              });
              setErrors({});
            }
          }
        ]);
      } else {
        Alert.alert('Erro', result.error || 'Erro ao registrar trabalho');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro inesperado ao registrar trabalho. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const formatCurrency = (value) => {
    // Remove tudo que não é número
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue === '') return '';

    // Converte para centavos e formata
    const floatValue = parseFloat(numericValue) / 100;
    return floatValue.toFixed(2);
  };

  const handleCurrencyChange = (value) => {
    const formatted = formatCurrency(value);
    handleInputChange('valor', formatted);
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBack 
      title="Registro de Trabalho"
      style={{ fontSize: 10 }} />

      <TopNavBar />

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Registre seu dia de trabalho</Text>

        <View style={styles.form}>
          {/* Data */}
          <DatePicker
            value={formData.data}
            onDateChange={(date) => handleInputChange('data', date)}
            label="Data"
            error={!!errors.data}
            errorMessage={errors.data}
          />

          {/* Horários */}
          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <TimePicker
                value={formData.horaInicio}
                onTimeChange={(time) => handleInputChange('horaInicio', time)}
                label="Hora início"
                error={!!errors.horaInicio}
                errorMessage={errors.horaInicio}
              />
            </View>

            <View style={styles.halfWidth}>
              <TimePicker
                value={formData.horaFim}
                onTimeChange={(time) => handleInputChange('horaFim', time)}
                label="Hora Fim"
                error={!!errors.horaFim}
                errorMessage={errors.horaFim}
              />
            </View>
          </View>

          {/* Quantidades */}
          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>Entregas realizadas</Text>
              <TextInput
                style={[styles.input, errors.quantidadeEntregues && styles.inputError]}
                placeholder="0"
                value={formData.quantidadeEntregues}
                onChangeText={handleQuantidadeEntreguesChange}
                keyboardType="numeric"
                placeholderTextColor="#666"
              />
              {errors.quantidadeEntregues && <Text style={styles.errorText}>{errors.quantidadeEntregues}</Text>}
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>Entregas não realizadas</Text>
              <TextInput
                style={[styles.input, errors.quantidadeNaoEntregues && styles.inputError]}
                placeholder="0"
                value={formData.quantidadeNaoEntregues}
                onChangeText={(value) => handleInputChange('quantidadeNaoEntregues', value)}
                keyboardType="numeric"
                placeholderTextColor="#666"
              />
              {errors.quantidadeNaoEntregues && <Text style={styles.errorText}>{errors.quantidadeNaoEntregues}</Text>}
            </View>
          </View>

          {/* Tipo de Pagamento */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tipo do Pagamento</Text>

            <View style={styles.paymentTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.paymentTypeButton,
                  selectedPaymentType === 'Diária' && styles.paymentTypeButtonSelected,
                  errors.tipoPagamento && styles.inputError
                ]}
                onPress={() => selectPaymentType('Diária')}
              >
                <Ionicons
                  name="calendar"
                  size={20}
                  color={selectedPaymentType === 'Diária' ? '#fff' : '#007AFF'}
                />
                <Text style={[
                  styles.paymentTypeText,
                  selectedPaymentType === 'Diária' && styles.paymentTypeTextSelected
                ]}>
                  Diária
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.paymentTypeButton,
                  selectedPaymentType === 'Por Pacote' && styles.paymentTypeButtonSelected,
                  errors.tipoPagamento && styles.inputError
                ]}
                onPress={() => selectPaymentType('Por Pacote')}
              >
                <Ionicons
                  name="cube"
                  size={20}
                  color={selectedPaymentType === 'Por Pacote' ? '#fff' : '#007AFF'}
                />
                <Text style={[
                  styles.paymentTypeText,
                  selectedPaymentType === 'Por Pacote' && styles.paymentTypeTextSelected
                ]}>
                  Por Pacote
                </Text>
              </TouchableOpacity>
            </View>

            {errors.tipoPagamento && <Text style={styles.errorText}>{errors.tipoPagamento}</Text>}
          </View>


          {/* Campo de Valor Dinâmico */}
          {selectedPaymentType === 'Diária' && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Valor do dia</Text>
              <View style={[styles.inputWithIcon, errors.valor && styles.inputError]}>
                <TextInput
                  style={styles.input}
                  placeholder="0,00"
                  value={formData.valor}
                  onChangeText={handleCurrencyChange}
                  keyboardType="numeric"
                  placeholderTextColor="#666"
                />
                <Text style={styles.currencySymbol}>R$</Text>
              </View>
              {errors.valor && <Text style={styles.errorText}>{errors.valor}</Text>}
            </View>
          )}

          {selectedPaymentType === 'Por Pacote' && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Valor do pacote</Text>
              <View style={[styles.inputWithIcon, errors.valor && styles.inputError]}>
                <TextInput
                  style={styles.input}
                  placeholder="0,00"
                  value={valorPacote}
                  onChangeText={handleValorPacoteChange}
                  keyboardType="numeric"
                  placeholderTextColor="#666"
                />
                <Text style={styles.currencySymbol}>R$</Text>
              </View>
              {errors.valor && <Text style={styles.errorText}>{errors.valor}</Text>}

              {/* Campo de valor total calculado (somente leitura) */}
              <View style={styles.totalValueContainer}>
                <Text style={styles.totalValueLabel}>Valor total calculado:</Text>
                <Text style={styles.totalValueText}>R$ {formData.valor || '0,00'}</Text>
              </View>
            </View>
          )}

          {/* Botão de registro */}
          <TouchableOpacity
            style={[styles.registerButton, isLoading && styles.buttonDisabled]}
            onPress={handleRegistrar}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>Registrar Trabalho</Text>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },

  content: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 100, // Espaço para a barra inferior
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
    fontSize: 12,
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
    flex: 1,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingRight: 15,
  },
  inputIcon: {
    marginRight: 15,
  },

  currencySymbol: {
    fontSize: 16,
    color: '#666',
    marginRight: 15,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    gap: 15,
  },
  halfWidth: {
    flex: 1,
  },
  registerButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
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

  paymentTypeContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  paymentTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    gap: 8,
  },
  paymentTypeButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  paymentTypeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  paymentTypeTextSelected: {
    color: '#fff',
  },
  totalValueContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  totalValueLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 5,
  },
  totalValueText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});
