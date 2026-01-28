import { StyleSheet } from 'react-native';

/**
 * Estilos comunes y reutilizables para toda la aplicación
 * 
 * Este archivo contiene estilos compartidos que pueden ser utilizados
 * en múltiples componentes y screens.
 * 
 * Para estilos específicos de un componente, usa StyleSheet.create
 * dentro del mismo archivo del componente.
 * 
 * @example
 * import { commonStyles } from '@/styles/common';
 * 
 * <View style={commonStyles.container}>
 *   <Text style={commonStyles.text}>Contenido</Text>
 * </View>
 */

export const commonStyles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Spacing
  padding: {
    padding: 16,
  },
  paddingHorizontal: {
    paddingHorizontal: 16,
  },
  paddingVertical: {
    paddingVertical: 16,
  },
  margin: {
    margin: 16,
  },
  marginHorizontal: {
    marginHorizontal: 16,
  },
  marginVertical: {
    marginVertical: 16,
  },

  // Common UI
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  divider: {
    marginVertical: 8,
  },
});

/**
 * Guía de organización de estilos:
 * 
 * 1. Estilos globales/compartidos → src/styles/common.ts
 * 2. Estilos específicos de componente → StyleSheet.create dentro del componente
 * 3. Estilos temáticos → src/theme/index.ts (colores, tipografía, etc.)
 * 
 * Mejores prácticas:
 * - Usa el tema de React Native Paper para colores dinámicos
 * - Combina estilos comunes con estilos específicos usando arrays: [commonStyles.container, customStyles]
 * - Mantén los estilos cerca del código que los usa
 * - Usa constantes para valores repetidos (spacing, border radius, etc.)
 */

