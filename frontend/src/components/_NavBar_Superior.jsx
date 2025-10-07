import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';

export default function TopNavBar() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { key: 'home', label: 'Dashboard', route: '/(home)/home', isActive: pathname === '/(home)/home' },
    { key: 'trabalhado', label: 'Trabalhado', route: '/(home)/calculos/trabalhado', isActive: pathname.includes('/calculos/trabalhado') && !pathname.includes('/calculos/financeiro') },
    { key: 'financeiro', label: 'Financeiro', route: '/(home)/calculos/financeiro', isActive: pathname.includes('/calculos/financeiro') },
    { key: 'relatorios', label: 'Relatórios', route: '/(home)/relatorios', isActive: pathname === '/(home)/relatorios' }
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tab, tab.isActive && styles.activeTab]}
          onPress={() => router.push(tab.route)}
        >
          <Text style={[styles.tabText, tab.isActive && styles.activeTabText]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2B2860',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#2B2860',
    fontWeight: 'bold',
  },
});
