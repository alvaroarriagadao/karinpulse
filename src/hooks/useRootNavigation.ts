import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';

/**
 * Hook personalizado para navegación en el Root Stack Navigator
 * 
 * Útil cuando necesitas navegar desde un screen dentro de TabNavigator
 * hacia un screen del RootNavigator (como Details)
 * 
 * @example
 * const rootNavigation = useRootNavigation();
 * rootNavigation.navigate('Details', { id: 42 });
 */
export const useRootNavigation = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  // Si estamos en un nested navigator (TabNavigator), obtenemos el parent
  const rootNavigation = navigation.getParent<NativeStackNavigationProp<RootStackParamList>>() || navigation;
  
  return rootNavigation;
};

