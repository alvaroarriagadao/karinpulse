/**
 * Pantalla de registro - Registro de nuevos usuarios
 */

import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Animated, Dimensions } from 'react-native';
import { Text, TextInput, Button, useTheme, HelperText } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '@/store/AuthContext';
import { validateRUT, validateEmail, validatePassword } from '@/utils/validators';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';

type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
};

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

const { height } = Dimensions.get('window');

const RegisterScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { register, isLoading } = useAuth();

  // Animaciones
  const lottieRef = useRef<LottieView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    lottieRef.current?.play();
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Estados del formulario
  const [fullName, setFullName] = useState('');
  const [rut, setRut] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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

    // Llamar al servicio de registro
    console.log('📝 RegisterScreen: Enviando datos de registro', {
      fullName: fullName.trim(),
      rut: rut.trim(),
      email: email.trim(),
      company: company.trim(),
      position: position.trim(),
      passwordLength: password.length,
    });

    const { error } = await register({
      email: email.trim(),
      password: password.trim(),
      fullName: fullName.trim(),
      rut: rut.trim(),
      company: company.trim(),
      position: position.trim(),
    });

    if (error) {
      console.error('❌ RegisterScreen: Error al registrar:', error);
      setSubmitError(error.message || 'Error al registrar usuario');
    } else {
      console.log('✅ RegisterScreen: Registro exitoso');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#00897B', '#00897B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header con Lottie */}
            <Animated.View
              style={[
                styles.header,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <LottieView
                ref={lottieRef}
                source={require('../../../assets/images/Friends.json')}
                autoPlay
                loop
                style={styles.lottie}
              />
              <Text variant="headlineLarge" style={styles.headerTitle}>
                Crear Cuenta
              </Text>
              <Text variant="bodyLarge" style={styles.headerSubtitle}>
                Únete a KarinPulse hoy
              </Text>
            </Animated.View>

            {/* Formulario */}
            <Animated.View
              style={[
                styles.formCard,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <View style={styles.formContent}>
                <TextInput
                  label="Nombre Completo *"
                  value={fullName}
                  onChangeText={setFullName}
                  mode="outlined"
                  style={styles.input}
                  autoCapitalize="words"
                  left={<TextInput.Icon icon="account" />}
                  outlineColor={theme.colors.outline}
                  activeOutlineColor={theme.colors.primary}
                  textColor={theme.colors.onSurface}
                />

                <TextInput
                  label="RUT (ej: 12.345.678-9) *"
                  value={rut}
                  onChangeText={handleRUTChange}
                  mode="outlined"
                  style={styles.input}
                  error={!!rutError}
                  left={<TextInput.Icon icon="card-account-details" />}
                  outlineColor={theme.colors.outline}
                  activeOutlineColor={theme.colors.primary}
                  textColor={theme.colors.onSurface}
                />
                {rutError ? (
                  <Text variant="bodyMedium" style={styles.errorText}>
                    {rutError}
                  </Text>
                ) : null}

                <TextInput
                  label="Email *"
                  value={email}
                  onChangeText={handleEmailChange}
                  mode="outlined"
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  error={!!emailError}
                  left={<TextInput.Icon icon="email" />}
                  outlineColor={theme.colors.outline}
                  activeOutlineColor={theme.colors.primary}
                  textColor={theme.colors.onSurface}
                />
                {emailError ? (
                  <Text variant="bodyMedium" style={styles.errorText}>
                    {emailError}
                  </Text>
                ) : null}

                <TextInput
                  label="Contraseña *"
                  value={password}
                  onChangeText={handlePasswordChange}
                  mode="outlined"
                  style={styles.input}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  error={!!passwordError}
                  left={<TextInput.Icon icon="lock" />}
                  right={
                    <TextInput.Icon
                      icon={showPassword ? 'eye-off' : 'eye'}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                  outlineColor={theme.colors.outline}
                  activeOutlineColor={theme.colors.primary}
                  textColor={theme.colors.onSurface}
                />
                {passwordError ? (
                  <Text variant="bodyMedium" style={styles.errorText}>
                    {passwordError}
                  </Text>
                ) : null}
                {password && !passwordError && (
                  <HelperText type="info" style={styles.helperText}>
                    La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y
                    un número.
                  </HelperText>
                )}

                <TextInput
                  label="Empresa / Institución *"
                  value={company}
                  onChangeText={setCompany}
                  mode="outlined"
                  style={styles.input}
                  left={<TextInput.Icon icon="office-building" />}
                  outlineColor={theme.colors.outline}
                  activeOutlineColor={theme.colors.primary}
                  textColor={theme.colors.onSurface}
                />

                <TextInput
                  label="Cargo / Posición *"
                  value={position}
                  onChangeText={setPosition}
                  mode="outlined"
                  style={styles.input}
                  left={<TextInput.Icon icon="briefcase" />}
                  outlineColor={theme.colors.outline}
                  activeOutlineColor={theme.colors.primary}
                  textColor={theme.colors.onSurface}
                />

                {submitError ? (
                  <Text variant="bodyMedium" style={[styles.errorText, styles.submitError]}>
                    {submitError}
                  </Text>
                ) : null}

                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  loading={isLoading}
                  disabled={isLoading}
                  style={styles.submitButton}
                  contentStyle={styles.submitButtonContent}
                  labelStyle={styles.submitButtonLabel}
                  buttonColor={theme.colors.primary}
                  elevation={4}
                >
                  Crear Cuenta
                </Button>

                <Button
                  mode="text"
                  onPress={() => navigation.navigate('Login')}
                  style={styles.linkButton}
                  textColor={theme.colors.primary}
                  labelStyle={styles.linkButtonLabel}
                >
                  ¿Ya tienes cuenta? Inicia sesión
                </Button>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  headerGradient: {
    height: height * 0.32,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  lottie: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
    fontSize: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    marginBottom: 30,
  },
  formContent: {
    gap: 18,
  },
  input: {
    backgroundColor: '#F8F9FA',
    fontSize: 16,
  },
  errorText: {
    color: '#C62828',
    marginTop: -14,
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  helperText: {
    marginTop: -14,
    marginLeft: 12,
    fontSize: 13,
    color: '#616161',
  },
  submitError: {
    marginTop: 0,
    textAlign: 'center',
    backgroundColor: '#FFEBEE',
    padding: 14,
    borderRadius: 10,
  },
  submitButton: {
    marginTop: 20,
    borderRadius: 14,
    elevation: 4,
  },
  submitButtonContent: {
    paddingVertical: 10,
  },
  submitButtonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 12,
  },
  linkButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RegisterScreen;
