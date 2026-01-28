/**
 * Pantalla de inicio de sesión
 */

import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, TextInput, Button, useTheme, HelperText } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '@/store/AuthContext';
import { validateEmail } from '@/utils/validators';

type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [submitError, setSubmitError] = useState('');

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setEmailError('');

    if (text.length > 0 && !validateEmail(text)) {
      setEmailError('Email inválido');
    }
  };

  const handleSubmit = async () => {
    setEmailError('');
    setSubmitError('');

    if (!validateEmail(email)) {
      setEmailError('Email inválido');
      return;
    }

    if (!password) {
      setSubmitError('La contraseña es requerida');
      return;
    }

    const { error } = await login({ email, password });

    if (error) {
      setSubmitError(error.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    }
    // Si no hay error, el AuthContext manejará la navegación
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
              Iniciar Sesión
            </Text>
            <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              Ingresa tus credenciales para continuar
            </Text>
          </View>

          <View style={styles.form}>
            <View>
              <TextInput
                label="Email"
                value={email}
                onChangeText={handleEmailChange}
                mode="outlined"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                left={<TextInput.Icon icon="email" />}
              />
              {emailError ? (
                <HelperText type="error" visible={!!emailError}>
                  {emailError}
                </HelperText>
              ) : null}
            </View>

            <TextInput
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              style={styles.input}
              secureTextEntry
              autoCapitalize="none"
              left={<TextInput.Icon icon="lock" />}
            />

            {submitError ? (
              <HelperText type="error" visible={!!submitError} style={styles.errorText}>
                {submitError}
              </HelperText>
            ) : null}

            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={isLoading}
              disabled={isLoading}
              style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
              contentStyle={styles.submitButtonContent}
            >
              Iniciar Sesión
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.navigate('Register')}
              style={styles.linkButton}
            >
              ¿No tienes cuenta? Regístrate
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    opacity: 0.7,
  },
  form: {
    gap: 16,
  },
  input: {
    marginBottom: 4,
  },
  errorText: {
    marginTop: -8,
  },
  submitButton: {
    marginTop: 8,
    borderRadius: 12,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
  linkButton: {
    marginTop: 8,
  },
});

export default LoginScreen;


