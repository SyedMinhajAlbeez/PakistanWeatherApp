import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Header from '../../components/Header';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { createAlert } from '../../store/alertSlice';
import { AppDispatch } from '../../store';
import { AlertType, SeverityLevel, CreateAlertRequest } from '../../types';

const CreateAlertScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<AlertType>('Heatwave');
  const [severity, setSeverity] = useState<SeverityLevel>('Medium');
  const [location, setLocation] = useState('Karachi');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!title || !description) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const alertData: CreateAlertRequest = {
        title,
        description,
        type,
        severity,
        location,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      await dispatch(createAlert(alertData)).unwrap();
      navigation.goBack();
    } catch (err: any) {
      setError(err.message || 'Failed to create alert');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header
        title="Create Alert"
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.content}>
        <Input
          label="Alert Title *"
          value={title}
          onChangeText={setTitle}
        />

        <Input
          label="Description *"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        <Input
          label="Location"
          value={location}
          onChangeText={setLocation}
        />

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={type}
            onValueChange={(value) => setType(value)}
          >
            <Picker.Item label="Heatwave" value="Heatwave" />
            <Picker.Item label="Thunderstorm" value="Thunderstorm" />
            <Picker.Item label="Heavy Rain" value="Heavy Rain" />
            <Picker.Item label="Cyclone" value="Cyclone" />
            <Picker.Item label="Flood" value="Flood" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={severity}
            onValueChange={(value) => setSeverity(value)}
          >
            <Picker.Item label="Low" value="Low" />
            <Picker.Item label="Medium" value="Medium" />
            <Picker.Item label="High" value="High" />
          </Picker>
        </View>

        <Button
          mode="outlined"
          onPress={() => setShowStartPicker(true)}
        >
          Start Date: {startDate.toLocaleDateString()}
        </Button>

        <Button
          mode="outlined"
          onPress={() => setShowEndPicker(true)}
        >
          End Date: {endDate.toLocaleDateString()}
        </Button>

        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            onChange={(event, date) => {
              setShowStartPicker(false);
              if (date) setStartDate(date);
            }}
          />
        )}

        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            onChange={(event, date) => {
              setShowEndPicker(false);
              if (date) setEndDate(date);
            }}
          />
        )}

        <Button
          onPress={handleSubmit}
          loading={loading}
          style={styles.submitButton}
        >
          Create Alert
        </Button>
      </ScrollView>

      <Snackbar
        visible={!!error}
        onDismiss={() => setError('')}
        duration={3000}
      >
        {error}
      </Snackbar>
    </KeyboardAvoidingView>
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 4,
    marginVertical: 8,
  },
  submitButton: {
    marginTop: 16,
    marginBottom: 32,
  },
});

export default CreateAlertScreen;