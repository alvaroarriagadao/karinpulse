import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import {
  useTheme,
  Switch,
  List,
  Appbar,
  Button,
  Text,
  Surface,
  Divider,
} from 'react-native-paper';

import { usePreferences } from '@/store/PreferencesContext';
import { useAuth } from '@/store/AuthContext';

const SettingsScreen = () => {
  const theme = useTheme();
  const { isThemeDark, toggleTheme } = usePreferences();
  const { user, logout, isLoading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              await logout();
              console.log('Sesión cerrada exitosamente');
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
              Alert.alert('Error', 'No se pudo cerrar sesión. Intenta nuevamente.');
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header elevated>
        <Appbar.Content title="Configuración" />
      </Appbar.Header>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Información del Usuario */}
        {user && (
          <Surface style={[styles.section, { backgroundColor: theme.colors.surface }]} elevation={1}>
            <Text
              variant="titleMedium"
              style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
            >
              Mi Cuenta
            </Text>
            <View style={styles.sectionContent}>
              <List.Item
                title="Usuario"
                description={user.email || 'No disponible'}
                titleStyle={styles.listTitle}
                descriptionStyle={styles.listDescription}
                left={(props) => (
                  <List.Icon {...props} icon="account-circle" color={theme.colors.primary} />
                )}
                style={styles.listItem}
              />
              <Divider style={styles.itemDivider} />
              <List.Item
                title="RUT"
                description={user.rut || 'No disponible'}
                titleStyle={styles.listTitle}
                descriptionStyle={styles.listDescription}
                left={(props) => (
                  <List.Icon {...props} icon="card-account-details" color={theme.colors.primary} />
                )}
                style={styles.listItem}
              />
              <Divider style={styles.itemDivider} />
              <List.Item
                title="Empresa"
                description={user.company || 'No disponible'}
                titleStyle={styles.listTitle}
                descriptionStyle={styles.listDescription}
                left={(props) => (
                  <List.Icon {...props} icon="office-building" color={theme.colors.primary} />
                )}
                style={styles.listItem}
              />
              <Divider style={styles.itemDivider} />
              <List.Item
                title="Cargo"
                description={user.position || 'No disponible'}
                titleStyle={styles.listTitle}
                descriptionStyle={styles.listDescription}
                left={(props) => (
                  <List.Icon {...props} icon="briefcase" color={theme.colors.primary} />
                )}
                style={styles.listItem}
              />
            </View>
          </Surface>
        )}

        {/* Configuración General */}
        <Surface
          style={[
            styles.section,
            styles.generalSection,
            { backgroundColor: theme.colors.surface },
          ]}
          elevation={1}
        >
          <Text
            variant="titleMedium"
            style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
          >
            General
          </Text>
          <View style={styles.sectionContent}>
            <List.Item
              title="Modo Oscuro"
              titleStyle={styles.listTitle}
              left={(props) => (
                <List.Icon {...props} icon="theme-light-dark" color={theme.colors.primary} />
              )}
              right={() => (
                <Switch
                  value={isThemeDark}
                  onValueChange={toggleTheme}
                  color={theme.colors.primary}
                />
              )}
              style={styles.listItem}
            />
            <Divider style={styles.itemDivider} />
            <List.Item
              title="Notificaciones"
              titleStyle={styles.listTitle}
              left={(props) => (
                <List.Icon {...props} icon="bell" color={theme.colors.primary} />
              )}
              style={styles.listItem}
            />
          </View>
        </Surface>

        {/* Botón de Cerrar Sesión */}
        <View style={styles.logoutSection}>
          <Button
            mode="contained"
            onPress={handleLogout}
            loading={isLoggingOut}
            disabled={isLoggingOut || isLoading}
            buttonColor={theme.colors.error}
            textColor="#FFFFFF"
            icon="logout"
            style={styles.logoutButton}
            contentStyle={styles.logoutButtonContent}
            labelStyle={styles.logoutButtonLabel}
          >
            Cerrar Sesión
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  generalSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionContent: {
    paddingVertical: 4,
  },
  listItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 64,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  listDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  itemDivider: {
    marginLeft: 56,
    marginRight: 16,
  },
  logoutSection: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  logoutButton: {
    borderRadius: 12,
    elevation: 0,
  },
  logoutButtonContent: {
    paddingVertical: 8,
  },
  logoutButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default SettingsScreen;
