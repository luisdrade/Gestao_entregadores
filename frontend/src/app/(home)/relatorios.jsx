import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import TopNavBar from '../../components/_NavBar_Superior';
import { httpClient as api, atualizarRegistroTrabalho, excluirRegistroTrabalho, atualizarDespesa, excluirDespesa } from '../../services/clientConfig';
import { API_ENDPOINTS } from '../../config/api';
import HeaderWithBack from '../../components/_Header';
import DatePicker from '../../components/_DataComp';

export default function RelatoriosScreen() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('trabalho'); // 'trabalho' ou 'despesas'
  const [periodo, setPeriodo] = useState('mes'); // 'semana', 'mes', 'ano'
  const [isLoading, setIsLoading] = useState(false);
  const [relatorioData, setRelatorioData] = useState({
    trabalho: {
      total_dias: 0,
      total_entregas: 0,
      entregas_realizadas: 0,
      entregas_nao_realizadas: 0,
      ganho_total: 0,
      media_entregas_dia: 0,
      melhor_dia: '',
      pior_dia: '',
      dias_trabalhados: []
    },
    despesas: {
      total_despesas: 0,
      media_despesas_dia: 0,
      maior_despesa: 0,
      categoria_mais_cara: '',
      despesas_por_categoria: [],
      despesas_por_dia: []
    }
  });

  // Estados para edição (modais)
  const [editTrabalhoVisible, setEditTrabalhoVisible] = useState(false);
  const [editDespesaVisible, setEditDespesaVisible] = useState(false);
  const [selectedTrabalhoId, setSelectedTrabalhoId] = useState(null);
  const [selectedDespesaId, setSelectedDespesaId] = useState(null);
  const [editTrabalhoForm, setEditTrabalhoForm] = useState({
    data: '',
    quantidade_entregues: '',
    quantidade_nao_entregues: '',
    valor: '',
  });
  const [editDespesaForm, setEditDespesaForm] = useState({
    data: '',
    valor: '',
    descricao: '',
  });

  const toBR = (yyyyMmDd) => {
    if (!yyyyMmDd) return '';
    const [y, m, d] = yyyyMmDd.split('-');
    return `${d}/${m}/${y}`;
  };

  const toISO = (ddMmYyyy) => {
    if (!ddMmYyyy) return '';
    const parts = ddMmYyyy.split('/');
    if (parts.length !== 3) return ddMmYyyy;
    const [d, m, y] = parts;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  };

  useEffect(() => {
    loadRelatorioData();
  }, [activeTab, periodo]);

  const loadRelatorioData = async () => {
    try {
      setIsLoading(true);
      
      const endpoint = activeTab === 'trabalho' 
        ? `${API_ENDPOINTS.REPORTS.TRABALHO}?periodo=${periodo}`
        : `${API_ENDPOINTS.REPORTS.DESPESAS}?periodo=${periodo}`;
      
      const response = await api.get(endpoint);
      
      if (response.data.success) {
        setRelatorioData(prev => ({
          ...prev,
          [activeTab]: response.data.data
        }));
      } else {
        Alert.alert('Erro', 'Falha ao carregar dados do relatório');
      }
    } catch (error) {
      console.error('❌ Erro ao carregar relatório:', error);
      Alert.alert('Erro', 'Erro de conexão com o servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return `R$ ${parseFloat(value).toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const handleEditTrabalho = async (item) => {
    try {
      // Buscar detalhes para preencher (inclui nao_entregues se disponível)
      const detail = await api.get(`/registro/api/registro-trabalho/${item.id}/`);
      const data = detail.data?.data || {};
      setSelectedTrabalhoId(item.id);
      setEditTrabalhoForm({
        data: toBR(data.data || item.data),
        quantidade_entregues: String(data.quantidade_entregues ?? item.entregas ?? ''),
        quantidade_nao_entregues: String(data.quantidade_nao_entregues ?? ''),
        valor: String(data.valor ?? item.ganho ?? ''),
      });
      setEditTrabalhoVisible(true);
    } catch (e) {
      // Fallback sem detail
      setSelectedTrabalhoId(item.id);
      setEditTrabalhoForm({
        data: toBR(item.data),
        quantidade_entregues: String(item.entregas ?? ''),
        quantidade_nao_entregues: '',
        valor: String(item.ganho ?? ''),
      });
      setEditTrabalhoVisible(true);
    }
  };

  const handleDeleteTrabalho = (item) => {
    Alert.alert(
      'Excluir Dia',
      `Deseja excluir o dia ${formatDate(item.data)}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: async () => {
          const res = await excluirRegistroTrabalho(item.id);
          if (res.success) { Alert.alert('Excluído'); loadRelatorioData(); } else { Alert.alert('Erro', res.message || 'Falha ao excluir'); }
        }}
      ]
    );
  };

  const renderTrabalhoReport = () => (
    <View style={styles.reportSection}>
      <View style={styles.summaryContainer}>
        <Text style={styles.sectionTitle}>Resumo Geral</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{relatorioData.trabalho.total_dias}</Text>
            <Text style={styles.summaryLabel}>Dias Trabalhados</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{relatorioData.trabalho.total_entregas}</Text>
            <Text style={styles.summaryLabel}>Total Entregas</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{relatorioData.trabalho.entregas_realizadas}</Text>
            <Text style={styles.summaryLabel}>Realizadas</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{relatorioData.trabalho.entregas_nao_realizadas}</Text>
            <Text style={styles.summaryLabel}>Não Realizadas</Text>
          </View>
        </View>
      </View>

      {/* Ganhos */}
      <View style={styles.earningsContainer}>
        <Text style={styles.sectionTitle}>Ganhos</Text>
        <View style={styles.earningsCard}>
          <Text style={styles.earningsAmount}>{formatCurrency(relatorioData.trabalho.ganho_total)}</Text>
          <Text style={styles.earningsLabel}>Ganho Total</Text>
        </View>
        <View style={styles.earningsCard}>
          <Text style={styles.earningsAmount}>{formatCurrency(relatorioData.trabalho.ganho_total / Math.max(relatorioData.trabalho.total_dias, 1))}</Text>
          <Text style={styles.earningsLabel}>Média por Dia</Text>
        </View>
      </View>

      {/* Estatísticas */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Estatísticas</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Média de Entregas/Dia:</Text>
          <Text style={styles.statValue}>{relatorioData.trabalho.media_entregas_dia.toFixed(1)}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Melhor Dia:</Text>
          <Text style={styles.statValue}>{relatorioData.trabalho.melhor_dia || 'N/A'}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Pior Dia:</Text>
          <Text style={styles.statValue}>{relatorioData.trabalho.pior_dia || 'N/A'}</Text>
        </View>
      </View>

      {/* Dias Trabalhados */}
      <View style={styles.diasContainer}>
        <Text style={styles.sectionTitle}>Dias Trabalhados</Text>
        {relatorioData.trabalho.dias_trabalhados.map((dia, index) => (
          <TouchableOpacity key={index} style={styles.dayCard} onPress={() => handleEditTrabalho(dia)} onLongPress={() => handleDeleteTrabalho(dia)} delayLongPress={300}>
            <Text style={styles.diaData}>{formatDate(dia.data)}</Text>
            <View style={styles.diaStats}>
              <Text style={styles.diaStat}>Entregas: {dia.entregas}</Text>
              <Text style={styles.diaStat}>Ganho: {formatCurrency(dia.ganho)}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const handleEditDespesa = async (item) => {
    try {
      const detail = await api.get(`/registro/api/registro-despesa/${item.id}/`);
      const data = detail.data?.data || {};
      setSelectedDespesaId(item.id);
      setEditDespesaForm({
        data: toBR(data.data || item.data),
        valor: String(data.valor ?? item.valor ?? ''),
        descricao: String(data.descricao ?? item.descricao ?? ''),
      });
      setEditDespesaVisible(true);
    } catch (e) {
      setSelectedDespesaId(item.id);
      setEditDespesaForm({
        data: toBR(item.data),
        valor: String(item.valor ?? ''),
        descricao: String(item.descricao ?? ''),
      });
      setEditDespesaVisible(true);
    }
  };

  const handleDeleteDespesa = (item) => {
    Alert.alert(
      'Excluir Despesa',
      `Deseja excluir a despesa de ${formatCurrency(item.valor)} em ${formatDate(item.data)}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: async () => {
          const res = await excluirDespesa(item.id);
          if (res.success) { Alert.alert('Excluída'); loadRelatorioData(); } else { Alert.alert('Erro', res.message || 'Falha ao excluir'); }
        }}
      ]
    );
  };

  const renderDespesasReport = () => (
    <View style={styles.reportSection}>
      {/* Resumo Geral */}
      <View style={styles.summaryContainer}>
        <Text style={styles.sectionTitle}>Resumo de Despesas</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{formatCurrency(relatorioData.despesas.total_despesas)}</Text>
            <Text style={styles.summaryLabel}>Total Despesas</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{formatCurrency(relatorioData.despesas.media_despesas_dia)}</Text>
            <Text style={styles.summaryLabel}>Média/Dia</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{formatCurrency(relatorioData.despesas.maior_despesa)}</Text>
            <Text style={styles.summaryLabel}>Maior Despesa</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{relatorioData.despesas.categoria_mais_cara || 'N/A'}</Text>
            <Text style={styles.summaryLabel}>Categoria Mais Cara</Text>
          </View>
        </View>
      </View>

      {/* Despesas por Categoria */}
      <View style={styles.categoryContainer}>
        <Text style={styles.sectionTitle}>Despesas por Categoria</Text>
        {relatorioData.despesas.despesas_por_categoria.map((categoria, index) => (
          <View key={index} style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryName}>{categoria.nome}</Text>
              <Text style={styles.categoryAmount}>{formatCurrency(categoria.total)}</Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${(categoria.total / Math.max(relatorioData.despesas.total_despesas, 1)) * 100}%`,
                    backgroundColor: getCategoryColor(categoria.nome)
                  }
                ]} 
              />
            </View>
            <Text style={styles.categoryPercentage}>
              {((categoria.total / Math.max(relatorioData.despesas.total_despesas, 1)) * 100).toFixed(1)}%
            </Text>
          </View>
        ))}
      </View>

      {/* Despesas por Dia */}
      <View style={styles.container_RelatorioDespesa}>
        <Text style={styles.sectionTitle}>Despesas por Dia</Text>
        {relatorioData.despesas.despesas_por_dia.map((despesa, index) => (
          <TouchableOpacity key={index} style={styles.dailyExpenseCard} onPress={() => handleEditDespesa(despesa)} onLongPress={() => handleDeleteDespesa(despesa)} delayLongPress={300}>
            <Text style={styles.dailyExpenseDate}>{formatDate(despesa.data)}</Text>
            <View style={styles.dailyExpenseDetails}>
              <Text style={styles.dailyExpenseCategory}>{despesa.categoria}</Text>
              <Text style={styles.dailyExpenseAmount}>{formatCurrency(despesa.valor)}</Text>
            </View>
            {despesa.descricao && (
              <Text style={styles.dailyExpenseDescription}>{despesa.descricao}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const getCategoryColor = (categoryName) => {
    const colors = {
      'Combustível': '#FF6B6B',
      'Manutenção': '#4ECDC4',
      'Alimentação': '#45B7D1',
      'Pedágio': '#96CEB4',
      'Outros': '#FFEAA7'
    };
    return colors[categoryName] || '#DDA0DD';
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBack title="Relatórios" />

      {/* NavBar */}
      <TopNavBar />

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'trabalho' && styles.activeTab]}
          onPress={() => setActiveTab('trabalho')}
        >
          <Text style={[styles.tabText, activeTab === 'trabalho' && styles.activeTabText]}>
            Relatório de Trabalho
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'despesas' && styles.activeTab]}
          onPress={() => setActiveTab('despesas')}
        >
          <Text style={[styles.tabText, activeTab === 'despesas' && styles.activeTabText]}>
            Relatório de Despesas
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filtro de Período */}
      <View style={styles.periodFilter}>
        <TouchableOpacity 
          style={[styles.periodButton, periodo === 'semana' && styles.activePeriodButton]}
          onPress={() => setPeriodo('semana')}
        >
          <Text style={[styles.periodButtonText, periodo === 'semana' && styles.activePeriodButtonText]}>
            Semana
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.periodButton, periodo === 'mes' && styles.activePeriodButton]}
          onPress={() => setPeriodo('mes')}
        >
          <Text style={[styles.periodButtonText, periodo === 'mes' && styles.activePeriodButtonText]}>
            Mês
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.periodButton, periodo === 'ano' && styles.activePeriodButton]}
          onPress={() => setPeriodo('ano')}
        >
          <Text style={[styles.periodButtonText, periodo === 'ano' && styles.activePeriodButtonText]}>
            Ano
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Carregando relatório...</Text>
          </View>
        ) : (
          activeTab === 'trabalho' ? renderTrabalhoReport() : renderDespesasReport()
        )}
      </ScrollView>

      {/* Modal Editar Trabalho */}
      <Modal visible={editTrabalhoVisible} transparent animationType="slide" onRequestClose={() => setEditTrabalhoVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Editar Dia Trabalhado</Text>
            <DatePicker
              label="Data"
              value={editTrabalhoForm.data}
              onDateChange={(v) => setEditTrabalhoForm(prev => ({ ...prev, data: v }))}
            />
            <View style={styles.rowInputs}>
              <View style={{ flex: 1, marginRight: 6 }}>
                <Text style={styles.inputLabel}>Entregas</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={editTrabalhoForm.quantidade_entregues}
                  onChangeText={(v) => setEditTrabalhoForm(prev => ({ ...prev, quantidade_entregues: v.replace(/\D/g,'') }))}
                  placeholder="0"
                />
              </View>
              <View style={{ flex: 1, marginLeft: 6 }}>
                <Text style={styles.inputLabel}>Não Entregues</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={editTrabalhoForm.quantidade_nao_entregues}
                  onChangeText={(v) => setEditTrabalhoForm(prev => ({ ...prev, quantidade_nao_entregues: v.replace(/\D/g,'') }))}
                  placeholder="0"
                />
              </View>
            </View>
            <Text style={styles.inputLabel}>Valor Recebido (R$)</Text>
            <TextInput
              style={styles.input}
              keyboardType="decimal-pad"
              value={String(editTrabalhoForm.valor)}
              onChangeText={(v) => setEditTrabalhoForm(prev => ({ ...prev, valor: v.replace(',', '.').replace(/[^0-9.]/g,'') }))}
              placeholder="0.00"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setEditTrabalhoVisible(false)}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={async () => {
                  const payload = {
                    data: toISO(editTrabalhoForm.data),
                    quantidade_entregues: parseInt(editTrabalhoForm.quantidade_entregues || '0'),
                    quantidade_nao_entregues: parseInt(editTrabalhoForm.quantidade_nao_entregues || '0'),
                    valor: parseFloat(editTrabalhoForm.valor || '0'),
                  };
                  const res = await atualizarRegistroTrabalho(selectedTrabalhoId, payload);
                  if (res.success) {
                    setEditTrabalhoVisible(false);
                    loadRelatorioData();
                  } else {
                    Alert.alert('Erro', res.message || 'Falha ao salvar');
                  }
                }}
              >
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={async () => {
                  const res = await excluirRegistroTrabalho(selectedTrabalhoId);
                  if (res.success) {
                    setEditTrabalhoVisible(false);
                    loadRelatorioData();
                  } else {
                    Alert.alert('Erro', res.message || 'Falha ao excluir');
                  }
                }}
              >
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Editar Despesa */}
      <Modal visible={editDespesaVisible} transparent animationType="slide" onRequestClose={() => setEditDespesaVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Editar Despesa</Text>
            <DatePicker
              label="Data"
              value={editDespesaForm.data}
              onDateChange={(v) => setEditDespesaForm(prev => ({ ...prev, data: v }))}
            />
            <Text style={styles.inputLabel}>Valor (R$)</Text>
            <TextInput
              style={styles.input}
              keyboardType="decimal-pad"
              value={String(editDespesaForm.valor)}
              onChangeText={(v) => setEditDespesaForm(prev => ({ ...prev, valor: v.replace(',', '.').replace(/[^0-9.]/g,'') }))}
              placeholder="0.00"
            />
            <Text style={styles.inputLabel}>Descrição</Text>
            <TextInput
              style={styles.input}
              value={editDespesaForm.descricao}
              onChangeText={(v) => setEditDespesaForm(prev => ({ ...prev, descricao: v }))}
              placeholder="Opcional"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setEditDespesaVisible(false)}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={async () => {
                  const payload = {
                    data: toISO(editDespesaForm.data),
                    valor: parseFloat(editDespesaForm.valor || '0'),
                    descricao: editDespesaForm.descricao || '',
                  };
                  const res = await atualizarDespesa(selectedDespesaId, payload);
                  if (res.success) {
                    setEditDespesaVisible(false);
                    loadRelatorioData();
                  } else {
                    Alert.alert('Erro', res.message || 'Falha ao salvar');
                  }
                }}
              >
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={async () => {
                  const res = await excluirDespesa(selectedDespesaId);
                  if (res.success) {
                    setEditDespesaVisible(false);
                    loadRelatorioData();
                  } else {
                    Alert.alert('Erro', res.message || 'Falha ao excluir');
                  }
                }}
              >
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  periodFilter: {
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginHorizontal: 20,
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activePeriodButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  periodButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666',
  },
  activePeriodButtonText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  reportSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  summaryContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryCard: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 15,
    marginBottom: 10,
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  earningsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  earningsCard: {
    alignItems: 'center',
    paddingVertical: 15,
    marginBottom: 10,
  },
  earningsAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  earningsLabel: {
    fontSize: 14,
    color: '#666',
  },
  statsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statLabel: {
    fontSize: 16,
    color: '#333',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  diasContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    paddingBottom:100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dayCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  diaData: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  diaStats: {
    alignItems: 'flex-end',
  },
  diaStat: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  categoryContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryCard: {
    marginBottom: 15,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  categoryPercentage: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  container_RelatorioDespesa: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    paddingBottom:100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dailyExpenseCard: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dailyExpenseDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  dailyExpenseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  dailyExpenseCategory: {
    fontSize: 16,
    color: '#666',
  },
  dailyExpenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  dailyExpenseDescription: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cancelButton: {
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    borderColor: '#FF3B30',
  },
  modalButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
});
