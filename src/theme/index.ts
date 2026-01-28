import { MD3LightTheme, MD3DarkTheme, MD3Theme } from 'react-native-paper';

/**
 * Tema de KarinPulse - Colores con ALTO CONTRASTE
 * Optimizado para legibilidad y accesibilidad
 */

// Colores principales - Verde Oscuro con alto contraste
const PRIMARY_GREEN = '#00897B'; // Verde oscuro (antes era #00897B)
const PRIMARY_GREEN_DARK = '#004D40';
const PRIMARY_GREEN_LIGHT = '#26A69A';
const SECONDARY_PURPLE = '#6A1B9A'; // Púrpura más oscuro
const ACCENT_CORAL = '#D84315'; // Coral más oscuro

// Colores de estado
const SUCCESS_GREEN = '#2E7D32'; // Verde más oscuro
const WARNING_AMBER = '#EF6C00'; // Naranja más oscuro
const ERROR_RED = '#C62828'; // Rojo más oscuro
const INFO_BLUE = '#1565C0'; // Azul más oscuro

export const LightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // Colores principales
    primary: PRIMARY_GREEN,
    primaryContainer: '#B2DFDB',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#003D33',
    
    // Colores secundarios
    secondary: SECONDARY_PURPLE,
    secondaryContainer: '#E1BEE7',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#38006B',
    
    // Colores terciarios
    tertiary: ACCENT_CORAL,
    tertiaryContainer: '#FFCCBC',
    onTertiary: '#FFFFFF',
    onTertiaryContainer: '#BF360C',
    
    // Colores de estado
    error: ERROR_RED,
    errorContainer: '#FFCDD2',
    onError: '#FFFFFF',
    onErrorContainer: '#8E0000',
    
    // Colores de superficie con mejor contraste
    surface: '#FFFFFF',
    surfaceVariant: '#F5F5F5',
    onSurface: '#1A1A1A', // Negro casi puro
    onSurfaceVariant: '#424242', // Gris oscuro (antes era #5F6368)
    
    // Colores de fondo
    background: '#F5F7FA',
    onBackground: '#1A1A1A',
    
    // Colores de borde y outline - Más oscuros
    outline: '#9E9E9E', // Gris más oscuro (antes era #DADCE0)
    outlineVariant: '#BDBDBD', // Gris medio
    
    // Colores personalizados
    success: SUCCESS_GREEN,
    warning: WARNING_AMBER,
    info: INFO_BLUE,
  },
};

export const DarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    // Colores principales - Más vibrantes para modo oscuro
    primary: PRIMARY_GREEN_LIGHT, // Verde brillante #26A69A
    primaryContainer: PRIMARY_GREEN_DARK,
    onPrimary: '#003D33',
    onPrimaryContainer: '#B2DFDB',
    
    // Colores secundarios
    secondary: '#BA68C8',
    secondaryContainer: '#6A1B9A',
    onSecondary: '#38006B',
    onSecondaryContainer: '#E1BEE7',
    
    // Colores terciarios
    tertiary: '#FF8A80',
    tertiaryContainer: '#D84315',
    onTertiary: '#8D0000',
    onTertiaryContainer: '#FFCCBC',
    
    // Colores de estado
    error: '#EF5350',
    errorContainer: '#C62828',
    onError: '#FFFFFF',
    onErrorContainer: '#FFCDD2',
    
    // Colores de superficie - Más contraste
    surface: '#1E1E1E',
    surfaceVariant: '#2C2C2C',
    onSurface: '#F5F5F5', // Casi blanco (antes #E8E8E8)
    onSurfaceVariant: '#D0D0D0', // Gris claro (antes #B0B0B0)
    
    // Colores de fondo
    background: '#121212',
    onBackground: '#F5F5F5',
    
    // Colores de borde y outline - Más visibles
    outline: '#666666', // Más claro (antes #3C3C3C)
    outlineVariant: '#424242',
    
    // Colores personalizados
    success: '#66BB6A',
    warning: '#FFA726',
    info: '#42A5F5',
  },
};
