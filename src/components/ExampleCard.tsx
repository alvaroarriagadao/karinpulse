import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Card, Text, Button, useTheme } from 'react-native-paper';

/**
 * ExampleCard - Componente de ejemplo reutilizable
 * 
 * Este componente demuestra las mejores prácticas:
 * - Uso de TypeScript con props tipadas
 * - Integración con el tema de React Native Paper
 * - Estilos organizados con StyleSheet
 * - Componente reutilizable y flexible
 * 
 * @example
 * <ExampleCard
 *   title="Mi Título"
 *   subtitle="Mi subtítulo"
 *   onPress={() => console.log('Presionado')}
 * />
 */
interface ExampleCardProps {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  style?: ViewStyle;
  buttonText?: string;
}

export const ExampleCard: React.FC<ExampleCardProps> = ({
  title,
  subtitle,
  onPress,
  style,
  buttonText = 'Acción',
}) => {
  const theme = useTheme();

  return (
    <Card
      mode="elevated"
      style={[styles.card, { backgroundColor: theme.colors.surface }, style]}
      onPress={onPress}
    >
      <Card.Content>
        <Text variant="titleLarge" style={{ color: theme.colors.onSurface }}>
          {title}
        </Text>
        {subtitle && (
          <Text
            variant="bodyMedium"
            style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
          >
            {subtitle}
          </Text>
        )}
      </Card.Content>
      {onPress && (
        <Card.Actions>
          <Button mode="text" onPress={onPress}>
            {buttonText}
          </Button>
        </Card.Actions>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  subtitle: {
    marginTop: 4,
    opacity: 0.7,
  },
});

export default ExampleCard;

