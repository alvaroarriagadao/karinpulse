import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Animated, Dimensions } from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '@/store/AuthContext';
import { validateEmail } from '@/utils/validators';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';

type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const { height } = Dimensions.get('window');

const LoginScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setEmailError('');
    if (text.length > 0 && !validateEmail(text)) {
      setEmailError('Email inválido');
    }
  };

  const handleSubmit = async () => {
    setLoginError('');

    if (!validateEmail(email)) {
      setEmailError('Email inválido');
      return;
    }

    if (!password) {
      setLoginError('La contraseña es requerida');
      return;
    }

    const { error } = await login({ email, password });

    if (error) {
      setLoginError(error.message || 'Error al iniciar sesión');
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
                Bienvenido de vuelta
              </Text>
              <Text variant="bodyLarge" style={styles.headerSubtitle}>
                Inicia sesión para continuar
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
                  label="Email"
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
                  label="Contraseña"
                  value={password}
                  onChangeText={setPassword}
                  mode="outlined"
                  style={styles.input}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
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

                {loginError ? (
                  <Text variant="bodyMedium" style={[styles.errorText, styles.loginError]}>
                    {loginError}
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
                  Iniciar Sesión
                </Button>

                <Button
                  mode="text"
                  onPress={() => navigation.navigate('Register')}
                  style={styles.linkButton}
                  textColor={theme.colors.primary}
                  labelStyle={styles.linkButtonLabel}
                >
                  ¿No tienes cuenta? Regístrate
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
    height: height * 0.4,
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
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  lottie: {
    width: 140,
    height: 140,
    marginBottom: 12,
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
  loginError: {
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

export default LoginScreen;
