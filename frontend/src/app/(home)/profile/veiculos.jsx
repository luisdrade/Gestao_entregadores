import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { httpClient } from '../../../services/clientConfig';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { _CampoEntrada, _Botao, _ListaVazia, _ModalConfirmacao } from '../../../components';

// Schema de validação
const validationSchema = Yup.object().shape({
  tipo: Yup.string()
    .required('Tipo do veículo é obrigatório'),
  modelo: Yup.string()
    .trim()
    .min(2, 'Modelo deve ter pelo menos 2 caracteres')
    .max(50, 'Modelo deve ter no máximo 50 caracteres')
    .required('Modelo é obrigatório'),
  categoria: Yup.string()
    .required('Categoria é obrigatória'),
  placa: Yup.string()
    .trim()
    .max(10, 'Placa deve ter no máximo 10 caracteres'),
  kmPorL: Yup.number()
    .min(0.1, 'KM/L deve ser maior que 0')
    .max(50, 'KM/L deve ser menor que 50')
    .required('KM/L é obrigatório'),
});

export default function VeiculosScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingVeiculos, setLoadingVeiculos] = useState(true);
  const [user, setUser] = useState(null);
  const [veiculos, setVeiculos] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVeiculo, setEditingVeiculo] = useState(null);
  const [showKmHelp, setShowKmHelp] = useState(false);
  const [showTipoModal, setShowTipoModal] = useState(false);
  const [showCategoriaModal, setShowCategoriaModal] = useState(false);
  const [activeForm, setActiveForm] = useState(null); // 'add' ou 'edit'
  const [tempFormValues, setTempFormValues] = useState({});

  useEffect(() => {
    loadUserData();
    loadVeiculos();
  }, []);

  const loadUserData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('@GestaoEntregadores:user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  };

  const loadVeiculos = async () => {
    try {
      setLoadingVeiculos(true);
      const response = await httpClient.get('/api/veiculos/');
      
      if (response.data) {
        setVeiculos(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar veículos:', error);
      Alert.alert('Erro', 'Erro ao carregar veículos');
    } finally {
      setLoadingVeiculos(false);
    }
  };

  const handleAddVeiculo = async (values, { setSubmitting, resetForm, setFieldError }) => {
    if (!user) {
      Alert.alert('Erro', 'Usuário não encontrado');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Cadastrando veículo:', values);
      
      const response = await httpClient.post('/api/veiculos/', {
        tipo: values.tipo,
        modelo: values.modelo,
        categoria: values.categoria,
        placa: values.placa,
        km_por_l: parseFloat(values.kmPorL)
      });
      
      console.log('Resposta da API:', response.data);
      
      if (response.data.success) {
        Alert.alert('Sucesso', 'Veículo cadastrado com sucesso!', [
          {
            text: 'OK',
            onPress: () => {
              resetForm();
              closeAddModal();
              loadVeiculos(); // Recarregar lista
            }
          }
        ]);
      } else {
        throw new Error(response.data.message || 'Erro ao cadastrar veículo');
      }
    } catch (error) {
      console.error('Erro ao cadastrar veículo:', error);
      console.error('Detalhes do erro:', error.response?.data);
      
      if (error.response?.data?.message) {
        Alert.alert('Erro', error.response.data.message);
      } else if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach(field => {
          if (field === 'km_por_l') {
            setFieldError('kmPorL', errors[field][0]);
          } else {
            setFieldError(field, errors[field][0]);
          }
        });
      } else {
        Alert.alert('Erro', 'Erro inesperado ao cadastrar veículo. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  const handleEditVeiculo = async (values, { setSubmitting, setFieldError }) => {
    if (!editingVeiculo) return;

    setIsLoading(true);
    try {
      const response = await httpClient.patch(`/api/veiculos/${editingVeiculo.id}/`, {
        tipo: values.tipo,
        modelo: values.modelo,
        categoria: values.categoria,
        placa: values.placa,
        km_por_l: parseFloat(values.kmPorL)
      });
      
      if (response.data.success) {
        Alert.alert('Sucesso', 'Veículo atualizado com sucesso!', [
          {
            text: 'OK',
            onPress: () => {
              closeEditModal();
              loadVeiculos(); // Recarregar lista
            }
          }
        ]);
      } else {
        throw new Error(response.data.message || 'Erro ao atualizar veículo');
      }
    } catch (error) {
      console.error('Erro ao atualizar veículo:', error);
      Alert.alert('Erro', 'Erro ao atualizar veículo');
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [veiculoToDelete, setVeiculoToDelete] = useState(null);

  const handleDeleteVeiculo = (veiculo) => {
    setVeiculoToDelete(veiculo);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!veiculoToDelete) return;
    
    try {
      const response = await httpClient.delete(`/api/veiculos/${veiculoToDelete.id}/`);
      if (response.data.success) {
        Alert.alert('Sucesso', 'Veículo excluído com sucesso!');
        loadVeiculos(); // Recarregar lista
      }
    } catch (error) {
      console.error('Erro ao excluir veículo:', error);
      Alert.alert('Erro', 'Erro ao excluir veículo');
    } finally {
      setShowDeleteModal(false);
      setVeiculoToDelete(null);
    }
  };

  const openEditModal = (veiculo) => {
    setEditingVeiculo(veiculo);
    setActiveForm('edit');
    setTempFormValues({
      tipo: veiculo.tipo,
      modelo: veiculo.modelo,
      categoria: veiculo.categoria,
      placa: veiculo.placa,
      kmPorL: veiculo.km_por_l?.toString() || '',
    });
  };

  const closeEditModal = () => {
    setEditingVeiculo(null);
    setActiveForm(null);
    setTempFormValues({});
  };

  const openAddModal = () => {
    setShowAddModal(true);
    setActiveForm('add');
    setTempFormValues({
      tipo: 'carro',
      modelo: '',
      categoria: 'passeio',
      placa: '',
      kmPorL: '',
    });
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setActiveForm(null);
    setTempFormValues({});
  };

  const handleSelectTipo = (value) => {
    setTempFormValues(prev => ({ ...prev, tipo: value }));
    setShowTipoModal(false);
  };

  const handleSelectCategoria = (value) => {
    setTempFormValues(prev => ({ ...prev, categoria: value }));
    setShowCategoriaModal(false);
  };

  const handleBack = () => {
    router.back();
  };

  const toggleKmHelp = () => {
    setShowKmHelp(!showKmHelp);
  };

  const SelectOption = ({ label, value, onSelect, isSelected }) => (
    <TouchableOpacity
      style={[styles.selectOption, isSelected && styles.selectOptionSelected]}
      onPress={() => onSelect(value)}
    >
      <Text style={[styles.selectOptionText, isSelected && styles.selectOptionTextSelected]}>
        {label}
      </Text>
      {isSelected && (
        <Ionicons name="checkmark" size={20} color="#007AFF" />
      )}
    </TouchableOpacity>
  );

  const renderVeiculo = ({ item }) => (
    <TouchableOpacity 
      style={styles.veiculoCard}
      onPress={() => openEditModal(item)}
      activeOpacity={0.7}
    >
      <View style={styles.veiculoHeader}>
        <View style={styles.veiculoInfo}>
          <View style={styles.veiculoTipo}>
            <Ionicons 
              name={item.tipo === 'carro' ? 'car' : 'bicycle'} 
              size={24} 
              color="#007AFF" 
            />
            <Text style={styles.veiculoTipoText}>
              {item.tipo === 'carro' ? 'Carro' : 'Moto'}
            </Text>
          </View>
          <Text style={styles.veiculoModelo}>{item.modelo}</Text>
          <Text style={styles.veiculoCategoria}>
            {item.categoria === 'passeio' ? 'Passeio' : 'Utilitário'}
          </Text>
        </View>
        <View style={styles.veiculoActions}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => openEditModal(item)}
            activeOpacity={0.7}
          >
            <Ionicons name="create-outline" size={20} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => handleDeleteVeiculo(item)}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.veiculoDetails}>
        {item.placa && (
          <View style={styles.veiculoDetail}>
            <Text style={styles.detailLabel}>Placa</Text>
            <Text style={styles.detailValue}>{item.placa}</Text>
          </View>
        )}
        <View style={styles.veiculoDetail}>
          <Text style={styles.detailLabel}>Consumo</Text>
          <Text style={styles.detailValue}>{item.km_por_l} km/l</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

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
      {/* Header com gradiente */}
      <View style={styles.header}>
        <View style={styles.headerGradient}>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={handleBack}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Meus Veículos</Text>
              <Text style={styles.headerSubtitle}>Gerencie sua frota</Text>
            </View>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={openAddModal}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {loadingVeiculos ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Carregando veículos...</Text>
          </View>
        ) : veiculos.length === 0 ? (
          <_ListaVazia
            icon={<Ionicons name="car-outline" size={64} color="#ccc" />}
            title="Nenhum veículo cadastrado"
            message="Cadastre seu primeiro veículo para começar a gerenciar sua frota"
            actionText="Cadastrar Veículo"
            onActionPress={openAddModal}
            showAction={true}
          />
        ) : (
          <FlatList
            data={veiculos}
            renderItem={renderVeiculo}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.veiculosList}
          />
        )}
      </View>

      {/* Modal Adicionar Veículo */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        onRequestClose={closeAddModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* Header do Modal */}
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderContent}>
              <TouchableOpacity 
                style={styles.modalCloseButton} 
                onPress={closeAddModal}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
              <View style={styles.modalTitleContainer}>
                <Text style={styles.modalTitle}>Adicionar Veículo</Text>
                <Text style={styles.modalSubtitle}>Cadastre um novo veículo</Text>
              </View>
              <View style={styles.placeholder} />
            </View>
          </View>
          
          <KeyboardAvoidingView 
            style={styles.keyboardView}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <ScrollView 
              style={styles.modalContent} 
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Card principal do formulário */}
              <View style={styles.formCard}>
                <View style={styles.formCardHeader}>
                  <View style={styles.formIconContainer}>
                    <Ionicons name="car" size={28} color="#007AFF" />
                  </View>
                  <View style={styles.formTitleContainer}>
                    <Text style={styles.formTitle}>Informações do Veículo</Text>
                    <Text style={styles.formSubtitle}>Preencha os dados do seu veículo</Text>
                  </View>
                </View>

                <Formik
                  initialValues={{
                    tipo: 'carro',
                    modelo: '',
                    categoria: 'passeio',
                    placa: '',
                    kmPorL: '',
                  }}
                  validationSchema={validationSchema}
                  onSubmit={handleAddVeiculo}
                  enableReinitialize
                >
                  {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, setFieldError }) => (
                    <View style={styles.form}>
                      {/* Seção: Tipo e Categoria */}
                      <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                          <Ionicons name="car-sport" size={20} color="#007AFF" />
                          <Text style={styles.sectionTitle}>Tipo e Categoria</Text>
                        </View>

                        {/* Tipo do Veículo */}
                        <View style={styles.inputContainer}>
                          <Text style={styles.label}>Tipo do Veículo *</Text>
                          <View style={styles.inputWrapper}>
                            <Ionicons name="car" size={20} color="#666" style={styles.inputIcon} />
                            <TouchableOpacity
                              style={[
                                styles.selectContainer,
                                touched.tipo && errors.tipo && styles.inputError
                              ]}
                              onPress={() => setShowTipoModal(true)}
                            >
                              <Text style={[
                                styles.selectText,
                                !tempFormValues.tipo && styles.selectPlaceholder
                              ]}>
                                {tempFormValues.tipo === 'carro' ? 'Carro' : tempFormValues.tipo === 'moto' ? 'Moto' : 'Selecione o tipo'}
                              </Text>
                              <Ionicons name="chevron-down" size={20} color="#666" />
                            </TouchableOpacity>
                          </View>
                          {touched.tipo && errors.tipo && (
                            <Text style={styles.errorText}>{errors.tipo}</Text>
                          )}
                        </View>

                        {/* Categoria */}
                        <View style={styles.inputContainer}>
                          <Text style={styles.label}>Categoria *</Text>
                          <View style={styles.inputWrapper}>
                            <Ionicons name="list" size={20} color="#666" style={styles.inputIcon} />
                            <TouchableOpacity
                              style={[
                                styles.selectContainer,
                                touched.categoria && errors.categoria && styles.inputError
                              ]}
                              onPress={() => setShowCategoriaModal(true)}
                            >
                              <Text style={[
                                styles.selectText,
                                !tempFormValues.categoria && styles.selectPlaceholder
                              ]}>
                                {tempFormValues.categoria === 'passeio' ? 'Passeio' : tempFormValues.categoria === 'utilitario' ? 'Utilitário' : 'Selecione a categoria'}
                              </Text>
                              <Ionicons name="chevron-down" size={20} color="#666" />
                            </TouchableOpacity>
                          </View>
                          {touched.categoria && errors.categoria && (
                            <Text style={styles.errorText}>{errors.categoria}</Text>
                          )}
                        </View>
                      </View>

                      {/* Seção: Dados do Veículo */}
                      <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                          <Ionicons name="document-text" size={20} color="#007AFF" />
                          <Text style={styles.sectionTitle}>Dados do Veículo</Text>
                        </View>

                        {/* Modelo */}
                        <_CampoEntrada
                          label="Modelo *"
                          value={tempFormValues.modelo}
                          onChangeText={(text) => {
                            setTempFormValues(prev => ({ ...prev, modelo: text }));
                            setFieldValue('modelo', text);
                          }}
                          onBlur={handleBlur('modelo')}
                          placeholder="Digite o modelo do veículo"
                          error={touched.modelo && !!errors.modelo}
                          errorMessage={touched.modelo && errors.modelo}
                          leftIcon={<Ionicons name="car-outline" size={20} color="#666" />}
                          autoCapitalize="words"
                        />

                        {/* Placa */}
                        <View style={styles.inputContainer}>
                          <Text style={styles.label}>Placa</Text>
                          <View style={styles.inputWrapper}>
                            <Ionicons name="card" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                              style={[
                                styles.textInput,
                                touched.placa && errors.placa && styles.inputError
                              ]}
                              placeholder="Digite a placa do veículo"
                              value={tempFormValues.placa}
                              onChangeText={(text) => {
                                setTempFormValues(prev => ({ ...prev, placa: text }));
                                setFieldValue('placa', text);
                              }}
                              onBlur={handleBlur('placa')}
                              placeholderTextColor="#999"
                              autoCapitalize="characters"
                              maxLength={10}
                            />
                          </View>
                          {touched.placa && errors.placa && (
                            <Text style={styles.errorText}>{errors.placa}</Text>
                          )}
                        </View>
                      </View>

                      {/* Seção: Consumo */}
                      <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                          <Ionicons name="speedometer" size={20} color="#007AFF" />
                          <Text style={styles.sectionTitle}>Consumo de Combustível</Text>
                        </View>

                        {/* KM/L */}
                        <View style={styles.inputContainer}>
                          <Text style={styles.label}>KM/L *</Text>
                          <View style={styles.kmContainer}>
                            <View style={styles.inputWrapper}>
                              <Ionicons name="speedometer-outline" size={20} color="#666" style={styles.inputIcon} />
                              <TextInput
                                style={[
                                  styles.kmInput,
                                  touched.kmPorL && errors.kmPorL && styles.inputError
                                ]}
                                placeholder="0.0"
                                value={tempFormValues.kmPorL}
                                onChangeText={(text) => {
                                  setTempFormValues(prev => ({ ...prev, kmPorL: text }));
                                  setFieldValue('kmPorL', text);
                                }}
                                onBlur={handleBlur('kmPorL')}
                                placeholderTextColor="#999"
                                keyboardType="numeric"
                                maxLength={5}
                              />
                            </View>
                            <TouchableOpacity 
                              style={styles.kmHelpButton}
                              onPress={toggleKmHelp}
                              activeOpacity={0.8}
                            >
                              <Ionicons name="help-circle" size={16} color="#fff" />
                              <Text style={styles.kmHelpText}>Ajuda</Text>
                            </TouchableOpacity>
                          </View>
                          {touched.kmPorL && errors.kmPorL && (
                            <Text style={styles.errorText}>{errors.kmPorL}</Text>
                          )}
                          
                          {/* Dicas de KM/L */}
                          {showKmHelp && (
                            <View style={styles.kmTips}>
                              <Text style={styles.kmTipsTitle}>Dicas de consumo médio:</Text>
                              <View style={styles.kmTipItem}>
                                <Ionicons name="car" size={16} color="#34C759" />
                                <Text style={styles.kmTipText}>Carros pequenos: 10-15 km/l</Text>
                              </View>
                              <View style={styles.kmTipItem}>
                                <Ionicons name="car" size={16} color="#34C759" />
                                <Text style={styles.kmTipText}>Carros médios: 8-12 km/l</Text>
                              </View>
                              <View style={styles.kmTipItem}>
                                <Ionicons name="bicycle" size={16} color="#34C759" />
                                <Text style={styles.kmTipText}>Motos: 25-40 km/l</Text>
                              </View>
                              <View style={styles.kmTipItem}>
                                <Ionicons name="information-circle" size={16} color="#007AFF" />
                                <Text style={styles.kmTipText}>Consulte o manual do veículo</Text>
                              </View>
                            </View>
                          )}
                        </View>
                      </View>

                      {/* Botão de cadastrar */}
                      <View style={styles.saveButtonContainer}>
                        <_Botao
                          title={Object.keys(errors).length > 0 ? 'Corrija os erros' : 'Cadastrar veículo'}
                          onPress={() => {
                            // Sincronizar valores temporários com Formik antes de submeter
                            setFieldValue('tipo', tempFormValues.tipo);
                            setFieldValue('categoria', tempFormValues.categoria);
                            setFieldValue('modelo', tempFormValues.modelo);
                            setFieldValue('placa', tempFormValues.placa);
                            setFieldValue('kmPorL', tempFormValues.kmPorL);
                            handleSubmit();
                          }}
                          loading={isLoading}
                          disabled={isLoading || Object.keys(errors).length > 0}
                          variant={Object.keys(errors).length > 0 ? 'error' : 'primary'}
                          icon={!isLoading && <Ionicons 
                            name={Object.keys(errors).length > 0 ? "warning" : "checkmark-circle"} 
                            size={20} 
                            color="#fff" 
                          />}
                          style={styles.cadastrarButton}
                        />
                      </View>
                    </View>
                  )}
                </Formik>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      {/* Modal Editar Veículo */}
      <Modal
        visible={!!editingVeiculo}
        animationType="slide"
        onRequestClose={closeEditModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeEditModal}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Editar Veículo</Text>
            <View style={styles.placeholder} />
          </View>
          
          <KeyboardAvoidingView 
            style={styles.keyboardView}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <ScrollView 
              style={styles.modalContent} 
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.formContainer}>
                <Formik
                  initialValues={{
                    tipo: editingVeiculo?.tipo || 'carro',
                    modelo: editingVeiculo?.modelo || '',
                    categoria: editingVeiculo?.categoria || 'passeio',
                    placa: editingVeiculo?.placa || '',
                    kmPorL: editingVeiculo?.km_por_l?.toString() || '',
                  }}
                  validationSchema={validationSchema}
                  onSubmit={handleEditVeiculo}
                  enableReinitialize
                >
                  {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, setFieldError }) => (
                    <View style={styles.form}>
                      {/* Tipo do Veículo */}
                      <View style={styles.inputContainer}>
                        <Text style={styles.label}>Tipo do Veículo *</Text>
                        <TouchableOpacity
                          style={[
                            styles.selectContainer,
                            touched.tipo && errors.tipo && styles.inputError
                          ]}
                          onPress={() => setShowTipoModal(true)}
                        >
                          <Text style={[
                            styles.selectText,
                            !tempFormValues.tipo && styles.selectPlaceholder
                          ]}>
                            {tempFormValues.tipo === 'carro' ? 'Carro' : tempFormValues.tipo === 'moto' ? 'Moto' : 'Selecione o tipo'}
                          </Text>
                          <Ionicons name="chevron-down" size={20} color="#666" />
                        </TouchableOpacity>
                        {touched.tipo && errors.tipo && (
                          <Text style={styles.errorText}>{errors.tipo}</Text>
                        )}
                      </View>

                      {/* Categoria */}
                      <View style={styles.inputContainer}>
                        <Text style={styles.label}>Categoria *</Text>
                        <TouchableOpacity
                          style={[
                            styles.selectContainer,
                            touched.categoria && errors.categoria && styles.inputError
                          ]}
                          onPress={() => setShowCategoriaModal(true)}
                        >
                          <Text style={[
                            styles.selectText,
                            !tempFormValues.categoria && styles.selectPlaceholder
                          ]}>
                            {tempFormValues.categoria === 'passeio' ? 'Passeio' : tempFormValues.categoria === 'utilitario' ? 'Utilitário' : 'Selecione a categoria'}
                          </Text>
                          <Ionicons name="chevron-down" size={20} color="#666" />
                        </TouchableOpacity>
                        {touched.categoria && errors.categoria && (
                          <Text style={styles.errorText}>{errors.categoria}</Text>
                        )}
                      </View>

                      {/* Modelo */}
                      <View style={styles.inputContainer}>
                        <Text style={styles.label}>Modelo *</Text>
                        <TextInput
                          style={[
                            styles.textInput,
                            touched.modelo && errors.modelo && styles.inputError
                          ]}
                          placeholder="Digite o modelo do veículo"
                          value={tempFormValues.modelo}
                          onChangeText={(text) => {
                            setTempFormValues(prev => ({ ...prev, modelo: text }));
                            setFieldValue('modelo', text);
                          }}
                          onBlur={handleBlur('modelo')}
                          placeholderTextColor="#666"
                          autoCapitalize="words"
                        />
                        {touched.modelo && errors.modelo && (
                          <Text style={styles.errorText}>{errors.modelo}</Text>
                        )}
                      </View>

                      {/* Placa */}
                      <View style={styles.inputContainer}>
                        <Text style={styles.label}>Placa</Text>
                        <TextInput
                          style={[
                            styles.textInput,
                            touched.placa && errors.placa && styles.inputError
                          ]}
                          placeholder="Digite a placa do veículo"
                          value={tempFormValues.placa}
                          onChangeText={(text) => {
                            setTempFormValues(prev => ({ ...prev, placa: text }));
                            setFieldValue('placa', text);
                          }}
                          onBlur={handleBlur('placa')}
                          placeholderTextColor="#666"
                          autoCapitalize="characters"
                          maxLength={10}
                        />
                        {touched.placa && errors.placa && (
                          <Text style={styles.errorText}>{errors.placa}</Text>
                        )}
                      </View>

                      {/* KM/L */}
                      <View style={styles.inputContainer}>
                        <Text style={styles.label}>KM/L *</Text>
                        <TextInput
                          style={[
                            styles.textInput,
                            touched.kmPorL && errors.kmPorL && styles.inputError
                          ]}
                          placeholder="0.0"
                          value={tempFormValues.kmPorL}
                          onChangeText={(text) => {
                            setTempFormValues(prev => ({ ...prev, kmPorL: text }));
                            setFieldValue('kmPorL', text);
                          }}
                          onBlur={handleBlur('kmPorL')}
                          placeholderTextColor="#666"
                          keyboardType="numeric"
                          maxLength={5}
                        />
                        {touched.kmPorL && errors.kmPorL && (
                          <Text style={styles.errorText}>{errors.kmPorL}</Text>
                        )}
                      </View>

                      {/* Botão de atualizar */}
                      <TouchableOpacity 
                        style={[
                          styles.cadastrarButton, 
                          (isLoading || Object.keys(errors).length > 0) && styles.buttonDisabled
                        ]} 
                        onPress={() => {
                          // Sincronizar valores temporários com Formik antes de submeter
                          setFieldValue('tipo', tempFormValues.tipo);
                          setFieldValue('categoria', tempFormValues.categoria);
                          setFieldValue('modelo', tempFormValues.modelo);
                          setFieldValue('placa', tempFormValues.placa);
                          setFieldValue('kmPorL', tempFormValues.kmPorL);
                          handleSubmit();
                        }}
                        disabled={isLoading || Object.keys(errors).length > 0}
                      >
                        {isLoading ? (
                          <ActivityIndicator color="#fff" />
                        ) : (
                          <Text style={styles.cadastrarButtonText}>
                            {Object.keys(errors).length > 0 ? 'Corrija os erros' : 'Atualizar veículo'}
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  )}
                </Formik>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      {/* Modal Tipo */}
      <Modal
        visible={showTipoModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTipoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione o tipo</Text>
              <TouchableOpacity onPress={() => setShowTipoModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <SelectOption
              label="Carro"
              value="carro"
              onSelect={handleSelectTipo}
              isSelected={tempFormValues.tipo === 'carro'}
            />
            <SelectOption
              label="Moto"
              value="moto"
              onSelect={handleSelectTipo}
              isSelected={tempFormValues.tipo === 'moto'}
            />
          </View>
        </View>
      </Modal>

      {/* Modal Categoria */}
      <Modal
        visible={showCategoriaModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCategoriaModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione a categoria</Text>
              <TouchableOpacity onPress={() => setShowCategoriaModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <SelectOption
              label="Passeio"
              value="passeio"
              onSelect={handleSelectCategoria}
              isSelected={tempFormValues.categoria === 'passeio'}
            />
            <SelectOption
              label="Utilitário"
              value="utilitario"
              onSelect={handleSelectCategoria}
              isSelected={tempFormValues.categoria === 'utilitario'}
            />
          </View>
        </View>
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <_ModalConfirmacao
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmar exclusão"
        message={`Tem certeza que deseja excluir o veículo ${veiculoToDelete?.modelo}?`}
        type="warning"
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerGradient: {
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  addButton: {
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    width: 50,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  formCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  formIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  formTitleContainer: {
    flex: 1,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  form: {
    gap: 16,
  },
  section: {
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginLeft: 8,
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  selectContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    height: 50,
  },
  selectText: {
    fontSize: 16,
    color: '#1a1a1a',
    flex: 1,
  },
  selectPlaceholder: {
    color: '#999',
  },
  selectOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectOptionSelected: {
    backgroundColor: '#f0f8ff',
    borderBottomColor: '#007AFF',
  },
  selectOptionText: {
    fontSize: 16,
    color: '#666',
  },
  selectOptionTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    paddingVertical: 12,
  },
  kmContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  kmInput: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    paddingVertical: 12,
  },
  kmHelpButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  kmHelpText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  kmTips: {
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
  },
  kmTipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 10,
  },
  kmTipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  kmTipText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  inputError: {
    borderColor: '#FF6B6B',
    borderWidth: 2,
    backgroundColor: '#fff5f5',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  saveButtonContainer: {
    marginTop: 16,
    paddingHorizontal: 0,
    paddingVertical: 12,
  },
  cadastrarButton: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cadastrarButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonWithErrors: {
    backgroundColor: '#FF6B6B',
    shadowColor: '#FF6B6B',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '80%',
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalScrollContent: {
    paddingBottom: 20,
  },
  modalHeader: {
    backgroundColor: '#fff',
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalCloseButton: {
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  veiculosList: {
    paddingBottom: 20,
  },
  veiculoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  veiculoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  veiculoInfo: {
    flex: 1,
  },
  veiculoTipo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  veiculoTipoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginLeft: 8,
  },
  veiculoModelo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  veiculoCategoria: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  veiculoActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 12,
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    padding: 12,
    backgroundColor: '#fff5f5',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  veiculoDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  veiculoDetail: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f0f2f5',
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 16,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  addFirstButton: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addFirstButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addFirstButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
