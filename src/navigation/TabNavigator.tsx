import React from 'react';
import { createBottomTabNavigator, type BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import WorkSummaryScreen from '../screens/WorkSummaryScreen';
import PaymentSummaryScreen from '../screens/PaymentSummaryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator();

const screenOptions = ({ route }: any): BottomTabNavigationOptions => ({
  tabBarIcon: ({ size }: any) => {
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
  headerTitleAlign: 'center' as const,
  headerTintColor: '#111827',
  headerStyle: { backgroundColor: '#fff', elevation: 0, shadowOpacity: 0 },
});

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={screenOptions}
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
