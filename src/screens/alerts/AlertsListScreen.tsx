import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { FAB, Searchbar, Menu, Button as PaperButton, Chip } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import AlertCard from '../../components/AlertCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { fetchAlerts } from '../../store/alertSlice';
import { RootState, AppDispatch } from '../../store';
import { SeverityLevel, AlertType } from '../../types';

const AlertsListScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { alerts, isLoading } = useSelector((state: RootState) => state.alerts);
  const { user } = useSelector((state: RootState) => state.auth);

  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<SeverityLevel | 'All'>('All');
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchAlerts());
  }, []);

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'All' || alert.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const isAdmin = user?.role === 'Admin';

  if (isLoading && alerts.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <Header
        title="Alerts"
        actions={[
          {
            icon: 'filter-variant',
            onPress: () => setMenuVisible(true)
          }
        ]}
      />

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search alerts..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      {severityFilter !== 'All' && (
        <View style={styles.filterChipContainer}>
          <Chip
            mode="outlined"
            onClose={() => setSeverityFilter('All')}
          >
            Filter: {severityFilter}
          </Chip>
        </View>
      )}

      <FlatList
        data={filteredAlerts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AlertCard
            alert={item}
            onPress={() => navigation.navigate('AlertDetail' as never, { alertId: item.id } as never)}
          />
        )}
        contentContainerStyle={styles.list}
      />

      {isAdmin && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => navigation.navigate('CreateAlert' as never)}
        />
      )}

      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={<View />}
        style={styles.menu}
      >
        <Menu.Item onPress={() => { setSeverityFilter('All'); setMenuVisible(false); }} title="All" />
        <Menu.Item onPress={() => { setSeverityFilter('High'); setMenuVisible(false); }} title="High" />
        <Menu.Item onPress={() => { setSeverityFilter('Medium'); setMenuVisible(false); }} title="Medium" />
        <Menu.Item onPress={() => { setSeverityFilter('Low'); setMenuVisible(false); }} title="Low" />
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchbar: {
    elevation: 2,
  },
  filterChipContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  list: {
    paddingBottom: 80,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2196F3',
  },
  menu: {
    marginTop: 50,
  },
});

export default AlertsListScreen;