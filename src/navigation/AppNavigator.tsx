import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ScanScreen from '../screens/ScanScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { ActivityIndicator, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Stack = createStackNavigator();

const LoadingScreen = () => (
  <View style={styles.loaderContainer}>
    <ActivityIndicator size="large" color="#4F46E5" />
    <Text style={styles.loaderText}>Loading ScanApp...</Text>
  </View>
);

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: 'center',
          headerTintColor: '#111827',
          headerStyle: { backgroundColor: '#fff', elevation: 0, shadowOpacity: 0 },
        }}
      >
        {user ? (
          <>
            <Stack.Screen
              name="Scan"
              component={ScanScreen}
              options={({ navigation }) => ({
                title: 'Scan Entry',
                headerRight: () => (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Profile')}
                    style={{ marginRight: 15 }}
                  >
                    <Text style={{ color: '#4F46E5', fontWeight: 'bold' }}>Profile</Text>
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ title: 'My Profile' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ title: 'Register' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },

  loaderText: {
    marginTop: 10,
    color: '#6B7280',
    fontSize: 14,
  },
});

export default AppNavigator;