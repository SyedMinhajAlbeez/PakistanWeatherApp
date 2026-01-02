// NavigationContainer is provided by the router; don't nest it here
import * as Notifications from 'expo-notifications';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import AppNavigator from '../../src/navigation/AppNavigator';
import { registerForPushNotificationsAsync } from '../../src/services/notificationService';
import store from '../../src/store';
import theme from '../../src/theme';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    // Newer versions expect these fields as well
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize app
    const initializeApp = async () => {
      try {
        // Register for push notifications
        await registerForPushNotificationsAsync();
        setIsReady(true);
      } catch (error) {
        console.error('App initialization error:', error);
        setIsReady(true);
      }
    };

    initializeApp();
  }, []);

  if (!isReady) {
    return null; // Or your splash screen component
  }

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <StatusBar style="auto" />
        <AppNavigator />
      </PaperProvider>
    </Provider>
  );
}