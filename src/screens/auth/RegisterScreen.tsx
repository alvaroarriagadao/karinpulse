/**
 * Pantalla de registro - Registro de nuevos usuarios
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, useTheme, HelperText } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '@/store/AuthContext';
import { validateRUT, validateEmail, validatePassword } from '@/utils/validators';

type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
};

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

const RegisterScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { register, isLoading } = useAuth();

  // Estados del formulario
  const [fullName, setFullName] = useState('');
  const [rut, setRut] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');

  // Estados de validación
  const [rutError, setRutError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [submitError, setSubmitError] = useState('');

  // Validar RUT en tiempo real
  const handleRUTChange = (text: string) => {
    setRut(text);
    setRutError('');

    if (text.length > 0) {
      const validation = validateRUT(text);
      if (!validation.isValid && text.length >= 8) {
        setRutError('RUT inválido. Verifica el formato y dígito verificador.');
      }
    }
  };

  // Validar email en tiempo real
  const handleEmailChange = (text: string) => {
    setEmail(text);
    setEmailError('');

    if (text.length > 0 && !validateEmail(text)) {
      setEmailError('Email inválido');
    }
  };

  // Validar contraseña en tiempo real
  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setPasswordError('');

    if (text.length > 0) {
      const validation = validatePassword(text);
      if (!validation.isValid) {
        setPasswordError(validation.errors[0]);
      }
    }
  };

  const handleSubmit = async () => {
    // Resetear errores
    setRutError('');
    setEmailError('');
    setPasswordError('');
    setSubmitError('');

    // Validaciones
    if (!fullName.trim()) {
      setSubmitError('El nombre completo es requerido');
      return;
    }

    const rutValidation = validateRUT(rut);
    if (!rutValidation.isValid) {
      setRutError('RUT inválido. Verifica el formato y dígito verificador.');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Email inválido');
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.errors[0]);
      return;
    }

    if (!company.trim()) {
      setSubmitError('La empresa es requerida');
      return;
    }

    if (!position.trim()) {
      setSubmitError('El cargo es requerido');
      return;
    }

    // Registrar usuario
    const { error } = await register({
      email,
      password,
      fullName: fullName.trim(),
      rut: rutValidation.clean,
      company: company.trim(),
      position: position.trim(),
    });

    if (error) {
      setSubmitError(error.message || 'Error al registrar usuario');
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
              Crear Cuenta
            </Text>
            <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              Completa tus datos para comenzar
            </Text>
          </View>

          <View style={styles.form}>
            <TextInput
              label="Nombre Completo"
              value={fullName}
              onChangeText={setFullName}
              mode="outlined"
              style={styles.input}
              autoCapitalize="words"
              left={<TextInput.Icon icon="account" />}
            />

            <View>
              <TextInput
                label="RUT"
                value={rut}
                onChangeText={handleRUTChange}
                mode="outlined"
                style={styles.input}
                placeholder="12.345.678-9"
                keyboardType="default"
                left={<TextInput.Icon icon="card-account-details" />}
              />
              {rutError ? (
                <HelperText type="error" visible={!!rutError}>
                  {rutError}
                </HelperText>
              ) : (
                <HelperText type="info" visible={rut.length > 0 && !rutError}>
                  Formato: 12.345.678-9 o 12345678-9
                </HelperText>
              )}
            </View>

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

            <View>
              <TextInput
                label="Contraseña"
                value={password}
                onChangeText={handlePasswordChange}
                mode="outlined"
                style={styles.input}
                secureTextEntry
                autoCapitalize="none"
                left={<TextInput.Icon icon="lock" />}
              />
              {passwordError ? (
                <HelperText type="error" visible={!!passwordError}>
                  {passwordError}
                </HelperText>
              ) : (
                <HelperText type="info" visible={password.length > 0 && !passwordError}>
                  Mínimo 8 caracteres, mayúscula, minúscula y número
                </HelperText>
              )}
            </View>

            <TextInput
              label="Empresa"
              value={company}
              onChangeText={setCompany}
              mode="outlined"
              style={styles.input}
              autoCapitalize="words"
              left={<TextInput.Icon icon="office-building" />}
            />

            <TextInput
              label="Cargo"
              value={position}
              onChangeText={setPosition}
              mode="outlined"
              style={styles.input}
              autoCapitalize="words"
              left={<TextInput.Icon icon="briefcase" />}
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
              Registrarse
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.navigate('Login')}
              style={styles.linkButton}
            >
              ¿Ya tienes cuenta? Inicia sesión
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

export default RegisterScreen;


