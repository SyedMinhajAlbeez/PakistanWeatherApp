import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MainTabParamList, AlertStackParamList } from '../types';
import HomeScreen from '../screens/home/HomeScreen';
import AlertsListScreen from '../screens/alerts/AlertsListScreen';
import AlertDetailScreen from '../screens/alerts/AlertDetailScreen';
import CreateAlertScreen from '../screens/alerts/CreateAlertScreen';
import EditAlertScreen from '../screens/alerts/EditAlertScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const AlertStack = createStackNavigator<AlertStackParamList>();

const AlertsNavigator: React.FC = () => {
  return (
    <AlertStack.Navigator screenOptions={{ headerShown: false }}>
      <AlertStack.Screen name="AlertsList" component={AlertsListScreen} />
      <AlertStack.Screen name="AlertDetail" component={AlertDetailScreen} />
      <AlertStack.Screen name="CreateAlert" component={CreateAlertScreen} />
      <AlertStack.Screen name="EditAlert" component={EditAlertScreen} />
    </AlertStack.Navigator>
  );
};

const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Alerts') {
            iconName = focused ? 'alert-circle' : 'alert-circle-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'cog' : 'cog-outline';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#757575',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Alerts" component={AlertsNavigator} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default MainNavigator;