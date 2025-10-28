import { Stack } from 'expo-router';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import BottomTabBar from '../../components/_NavBar_Inferior';

export default function HomeLayout() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.stackContainer}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  stackContainer: {
    flex: 1,
  },
});

