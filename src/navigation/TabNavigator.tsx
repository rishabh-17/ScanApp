import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WorkSummaryScreen from '../screens/WorkSummaryScreen';
import PaymentSummaryScreen from '../screens/PaymentSummaryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          if (route.name === 'WorkSummary') {
            iconName = '📊';
          } else if (route.name === 'Payments') {
            iconName = '💰';
          } else if (route.name === 'Profile') {
            iconName = '👤';
          }

          return <Text style={{ fontSize: size }}>{iconName}</Text>;
        },
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: 'gray',
        headerTitleAlign: 'center',
        headerTintColor: '#111827',
        headerStyle: { backgroundColor: '#fff', elevation: 0, shadowOpacity: 0 },
      })}
    >
      <Tab.Screen 
        name="WorkSummary" 
        component={WorkSummaryScreen} 
        options={{ title: 'Work Summary' }}
      />
      <Tab.Screen 
        name="Payments" 
        component={PaymentSummaryScreen} 
        options={{ title: 'Payments' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'My Profile' }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
