import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import TopNavBar from '../../components/_NavBar_Superior';
import KPICard from '../../components/_KPICard';
import LoadingError from '../../components/_CarregamentoError';
import { api } from '../../services/clientConfig';
import { API_ENDPOINTS } from '../../config/api';

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [dashboardData, setDashboardData] = useState({
    resumo_diario: {
      entregas_hoje: 0,
      nao_entregas_hoje: 0,
      ganhos_hoje: 0,
      despesas_hoje: 0,
      lucro_hoje: 0
    },
    indicadores_performance: {
      dias_trabalhados: 0,
      entregas_realizadas: 0,
      entregas_nao_realizadas: 0,
      ganho_total: 0,
      despesas_total: 0,
      lucro_liquido: 0
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [periodo, setPeriodo] = useState('mes'); // 'semana' ou 'mes'
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!hasError) {
      loadDashboardData();
    }
  }, [periodo]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setHasError(false);

      // Debug: verificar se o usuário está logado
      console.log('🔍 Debug - Usuário logado:', user);
      console.log('🔍 Debug - Token disponível:', !!user?.token);

      // Debug: verificar headers da API
      console.log('🔍 Debug - Headers da API:', api.defaults.headers);

      const response = await api.get(`${API_ENDPOINTS.REPORTS.DASHBOARD}?periodo=${periodo}`);

      if (response.data.success) {
        setDashboardData(response.data.data);
      } else {
        Alert.alert('Erro', 'Falha ao carregar dados do dashboard');
        setHasError(true);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar dados do dashboard:', error);
      console.error('❌ Status do erro:', error.response?.status);
      console.error('❌ Dados do erro:', error.response?.data);

      setHasError(true);

      if (error.response?.status === 401) {
        Alert.alert('Erro de Autenticação', 'Sessão expirada. Faça login novamente.');
        router.replace('/');
      } else {
        Alert.alert('Erro', 'Erro de conexão com o servidor');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePeriodo = () => {
    setPeriodo(periodo === 'mes' ? 'semana' : 'mes');
  };

  const retryLoadData = () => {
    setHasError(false);
    loadDashboardData();
  };

  if (isLoading || hasError) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingError
          isLoading={isLoading}
          hasError={hasError}
          onRetry={retryLoadData}
          loadingText="Carregando dashboard..."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Gestão de Entregadores</Text>
          </View>
          <Text style={styles.welcomeText}>
            Bem-vindo, {user?.nome || 'Entregador'}!
          </Text>
        </View>

        {/* NavBar */}
        <TopNavBar />
        
        <View>
          {/* Botão de Período */}
          <View style={styles.periodoButtonContainer}>
            <TouchableOpacity style={styles.periodoButton} onPress={togglePeriodo}>
              <Text style={styles.periodoButtonText}>
                {periodo === 'mes' ? 'Mês' : 'Semana'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Resumo Diário */}
          <View style={styles.statsContainer}>
            <Text style={styles.statsTitle}>Resumo Diário (Hoje)</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{dashboardData.resumo_diario.entregas_hoje}</Text>
                <Text style={styles.statLabel}>Entregas Hoje</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{dashboardData.resumo_diario.nao_entregas_hoje}</Text>
                <Text style={styles.statLabel}>Não Entregas</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>R$ {parseFloat(dashboardData.resumo_diario.lucro_hoje).toFixed(2)}</Text>
                <Text style={styles.statLabel}>Lucro Hoje</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Indicadores de Performance */}
        <View style={styles.kpiContainer}>
            <Text style={styles.kpiTitle}>Indicadores de Performance ({periodo === 'mes' ? 'Mês' : 'Semana'})</Text>
            <View style={styles.kpiGrid}>
              <KPICard
                title="Dias Trabalhados"
                data={`${dashboardData.indicadores_performance.dias_trabalhados} dias`}
                color="green"
              />
              <KPICard
                title="Entregas Realizadas"
                data={`${dashboardData.indicadores_performance.entregas_realizadas} entregas`}
                color="blue"
              />
              <KPICard
                title="Entregas não realizadas"
                data={`${dashboardData.indicadores_performance.entregas_nao_realizadas} entregas`}
                color="red"
              />
              <KPICard
                title="Ganho Total"
                data={dashboardData.indicadores_performance.ganho_total}
                color="purple"
                isCurrency={true}
              />
              <KPICard
                title="Despesas Total"
                data={dashboardData.indicadores_performance.despesas_total}
                color="orange"
                isCurrency={true}
              />
              <KPICard
                title="Lucro Líquido"
                data={dashboardData.indicadores_performance.lucro_liquido}
                color="teal"
                isCurrency={true}
              />
            </View>
          </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
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
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  welcomeText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  statsContainer: {
    marginTop: 30,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  periodoButtonContainer: {
    position: 'absolute',
    left: 20,
  },
  periodoButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  periodoButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  kpiContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  kpiTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

