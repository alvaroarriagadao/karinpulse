import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Button, useTheme, Appbar } from 'react-native-paper';

import { ExampleCard } from '@/components';
import { useRootNavigation } from '@/hooks';
import { useAuth } from '@/store/AuthContext';

const DATA = [
  { id: '1', title: 'Item 1 - Material Design' },
  { id: '2', title: 'Item 2 - React Native Paper' },
  { id: '3', title: 'Item 3 - Expo Go' },
];

const HomeScreen = () => {
  const theme = useTheme();
  const rootNavigation = useRootNavigation();
  const { user } = useAuth();

  const renderItem = ({ item }: { item: { id: string; title: string } }) => (
    <ExampleCard
      title={item.title}
      subtitle={`Subtitle for ${item.title}`}
      onPress={() => console.log('Pressed')}
      buttonText="Action"
    />
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header>
        <Appbar.Content title="Home" />
        <Appbar.Action icon="magnify" onPress={() => {}} />
      </Appbar.Header>

      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Bienvenido a KarinPulse
        </Text>
        {user && (
          <Text variant="bodyLarge" style={styles.subtitle}>
            Hola, {user.fullName}
          </Text>
        )}
        <Text variant="bodyMedium" style={styles.description}>
          Termómetro Emocional - Registra tu estado de ánimo en menos de 10 segundos
        </Text>

        <Button
          mode="contained"
          onPress={() => rootNavigation.navigate('Details', { id: 42 })}
          style={styles.button}
          icon="arrow-right"
        >
          Go to Details
        </Button>

        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  subtitle: {
    marginBottom: 8,
    opacity: 0.7,
    fontWeight: '600',
  },
  description: {
    marginBottom: 24,
    opacity: 0.6,
  },
  button: {
    marginBottom: 24,
  },
  list: {
    paddingBottom: 16,
  },
});

export default HomeScreen;
