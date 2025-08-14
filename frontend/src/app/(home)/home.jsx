import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const [dashboardData, setDashboardData] = useState({
    diasTrabalhados: 0,
    entregasRealizadas: 0,
    entregasNaoRealizadas: 0,
    lucroLiquido: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      // Mock data for now - replace with actual API call
      setDashboardData({
        diasTrabalhados: 15,
        entregasRealizadas: 45,
        entregasNaoRealizadas: 3,
        lucroLiquido: 1250.50,
      });
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    signOut();
    router.replace('/');
  };

  const handleRegistrarTrabalhado = () => {
    router.push('/(home)/calculos/trabalhado');
  };

  const handleRegistrarDespesas = () => {
    router.push('/(home)/calculos/financeiro');
  };


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
      <View style={styles.navBar}>
        <TouchableOpacity style={[styles.navTab, styles.activeTab]}>
          <Text style={[styles.navTabText, styles.activeTabText]}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navTab} onPress={handleRegistrarTrabalhado}>
          <Text style={styles.navTabText}>Trabalhado</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navTab} onPress={handleRegistrarDespesas}>
          <Text style={styles.navTabText}>Financeiro</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navTab} onPress={() => router.push('/(home)/relatorios')}>
          <Text style={styles.navTabText}>Relatórios</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Resumo Rápido</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{dashboardData.entregasRealizadas}</Text>
            <Text style={styles.statLabel}>Entregas Hoje</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>R$ {dashboardData.lucroLiquido.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Ganhos Hoje</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Veículos</Text>
          </View>
        </View>
      </View>

      {/* KPI Cards */}
      <View style={styles.kpiContainer}>
        <Text style={styles.kpiTitle}>Indicadores de Performance</Text>
        <View style={styles.kpiGrid}>
          {/* Dias Trabalhados */}
          <View style={[styles.kpiCard, styles.greenCard]}>
            <Text style={styles.kpiCardTitle}>Dias Trabalhados</Text>
            <Text style={styles.kpiCardData}>{dashboardData.diasTrabalhados} dias</Text>
          </View>

          {/* Entregas Realizadas */}
          <View style={[styles.kpiCard, styles.blueCard]}>
            <Text style={styles.kpiCardTitle}>Entregas Realizadas</Text>
            <Text style={styles.kpiCardData}>{dashboardData.entregasRealizadas} entregas</Text>
          </View>

          {/* Entregas Não Realizadas */}
          <View style={[styles.kpiCard, styles.redCard]}>
            <Text style={styles.kpiCardTitle}>Entregas não realizadas</Text>
            <Text style={styles.kpiCardData}>{dashboardData.entregasNaoRealizadas} entregas</Text>
          </View>

          {/* Lucro */}
          <View style={[styles.kpiCard, styles.orangeCard]}>
            <Text style={styles.kpiCardTitle}>Lucro</Text>
            <Text style={styles.kpiCardData}>R$ {dashboardData.lucroLiquido.toFixed(2)}</Text>
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
  navBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  navTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  navTabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: 'bold',
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
  orangeCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
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
  content: {
    flex: 1,
    padding: 20,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  menuItem: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  menuDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  actionButtons: {
    marginBottom: 30,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

