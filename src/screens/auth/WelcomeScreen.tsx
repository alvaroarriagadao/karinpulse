import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';

type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
};

type WelcomeScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Welcome'>;

const { width, height } = Dimensions.get('window');

const WelcomeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  
  // Animaciones
  const lottieRef = useRef<LottieView>(null);
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Animar contenido
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 1000,
        delay: 500,
        useNativeDriver: true,
      }),
      Animated.spring(contentTranslateY, {
        toValue: 0,
        friction: 8,
        tension: 40,
        delay: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Reproducir Lottie
    lottieRef.current?.play();
  }, []);

  return (
    <View style={styles.container}>
      {/* Gradiente de fondo con verde oscuro */}
      <LinearGradient
        colors={['#00897B', '#00897B', '#26A69A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Lottie Animado */}
        <View style={styles.lottieContainer}>
          <LottieView
            ref={lottieRef}
            source={require('../../../assets/images/Friends.json')}
            autoPlay
            loop
            style={styles.lottie}
          />
        </View>

        {/* Contenido Animado */}
        <Animated.View
          style={[
            styles.content,
            {
              opacity: contentOpacity,
              transform: [{ translateY: contentTranslateY }],
            },
          ]}
        >
          <Text variant="displayMedium" style={styles.title}>
            KarinPulse
          </Text>
          <Text variant="headlineSmall" style={styles.subtitle}>
            Tu bienestar emocional importa
          </Text>
          <Text variant="bodyLarge" style={styles.description}>
            Registra tu estado de ánimo diario y contribuye a un mejor ambiente laboral.
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Login')}
              style={styles.primaryButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              buttonColor="#FFFFFF"
              textColor="#00695C"
              elevation={4}
            >
              Iniciar Sesión
            </Button>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('Register')}
              style={styles.secondaryButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              textColor="#FFFFFF"
              buttonColor="transparent"
            >
              Crear Cuenta
            </Button>
          </View>

          <Text variant="bodyMedium" style={styles.footerText}>
            Cumple con la Ley Karin (Ley 21.643)
          </Text>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  lottieContainer: {
    alignItems: 'center',
    marginTop: height * 0.08,
  },
  lottie: {
    width: 280,
    height: 280,
  },
  content: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  title: {
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 48,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '700',
    fontSize: 22,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  description: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 26,
    paddingHorizontal: 20,
    fontSize: 17,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    borderRadius: 16,
    elevation: 6,
  },
  secondaryButton: {
    borderRadius: 16,
    borderColor: '#FFFFFF',
    borderWidth: 2.5,
  },
  buttonContent: {
    paddingVertical: 10,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  footerText: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 28,
    fontSize: 14,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default WelcomeScreen;
