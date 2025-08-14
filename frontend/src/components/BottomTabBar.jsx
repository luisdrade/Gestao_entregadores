import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function BottomTabBar() {
  const router = useRouter();
  const pathname = usePathname();

  const isHomeActive = pathname === '/(home)/home';
  const isProfileActive = pathname.includes('/(home)/profile');

  const handleHomePress = () => {
    router.push('/(home)/home');
  };

  const handleProfilePress = () => {
    router.push('/(home)/profile/perfil');
  };

  return (
    <View style={styles.container}>
      {/* Linha ondulada superior */}
      <View style={styles.wavyLine}>
        <View style={styles.waveContainer}>
          <View style={[styles.waveSegment, styles.waveLeft]} />
          <View style={[styles.waveSegment, styles.waveCenter]} />
          <View style={[styles.waveSegment, styles.waveRight]} />
        </View>
      </View>
      
      {/* Conteúdo da barra */}
      <View style={styles.content}>
        {/* Botão Home */}
        <TouchableOpacity 
          style={[styles.tabButton, isHomeActive && styles.activeTab]} 
          onPress={handleHomePress}
        >
          <View style={styles.iconContainer}>
            <Ionicons 
              name="home" 
              size={24} 
              color={isHomeActive ? '#007AFF' : '#666'} 
            />
          </View>
          <Text style={[styles.tabText, isHomeActive && styles.activeTabText]}>
            home
          </Text>
        </TouchableOpacity>

        {/* Botão Profile */}
        <TouchableOpacity 
          style={[styles.tabButton, isProfileActive && styles.activeTab]} 
          onPress={handleProfilePress}
        >
          <View style={styles.iconContainer}>
            <Ionicons 
              name="person" 
              size={24} 
              color={isProfileActive ? '#007AFF' : '#666'} 
            />
          </View>
          <Text style={[styles.tabText, isProfileActive && styles.activeTabText]}>
            profile
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderLeftColor: '#E0E0E0',
    borderRightColor: '#E0E0E0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  wavyLine: {
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 4,
  },
  waveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 4,
  },
  waveSegment: {
    width: 20,
    height: 4,
    backgroundColor: '#000',
    borderRadius: 2,
  },
  waveLeft: {
    transform: [{ rotate: '-15deg' }],
  },
  waveCenter: {
    transform: [{ rotate: '0deg' }],
    marginHorizontal: 2,
  },
  waveRight: {
    transform: [{ rotate: '15deg' }],
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 12,
  },
  tabButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  iconContainer: {
    marginBottom: 4,
  },
  tabText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    textTransform: 'lowercase',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
