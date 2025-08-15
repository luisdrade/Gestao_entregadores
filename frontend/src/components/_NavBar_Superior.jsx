import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';

export default function TopNavBar() {
  const router = useRouter();
  const pathname = usePathname();

  // Determinar qual aba está ativa baseado na rota atual
  const HomeActive = pathname === '/(home)/home';
  const TrabalhadoActive = pathname.includes('/calculos/trabalhado') && !pathname.includes('/calculos/financeiro');
  const FinanceiroActive = pathname.includes('/calculos/financeiro');
  const RelatoriosActive = pathname === '/(home)/relatorios';

  const handleHomePress = () => {
    router.push('/(home)/home');
  };

  const handleTrabalhadoPress = () => {
    router.push('/(home)/calculos/trabalhado');
  };

  const handleFinanceiroPress = () => {
    router.push('/(home)/calculos/financeiro');
  };

  const handleRelatoriosPress = () => {
    router.push('/(home)/relatorios');
  };

  return (
    <View style={styles.navBar}>
      <TouchableOpacity 
        style={[styles.navTab, HomeActive && styles.activeTab]} 
        onPress={handleHomePress}
      >
        <Text style={[styles.navTabText, HomeActive && styles.activeTabText]}>
          Dashboard
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.navTab, TrabalhadoActive && styles.activeTab]} 
        onPress={handleTrabalhadoPress}
      >
        <Text style={[styles.navTabText, TrabalhadoActive && styles.activeTabText]}>
          Trabalhado
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.navTab, FinanceiroActive && styles.activeTab]} 
        onPress={handleFinanceiroPress}
      >
        <Text style={[styles.navTabText, FinanceiroActive && styles.activeTabText]}>
          Financeiro
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.navTab, RelatoriosActive && styles.activeTab]} 
        onPress={handleRelatoriosPress}
      >
        <Text style={[styles.navTabText, RelatoriosActive && styles.activeTabText]}>
          Relatórios
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
