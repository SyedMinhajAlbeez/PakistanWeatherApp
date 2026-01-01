import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LoadingSpinner from '../components/LoadingSpinner';

const SplashScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="weather-lightning-rainy" size={80} color="#2196F3" />
      <Text style={styles.title}>Karachi Weather Alert</Text>
      <Text style={styles.subtitle}>Stay Safe, Stay Informed</Text>
      <View style={styles.loader}>
        <LoadingSpinner />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#2196F3',
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
    marginTop: 8,
  },
  loader: {
    marginTop: 40,
  },
});

export default SplashScreen;