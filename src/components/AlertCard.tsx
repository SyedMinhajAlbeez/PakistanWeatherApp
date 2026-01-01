import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Alert } from '../types';
import { getSeverityColor, formatDateShort } from '../utils/helpers';
import { ALERT_TYPE_ICONS } from '../utils/constants';

interface AlertCardProps {
  alert: Alert;
  onPress: () => void;
}

const AlertCard: React.FC<AlertCardProps> = ({ alert, onPress }) => {
  const severityColor = getSeverityColor(alert.severity);
  const iconName = ALERT_TYPE_ICONS[alert.type] || 'alert-circle';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={[styles.card, { borderLeftColor: severityColor }]}>
        <Card.Content>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name={iconName as any}
                size={24}
                color={severityColor}
              />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title} numberOfLines={1}>
                {alert.title}
              </Text>
              <Text style={styles.location} numberOfLines={1}>
                {alert.location}
              </Text>
            </View>
          </View>

          <Text style={styles.description} numberOfLines={2}>
            {alert.description}
          </Text>

          <View style={styles.footer}>
            <Chip
              mode="flat"
              style={[styles.chip, { backgroundColor: severityColor + '20' }]}
              textStyle={{ color: severityColor, fontSize: 12 }}
            >
              {alert.severity}
            </Chip>
            <Text style={styles.date}>
              {formatDateShort(alert.startDate)}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderLeftWidth: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  location: {
    fontSize: 12,
    color: '#757575',
  },
  description: {
    fontSize: 14,
    color: '#424242',
    marginVertical: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  chip: {
    height: 24,
  },
  date: {
    fontSize: 12,
    color: '#757575',
  },
});

export default AlertCard;