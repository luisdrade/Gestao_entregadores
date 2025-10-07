import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { useRouter } from 'expo-router';

export default function HeaderWithBack({ 
  title, 
  onBackPress,
  showBackButton = true,
  rightComponent,
  backgroundColor = '#2B2860',
  titleColor = '#fff',
  style = {},
  showWelcome = false,
  welcomeText,
}) {
  const router = useRouter();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <View style={[styles.header, style]}>
        <View style={styles.headerContent}>
          {showBackButton ? (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Text style={[styles.backButtonText, { color: titleColor }]}>
                ← Voltar
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.placeholder} />
          )}
          
          <Text style={[styles.headerTitle, { color: titleColor }]}>
            {title}
          </Text>
          
          {rightComponent ? (
            <View style={styles.rightComponent}>
              {rightComponent}
            </View>
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>
        
        {showWelcome && welcomeText && (
          <Text style={[styles.welcomeText, { color: titleColor }]}>
            {welcomeText}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#2B2860',
  },
  header: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  rightComponent: {
    minWidth: 60,
    alignItems: 'flex-end',
  },
  placeholder: {
    width: 60,
  },
  welcomeText: {
    fontSize: 16,
    marginTop: 10,
    opacity: 0.9,
  },
});
