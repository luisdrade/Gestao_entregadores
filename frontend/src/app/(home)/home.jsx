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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import TopNavBar from '../../components/_NavBar_Superior';
import KPICard from '../../components/_KPICard';
import { httpClient } from '../../services/clientConfig';
import { API_ENDPOINTS } from '../../config/api';
import { _Header, _EstadoCarregamento, _Botao } from '../../components';


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

  useEffect(() => {
    loadDashboardData();
  }, [periodo]);

  // Verificar autenticação e redirecionar se necessário
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const token = await AsyncStorage.getItem('@GestaoEntregadores:token');
        if (!token) {
          console.log('⚠️ Debug - Nenhum token encontrado, redirecionando para login');
          router.replace('/');
        }
      } catch (error) {
        console.error('Erro ao verificar token:', error);
        router.replace('/');
      }
    };

    checkAuthAndRedirect();
  }, [router]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Debug: verificar se o usuário está logado
      console.log('🔍 Debug - Usuário logado:', user);
      console.log('🔍 Debug - Token disponível:', !!user?.token);
      
      // Verificar se há token no AsyncStorage
      const token = await AsyncStorage.getItem('@GestaoEntregadores:token');
      console.log('🔍 Debug - Token no AsyncStorage:', !!token);
      
      if (!token) {
        console.log('⚠️ Debug - Nenhum token encontrado, não carregando dados');
        return;
      }

      // Garantir que o token esteja definido no httpClient
      if (!httpClient.defaults.headers.Authorization) {
        httpClient.defaults.headers.Authorization = `Bearer ${token}`;
        console.log('🔍 Debug - Token definido no httpClient:', httpClient.defaults.headers.Authorization);
      }

      // Debug: verificar headers da API
      console.log('🔍 Debug - Headers da API:', httpClient.defaults.headers);
      console.log('🔍 Debug - URL da requisição:', `${httpClient.defaults.baseURL}${API_ENDPOINTS.REPORTS.DASHBOARD}?periodo=${periodo}`);

      const response = await httpClient.get(`${API_ENDPOINTS.REPORTS.DASHBOARD}?periodo=${periodo}`);

      if (response.data.success) {
        setDashboardData(response.data.data);
      } else {
        Alert.alert('Erro', 'Falha ao carregar dados do dashboard');
      }
    } catch (error) {
      console.error('❌ Erro ao carregar dados do dashboard:', error);
      console.error('❌ Status do erro:', error.response?.status);
      console.error('❌ Dados do erro:', error.response?.data);

      if (error.response?.status === 401) {
        Alert.alert('Erro de Autenticação', 'Sessão expirada. Faça login novamente.');
        // Redirecionar para login
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

  const formatCurrency = (value) => {
    return `R$ ${parseFloat(value).toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <_Header
          title="Gestão de Entregadores"
          showBackButton={false}
          showWelcome={true}
          welcomeText={`Bem-vindo, ${user?.nome || 'Entregador'}!`}
        />
        <_EstadoCarregamento
          loading={true}
          loadingText="Carregando dashboard..."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <_Header
          title="Gestão de Entregadores"
          showBackButton={false}
          showWelcome={true}
          welcomeText={`Bem-vindo, ${user?.nome || 'Entregador'}!`}
        />

        {/* NavBar */}
        <TopNavBar />
        
        <View>
          {/* Botão de Período */}
          <View style={styles.periodButtonContainer}>
            <_Botao
              title={`Período: ${periodo === 'mes' ? 'Mês' : 'Semana'}`}
              onPress={togglePeriodo}
              variant="outline"
              size="small"
              icon={<Text style={styles.periodButtonIcon}>▼</Text>}
              style={styles.periodButton}
            />
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
        </View>
        
        {/* Indicadores de Performance */}
        <View style={styles.performanceContainer}>
          <Text style={styles.sectionTitle}>
            Indicadores de Performance ({periodo === 'mes' ? 'Mês' : 'Semana'})
          </Text>
          <View style={styles.performanceGrid}>
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
  
  // Seções
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  
  // Botão de período
  periodButtonContainer: {
    paddingHorizontal: 20,
    marginTop: 10,

    alignItems: 'flex-start',
  },
  periodButton: {
    minWidth: 140,
  },
  periodButtonIcon: {
    fontSize: 12,
    color: '#666',
  },
  
  // Resumo diário (formato original)
  statsContainer: {
    marginTop: 20,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2B2860',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  
  // Indicadores de performance
  performanceContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  performanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
});

