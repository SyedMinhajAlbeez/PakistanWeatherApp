import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Chip } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '../../components/Header';
import AlertCard from '../../components/AlertCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { fetchAlerts } from '../../store/alertSlice';
import { alertService } from '../../services/alertService';
import { RootState, AppDispatch } from '../../store';
import { CurrentWeather } from '../../types';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { alerts, isLoading } = useSelector((state: RootState) => state.alerts);

  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    dispatch(fetchAlerts());
    try {
      const weatherData = await alertService.getCurrentWeather();
      setWeather(weatherData);
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const activeAlerts = alerts.filter(a => a.isActive).slice(0, 3);

  if (isLoading && !weather) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <Header title="Home" />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>
          <Text style={styles.greeting}>Welcome, {user?.name}!</Text>

          {/* Current Weather Card */}
          <Card style={styles.weatherCard}>
            <Card.Content>
              <View style={styles.weatherHeader}>
                <MaterialCommunityIcons name="weather-partly-cloudy" size={48} color="#2196F3" />
                <View style={styles.weatherInfo}>
                  <Text style={styles.temperature}>
                    {weather?.temperature || '--'}°C
                  </Text>
                  <Text style={styles.condition}>
                    {weather?.condition || 'Loading...'}
                  </Text>
                </View>
              </View>
              <View style={styles.weatherDetails}>
                <View style={styles.weatherDetailItem}>
                  <MaterialCommunityIcons name="water-percent" size={20} color="#757575" />
                  <Text style={styles.detailText}>{weather?.humidity || '--'}%</Text>
                </View>
                <View style={styles.weatherDetailItem}>
                  <MaterialCommunityIcons name="weather-windy" size={20} color="#757575" />
                  <Text style={styles.detailText}>{weather?.windSpeed || '--'} km/h</Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Active Alerts Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Active Alerts</Text>
              {activeAlerts.length > 0 && (
                <Chip mode="flat" style={styles.countChip}>
                  {activeAlerts.length}
                </Chip>
              )}
            </View>

            {activeAlerts.length === 0 ? (
              <Card style={styles.emptyCard}>
                <Card.Content style={styles.emptyContent}>
                  <MaterialCommunityIcons name="check-circle" size={48} color="#4CAF50" />
                  <Text style={styles.emptyText}>No active alerts</Text>
                  <Text style={styles.emptySubtext}>Everything looks good!</Text>
                </Card.Content>
              </Card>
            ) : (
              activeAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onPress={() => navigation.navigate('Alerts' as never, {
                    screen: 'AlertDetail',
                    params: { alertId: alert.id }
                  } as never)}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#212121',
  },
  weatherCard: {
    marginBottom: 24,
    elevation: 2,
  },
  weatherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  weatherInfo: {
    marginLeft: 16,
  },
  temperature: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#212121',
  },
  condition: {
    fontSize: 16,
    color: '#757575',
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  weatherDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#757575',
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
  },
  countChip: {
    height: 28,
  },
  emptyCard: {
    marginHorizontal: 16,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#212121',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
});

export default HomeScreen;