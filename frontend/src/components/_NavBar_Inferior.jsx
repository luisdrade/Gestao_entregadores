import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function BottomTabBar() {
    const router = useRouter();
    const pathname = usePathname();

    const HomeActive = pathname === '/(home)/home';
    const PerfilActive = pathname.includes('/(home)/profile');
    const ComunidadeActive = pathname.includes('/(home)/comunidade');

    const handleHomePress = () => {
        router.push('/(home)/home');
    };

    const handleProfilePress = () => {
        router.push('/(home)/profile/perfil');
    };

    const handleComunidadePress = () => {
        router.push('/(home)/comunidade');
    };

    return (
        <View style={styles.container}>

            {/* Conteúdo da barra */}
            <View style={styles.content}>

                {/* Botão Profile */}
                <TouchableOpacity
                    style={[styles.tabButton, PerfilActive && styles.activeTab]}
                    onPress={handleProfilePress}
                >
                    <View style={styles.iconContainer}>
                        <Ionicons
                            name="person"
                            size={24}
                            color={PerfilActive ? '#2B2860' : '#666'}
                        />
                    </View>
                    <Text style={[styles.tabText, PerfilActive && styles.activeTabText]}>
                        profile
                    </Text>
                </TouchableOpacity>
                
                {/* Botão Home */}
                <TouchableOpacity
                    style={[styles.tabButton, HomeActive && styles.activeTab]}
                    onPress={handleHomePress}
                >
                    <View style={styles.iconContainer}>
                        <Ionicons
                            name="home"
                            size={24}
                            color={HomeActive ? '#2B2860' : '#666'}
                        />
                    </View>
                    <Text style={[styles.tabText, HomeActive && styles.activeTabText]}>
                        home
                    </Text>
                </TouchableOpacity>

                {/* Botão comunidade */}
                <TouchableOpacity
                    style={[styles.tabButton, ComunidadeActive && styles.activeTab]}
                    onPress={handleComunidadePress}
                >
                    <View style={styles.iconContainer}>
                        <Ionicons
                            name="people"
                            size={24}
                            color={ComunidadeActive ? '#2B2860' : '#666'}
                        />
                    </View>
                    <Text style={[styles.tabText, ComunidadeActive && styles.activeTabText]}>
                        comunity
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
        height: 80,
        paddingBottom: 20,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    tabButton: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        paddingVertical: 8,
    },
    activeTab: {
        backgroundColor: 'transparent',
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    tabText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    activeTabText: {
        color: '#2B2860',
        fontWeight: '600',
    },
});
