import { MD3LightTheme, MD3DarkTheme, MD3Theme } from 'react-native-paper';

/**
 * Tema de KarinPulse - Colores de confianza y seguridad
 * Inspirado en Material Design 3 con paleta corporativa profesional
 */

// Colores principales de confianza (azul corporativo)
const PRIMARY_BLUE = '#1976D2'; // Azul confiable
const PRIMARY_BLUE_DARK = '#1565C0';
const SECONDARY_TEAL = '#00897B'; // Verde-azul de calma
const ACCENT_VIOLET = '#7B1FA2'; // Violeta de seguridad

// Colores de estado
const SUCCESS_GREEN = '#4CAF50';
const WARNING_AMBER = '#FF9800';
const ERROR_RED = '#D32F2F';
const INFO_BLUE = '#2196F3';

export const LightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // Colores principales
    primary: PRIMARY_BLUE,
    primaryContainer: '#E3F2FD',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#0D47A1',
    
    // Colores secundarios
    secondary: SECONDARY_TEAL,
    secondaryContainer: '#B2DFDB',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#004D40',
    
    // Colores terciarios
    tertiary: ACCENT_VIOLET,
    tertiaryContainer: '#E1BEE7',
    onTertiary: '#FFFFFF',
    onTertiaryContainer: '#4A148C',
    
    // Colores de estado
    error: ERROR_RED,
    errorContainer: '#FFCDD2',
    onError: '#FFFFFF',
    onErrorContainer: '#B71C1C',
    
    // Colores de superficie
    surface: '#FFFFFF',
    surfaceVariant: '#F5F5F5',
    onSurface: '#212121',
    onSurfaceVariant: '#616161',
    
    // Colores de fondo
    background: '#FAFAFA',
    onBackground: '#212121',
    
    // Colores de borde y outline
    outline: '#BDBDBD',
    outlineVariant: '#E0E0E0',
    
    // Colores personalizados para la app
    success: SUCCESS_GREEN,
    warning: WARNING_AMBER,
    info: INFO_BLUE,
  },
};

export const DarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    // Colores principales
    primary: '#64B5F6',
    primaryContainer: '#1565C0',
    onPrimary: '#0D47A1',
    onPrimaryContainer: '#E3F2FD',
    
    // Colores secundarios
    secondary: '#4DB6AC',
    secondaryContainer: '#00695C',
    onSecondary: '#004D40',
    onSecondaryContainer: '#B2DFDB',
    
    // Colores terciarios
    tertiary: '#BA68C8',
    tertiaryContainer: '#6A1B9A',
    onTertiary: '#4A148C',
    onTertiaryContainer: '#E1BEE7',
    
    // Colores de estado
    error: '#EF5350',
    errorContainer: '#C62828',
    onError: '#FFFFFF',
    onErrorContainer: '#FFCDD2',
    
    // Colores de superficie
    surface: '#121212',
    surfaceVariant: '#1E1E1E',
    onSurface: '#E0E0E0',
    onSurfaceVariant: '#BDBDBD',
    
    // Colores de fondo
    background: '#000000',
    onBackground: '#E0E0E0',
    
    // Colores de borde y outline
    outline: '#424242',
    outlineVariant: '#2C2C2C',
    
    // Colores personalizados para la app
    success: '#66BB6A',
    warning: '#FFA726',
    info: '#42A5F5',
  },
};
