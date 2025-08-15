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
import { registroTrabalho } from '../../../services/api';
import TopNavBar from '../../../components/_NavBar_Superior';

export default function TrabalhadoScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerMode, setTimePickerMode] = useState(''); // 'inicio' ou 'fim'
  const [selectedTime, setSelectedTime] = useState({ hora: 0, minuto: 0 });
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



  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const hideDatePickerModal = () => {
    setShowDatePicker(false);
  };

  const showTimePickerModal = (mode) => {
    setTimePickerMode(mode);
    // Se já existe um horário, vamos carregá-lo
    if (mode === 'inicio' && formData.horaInicio) {
      const [hora, minuto] = formData.horaInicio.split(':');
      setSelectedTime({ hora: parseInt(hora), minuto: parseInt(minuto) });
    } else if (mode === 'fim' && formData.horaFim) {
      const [hora, minuto] = formData.horaFim.split(':');
      setSelectedTime({ hora: parseInt(hora), minuto: parseInt(minuto) });
    } else {
      setSelectedTime({ hora: 0, minuto: 0 });
    }
    setShowTimePicker(true);
  };

  const hideTimePickerModal = () => {
    setShowTimePicker(false);
  };

  const confirmTime = () => {
    const hora = selectedTime.hora.toString().padStart(2, '0');
    const minuto = selectedTime.minuto.toString().padStart(2, '0');
    const timeString = `${hora}:${minuto}`;
    
    if (timePickerMode === 'inicio') {
      handleInputChange('horaInicio', timeString);
    } else if (timePickerMode === 'fim') {
      handleInputChange('horaFim', timeString);
    }
    
    hideTimePickerModal();
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

  const confirmDate = () => {
    // Formatar a data para DD/MM/AAAA
    const day = selectedDate.getDate().toString().padStart(2, '0');
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = selectedDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    handleInputChange('data', formattedDate);
    hideDatePickerModal();
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.data.trim()) {
      newErrors.data = 'Data é obrigatória';
    }

    if (!formData.horaInicio.trim()) {
      newErrors.horaInicio = 'Hora de início é obrigatória';
    } else if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formData.horaInicio)) {
      newErrors.horaInicio = 'Formato de hora inválido (HH:MM)';
    }

    if (!formData.horaFim.trim()) {
      newErrors.horaFim = 'Hora de fim é obrigatória';
    } else if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formData.horaFim)) {
      newErrors.horaFim = 'Formato de hora inválido (HH:MM)';
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

    // Validar se hora fim é maior que hora início
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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Registro de Trabalho</Text>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* NavBar */}
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
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Data *</Text>
            <TouchableOpacity 
              style={[styles.inputWithIcon, errors.data && styles.inputError]}
              onPress={showDatePickerModal}
            >
              <Text style={[styles.dateInput, !formData.data && styles.placeholderText]}>
                {formData.data || "DD/MM/AAAA"}
              </Text>
              <Ionicons name="calendar" size={20} color="#666" style={styles.inputIcon} />
            </TouchableOpacity>
            {errors.data && <Text style={styles.errorText}>{errors.data}</Text>}
          </View>

          {/* Modal de seleção de data */}
          <Modal
            visible={showDatePicker}
            animationType="slide"
            transparent={true}
            onRequestClose={hideDatePickerModal}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Selecione a data</Text>
                
                {/* Inputs para dia, mês e ano */}
                <View style={styles.dateInputsRow}>
                  <View style={styles.dateInputContainer}>
                    <Text style={styles.dateInputLabel}>Dia</Text>
                    <TextInput
                      style={styles.dateInputField}
                      placeholder="DD"
                      value={selectedDate.getDate().toString()}
                      onChangeText={(text) => {
                        const day = parseInt(text) || 1;
                        const newDate = new Date(selectedDate);
                        newDate.setDate(day);
                        setSelectedDate(newDate);
                      }}
                      keyboardType="numeric"
                      maxLength={2}
                    />
                  </View>
                  
                  <View style={styles.dateInputContainer}>
                    <Text style={styles.dateInputLabel}>Mês</Text>
                    <TextInput
                      style={styles.dateInputField}
                      placeholder="MM"
                      value={(selectedDate.getMonth() + 1).toString()}
                      onChangeText={(text) => {
                        const month = parseInt(text) || 1;
                        const newDate = new Date(selectedDate);
                        newDate.setMonth(month - 1);
                        setSelectedDate(newDate);
                      }}
                      keyboardType="numeric"
                      maxLength={2}
                    />
                  </View>
                  
                  <View style={styles.dateInputContainer}>
                    <Text style={styles.dateInputLabel}>Ano</Text>
                    <TextInput
                      style={styles.dateInputField}
                      placeholder="AAAA"
                      value={selectedDate.getFullYear().toString()}
                      onChangeText={(text) => {
                        const year = parseInt(text) || 2024;
                        const newDate = new Date(selectedDate);
                        newDate.setFullYear(year);
                        setSelectedDate(newDate);
                      }}
                      keyboardType="numeric"
                      maxLength={4}
                    />
                  </View>
                </View>
                
                <TouchableOpacity style={styles.confirmButton} onPress={confirmDate}>
                  <Text style={styles.confirmButtonText}>Confirmar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={hideDatePickerModal}>
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Modal de seleção de horário */}
          <Modal
            visible={showTimePicker}
            animationType="slide"
            transparent={true}
            onRequestClose={hideTimePickerModal}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  {timePickerMode === 'inicio' ? 'Hora de Início' : 'Hora de Fim'}
                </Text>
                
                {/* Inputs para hora e minuto */}
                <View style={styles.timeInputsRow}>
                  <View style={styles.timeInputContainer}>
                    <Text style={styles.timeInputLabel}>Hora</Text>
                    <TextInput
                      style={styles.timeInputField}
                      placeholder="00"
                      value={selectedTime.hora.toString()}
                      onChangeText={(text) => {
                        const hora = parseInt(text) || 0;
                        if (hora >= 0 && hora <= 23) {
                          setSelectedTime(prev => ({ ...prev, hora }));
                        }
                      }}
                      keyboardType="numeric"
                      maxLength={2}
                    />
                  </View>
                  
                  <Text style={styles.timeSeparator}>:</Text>
                  
                  <View style={styles.timeInputContainer}>
                    <Text style={styles.timeInputLabel}>Minuto</Text>
                    <TextInput
                      style={styles.timeInputField}
                      placeholder="00"
                      value={selectedTime.minuto.toString()}
                      onChangeText={(text) => {
                        const minuto = parseInt(text) || 0;
                        if (minuto >= 0 && minuto <= 59) {
                          setSelectedTime(prev => ({ ...prev, minuto }));
                        }
                      }}
                      keyboardType="numeric"
                      maxLength={2}
                    />
                  </View>
                </View>
                
                <TouchableOpacity style={styles.confirmButton} onPress={confirmTime}>
                  <Text style={styles.confirmButtonText}>Confirmar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={hideTimePickerModal}>
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Horários */}
          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>Hora início *</Text>
              <TouchableOpacity 
                style={[styles.inputWithIcon, errors.horaInicio && styles.inputError]}
                onPress={() => showTimePickerModal('inicio')}
              >
                <Text style={[styles.timeInput, !formData.horaInicio && styles.placeholderText]}>
                  {formData.horaInicio || "HH:MM"}
                </Text>
                <Ionicons name="time" size={20} color="#666" style={styles.inputIcon} />
              </TouchableOpacity>
              {errors.horaInicio && <Text style={styles.errorText}>{errors.horaInicio}</Text>}
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>Hora Fim *</Text>
              <TouchableOpacity 
                style={[styles.inputWithIcon, errors.horaFim && styles.inputError]}
                onPress={() => showTimePickerModal('fim')}
              >
                <Text style={[styles.timeInput, !formData.horaFim && styles.placeholderText]}>
                  {formData.horaFim || "HH:MM"}
                </Text>
                <Ionicons name="time" size={20} color="#666" style={styles.inputIcon} />
              </TouchableOpacity>
              {errors.horaFim && <Text style={styles.errorText}>{errors.horaFim}</Text>}
            </View>
          </View>

          {/* Quantidades */}
          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>Entregas realizadas *</Text>
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
              <Text style={styles.label}>Entregas não realizadas *</Text>
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
            <Text style={styles.label}>Tipo do Pagamento *</Text>
            
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
              <Text style={styles.label}>Valor do dia *</Text>
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
              <Text style={styles.label}>Valor do pacote *</Text>
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
  dateInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: '#000',
  },
  placeholderText: {
    color: '#666',
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  dateInputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  dateInputContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  dateInputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  dateInputField: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    textAlign: 'center',
    width: '100%',
  },
  timeInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: '#000',
  },
  timeInputsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  timeInputContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  timeInputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  timeInputField: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    textAlign: 'center',
    width: 80,
  },
  timeSeparator: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginHorizontal: 10,
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
