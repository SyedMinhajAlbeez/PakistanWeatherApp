import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Share, StyleSheet, View } from 'react-native';
import { Card, Chip, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import MapView, { Marker } from '../../../src/components/PlatformMapView';
import Button from '../../components/Button';
import Header from '../../components/Header';
import LoadingSpinner from '../../components/LoadingSpinner';
import { AppDispatch, RootState } from '../../store';
import { deleteAlert, fetchAlertById } from '../../store/alertSlice';
import { ALERT_TYPE_ICONS, KARACHI_COORDS } from '../../utils/constants';
import { formatDate, getSeverityColor } from '../../utils/helpers';

const AlertDetailScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { currentAlert } = useSelector((state: RootState) => state.alerts);
  const { user } = useSelector((state: RootState) => state.auth);
  const { alertId } = route.params as { alertId: string };

  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    dispatch(fetchAlertById(alertId));
  }, [alertId]);

  if (!currentAlert) {
    return <LoadingSpinner />;
  }

  const isAdmin = user?.role === 'Admin';
  const severityColor = getSeverityColor(currentAlert.severity);
  const iconName = ALERT_TYPE_ICONS[currentAlert.type];

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Alert: ${currentAlert.title}\n${currentAlert.description}\nLocation: ${currentAlert.location}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Alert',
      'Are you sure you want to delete this alert?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await dispatch(deleteAlert(alertId));
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Alert Details"
        onBackPress={() => navigation.goBack()}
        actions={[
          { icon: 'share-variant', onPress: handleShare },
          ...(isAdmin ? [{ icon: 'pencil', onPress: () => (navigation as any).navigate('EditAlert', { alertId }) }] : []),
        ]}
      />

      <ScrollView>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.header}>
              <MaterialCommunityIcons
                name={iconName as any}
                size={40}
                color={severityColor}
              />
              <View style={styles.headerInfo}>
                <Text style={styles.title}>{currentAlert.title}</Text>
                <Chip
                  mode="flat"
                  style={[styles.severityChip, { backgroundColor: severityColor + '20' }]}
                  textStyle={{ color: severityColor }}
                >
                  {currentAlert.severity}
                </Chip>
              </View>
            </View>

            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="map-marker" size={20} color="#757575" />
              <Text style={styles.infoText}>{currentAlert.location}</Text>
            </View>

            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="calendar" size={20} color="#757575" />
              <Text style={styles.infoText}>
                {formatDate(currentAlert.startDate)} - {formatDate(currentAlert.endDate)}
              </Text>
            </View>

            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{currentAlert.description}</Text>

            <Text style={styles.sectionTitle}>Alert Type</Text>
            <Chip mode="outlined" style={styles.typeChip}>
              {currentAlert.type}
            </Chip>
          </Card.Content>
        </Card>

        {currentAlert.latitude && currentAlert.longitude && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Location on Map</Text>
              <MapView
                    style={styles.map}
                    initialRegion={{
                      // Use KARACHI_COORDS as defaults, override with alert coords if present
                      ...KARACHI_COORDS,
                      latitude: currentAlert.latitude ?? KARACHI_COORDS.latitude,
                      longitude: currentAlert.longitude ?? KARACHI_COORDS.longitude,
                    }}
                  >
                    <Marker
                      coordinate={{
                        latitude: currentAlert.latitude ?? KARACHI_COORDS.latitude,
                        longitude: currentAlert.longitude ?? KARACHI_COORDS.longitude,
                      }}
                      title={currentAlert.title}
                    />
                  </MapView>
            </Card.Content>
          </Card>
        )}

        <View style={styles.actions}>
          <Button
            mode={isSubscribed ? 'outlined' : 'contained'}
            onPress={() => setIsSubscribed(!isSubscribed)}
            icon={isSubscribed ? 'bell-off' : 'bell'}
          >
            {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
          </Button>

          {isAdmin && (
            <Button
              mode="outlined"
              onPress={handleDelete}
              icon="delete"
              style={styles.deleteButton}
            >
              Delete Alert
            </Button>
          )}
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
  card: {
    margin: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#212121',
  },
  severityChip: {
    alignSelf: 'flex-start',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#424242',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#212121',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#424242',
  },
  typeChip: {
    alignSelf: 'flex-start',
  },
  map: {
    height: 200,
    borderRadius: 8,
    marginTop: 8,
  },
  actions: {
    padding: 16,
  },
  deleteButton: {
    marginTop: 8,
    borderColor: '#F44336',
  },
});

export default AlertDetailScreen;