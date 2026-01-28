import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, useTheme, Appbar } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { RootStackParamList } from '@/navigation/types';

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

const DetailsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute<DetailsScreenRouteProp>();
  const { id } = route.params;

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Details" />
      </Appbar.Header>

      <View style={styles.content}>
        <Text variant="displaySmall" style={{ color: theme.colors.primary }}>
          Details Screen
        </Text>
        <Text variant="bodyLarge" style={styles.text}>
          You passed ID: {id}
        </Text>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          Go Back
        </Button>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    marginVertical: 16,
  },
  button: {
    marginTop: 16,
  },
});

export default DetailsScreen;
