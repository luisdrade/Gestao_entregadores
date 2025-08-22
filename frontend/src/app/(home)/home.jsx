import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import TopNavBar from '../../components/_NavBar_Superior';
import { api } from '../../services/api';
import { API_ENDPOINTS } from '../../config/api';

export default function HomeScreen() {
  const { user, signOut } = useAuth();
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
  const [periodoInfo, setPeriodoInfo] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, [periodo]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      const response = await api.get(`${API_ENDPOINTS.REPORTS.DASHBOARD}?periodo=${periodo}`);
      
      if (response.data.success) {
        setDashboardData(response.data.data);
        setPeriodoInfo(`${response.data.data.data_inicio} - ${response.data.data.data_fim}`);
      } else {
        Alert.alert('Erro', 'Falha ao carregar dados do dashboard');
      }
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      Alert.alert('Erro', 'Erro de conexão com o servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    signOut();
    router.replace('/');
  };

  const togglePeriodo = () => {
    setPeriodo(periodo === 'mes' ? 'semana' : 'mes');
  };

  const formatCurrency = (value) => {
    return `R$ ${parseFloat(value).toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Carregando dashboard...</Text>
        </View>
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
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Sair</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.welcomeText}>
            Bem-vindo, {user?.nome || 'Entregador'}!
          </Text>
        </View>

        {/* NavBar */}
        <TopNavBar />

        {/* Seletor de Período */}
        <View style={styles.periodSelector}>
          <Text style={styles.periodTitle}>Período de Análise</Text>
          <TouchableOpacity style={styles.periodToggle} onPress={togglePeriodo}>
            <Text style={styles.periodToggleText}>
              {periodo === 'mes' ? 'Mês' : 'Semana'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.periodInfo}>{periodoInfo}</Text>
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
              <Text style={styles.statNumber}>{formatCurrency(dashboardData.resumo_diario.lucro_hoje)}</Text>
              <Text style={styles.statLabel}>Lucro Hoje</Text>
            </View>
          </View>
        </View>

        {/* Indicadores de Performance */}
        <View style={styles.kpiContainer}>
          <Text style={styles.kpiTitle}>Indicadores de Performance ({periodo === 'mes' ? 'Mês' : 'Semana'})</Text>
          <View style={styles.kpiGrid}>
            {/* Dias Trabalhados */}
            <View style={[styles.kpiCard, styles.greenCard]}>
              <Text style={styles.kpiCardTitle}>Dias Trabalhados</Text>
              <Text style={styles.kpiCardData}>{dashboardData.indicadores_performance.dias_trabalhados} dias</Text>
            </View>

            {/* Entregas Realizadas */}
            <View style={[styles.kpiCard, styles.blueCard]}>
              <Text style={styles.kpiCardTitle}>Entregas Realizadas</Text>
              <Text style={styles.kpiCardData}>{dashboardData.indicadores_performance.entregas_realizadas} entregas</Text>
            </View>

            {/* Entregas Não Realizadas */}
            <View style={[styles.kpiCard, styles.redCard]}>
              <Text style={styles.kpiCardTitle}>Entregas não realizadas</Text>
              <Text style={styles.kpiCardData}>{dashboardData.indicadores_performance.entregas_nao_realizadas} entregas</Text>
            </View>

            {/* Ganho Total */}
            <View style={[styles.kpiCard, styles.purpleCard]}>
              <Text style={styles.kpiCardTitle}>Ganho Total</Text>
              <Text style={styles.kpiCardData}>{formatCurrency(dashboardData.indicadores_performance.ganho_total)}</Text>
            </View>

            {/* Despesas Total */}
            <View style={[styles.kpiCard, styles.orangeCard]}>
              <Text style={styles.kpiCardTitle}>Despesas Total</Text>
              <Text style={styles.kpiCardData}>{formatCurrency(dashboardData.indicadores_performance.despesas_total)}</Text>
            </View>

            {/* Lucro Líquido */}
            <View style={[styles.kpiCard, styles.tealCard]}>
              <Text style={styles.kpiCardTitle}>Lucro Líquido</Text>
              <Text style={styles.kpiCardData}>{formatCurrency(dashboardData.indicadores_performance.lucro_liquido)}</Text>
            </View>
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
    paddingBottom: 100, // Espaço para a barra inferior
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  welcomeText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  periodSelector: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  periodTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  periodToggle: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  periodToggleText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  periodInfo: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  statsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
  kpiCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  greenCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  blueCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  redCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  purpleCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#9C27B0',
  },
  orangeCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  tealCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#009688',
  },
  kpiCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  kpiCardData: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});

