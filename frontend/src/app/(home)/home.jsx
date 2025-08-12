import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { getDashboardData } from '../../services/api';

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState('Total');

  const handleLogout = () => {
    signOut();
    router.replace('/');
  };

  const handleRegistrarTrabalhado = () => {
    router.push('/(home)/trabalhado');
  };

  const handleRegistrarDespesas = () => {
    router.push('/(home)/financeiro');
  };

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
      const result = await getDashboardData();
      if (result.success) {
        setDashboardData(result.data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Gerenciamento</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Navigation Bar */}
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

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          <TouchableOpacity style={styles.periodButton}>
            <Text style={styles.periodButtonText}>{selectedPeriod}</Text>
            <Ionicons name="chevron-down" size={16} color="#6c757d" />
          </TouchableOpacity>
        </View>

        {/* KPI Cards */}
        <View style={styles.kpiContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Carregando dados...</Text>
            </View>
          ) : (
            <>
              {/* Entregas Realizadas */}
              <View style={[styles.kpiCard, styles.greenCard]}>
                <Text style={styles.kpiTitle}>Entregas realizadas</Text>
                <Text style={styles.kpiData}>{dashboardData.diasTrabalhados} dias trabalhado</Text>
                <Text style={styles.kpiData}>{dashboardData.entregasRealizadas} entregas feitas</Text>
              </View>

              {/* Entregas Não Realizadas */}
              <View style={[styles.kpiCard, styles.redCard]}>
                <Text style={styles.kpiTitle}>Entregas não realizadas</Text>
                <Text style={styles.kpiData}>{dashboardData.diasTrabalhados} dias trabalhado</Text>
                <Text style={styles.kpiData}>{dashboardData.entregasNaoRealizadas} entregas não feitas</Text>
              </View>

              {/* Lucro */}
              <View style={[styles.kpiCard, styles.blueCard]}>
                <Text style={styles.kpiTitle}>Lucro</Text>
                <Text style={styles.kpiData}>{dashboardData.diasTrabalhados} dias trabalhado</Text>
                <Text style={styles.kpiData}>R$ {dashboardData.lucroLiquido} de Lucro líquido</Text>
              </View>
            </>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleRegistrarTrabalhado}
          >
            <Text style={styles.actionButtonText}>Registrar dia trabalhado</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleRegistrarDespesas}
          >
            <Text style={styles.actionButtonText}>Registrar despesas</Text>
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
  logoutButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  navTabText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  periodSelector: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  periodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  periodButtonText: {
    fontSize: 14,
    color: '#6c757d',
    marginRight: 5,
  },
  kpiContainer: {
    marginBottom: 30,
  },
  kpiCard: {
    padding: 20,
    borderRadius: 12,
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
    backgroundColor: '#d4edda',
  },
  redCard: {
    backgroundColor: '#f8d7da',
  },
  blueCard: {
    backgroundColor: '#d1ecf1',
  },
  kpiTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#000',
    marginBottom: 10,
  },
  kpiData: {
    fontSize: 14,
    color: '#000',
    marginBottom: 5,
  },
  actionButtons: {
    gap: 15,
  },
  actionButton: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 15,
  },
});


