import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import merge from 'deepmerge';

import RootNavigator from '@/navigation/RootNavigator';
import { LightTheme, DarkTheme } from '@/theme';
import {
  PreferencesProvider,
  usePreferences,
} from '@/store/PreferencesContext';
import { AuthProvider } from '@/store/AuthContext';

// Adapt Navigation Theme to Paper Theme
const CombinedDefaultTheme = merge(NavigationDefaultTheme, LightTheme);
const CombinedDarkTheme = merge(NavigationDarkTheme, DarkTheme);

const Main = () => {
  const { isThemeDark } = usePreferences();
  const theme = isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme;

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        <RootNavigator />
        <StatusBar style={isThemeDark ? 'light' : 'dark'} />
      </NavigationContainer>
    </PaperProvider>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PreferencesProvider>
        <AuthProvider>
          <Main />
        </AuthProvider>
      </PreferencesProvider>
    </SafeAreaProvider>
  );
}
