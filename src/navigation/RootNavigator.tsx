import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useAuth } from '@/store/AuthContext';
import TabNavigator from './TabNavigator';
import AuthNavigator from './AuthNavigator';
import DetailsScreen from '@/screens/DetailsScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const LoadingScreen = () => {
  const theme = useTheme();
  return (
    <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
};

export default function RootNavigator() {
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    console.log('RootNavigator: Estado actualizado', { isAuthenticated, isLoading, userId: user?.id });
  }, [isAuthenticated, isLoading, user]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </>
      ) : (
        <Stack.Screen name="Main" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
