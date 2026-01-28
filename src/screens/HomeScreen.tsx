import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  Alert,
  Animated,
  StatusBar,
} from 'react-native';
import {
  Text,
  useTheme,
  Surface,
  TextInput,
  Button,
  Chip,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useAuth } from '@/store/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStyles } from './HomeScreen.styles';
import { saveMood, checkTodayMood } from '@/services';
import { TabParamList } from '@/navigation/types';

// Habilitar LayoutAnimation en Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Tipos de estado de ánimo
type MoodType = 'muy_mal' | 'mal' | 'neutral' | 'bien' | 'excelente';

interface MoodOption {
  id: MoodType;
  label: string;
  emoji: string;
  color: string;
  value: number;
}

const MOODS: MoodOption[] = [
  { id: 'muy_mal', label: 'Muy Mal', emoji: '😫', color: '#D32F2F', value: 1 },
  { id: 'mal', label: 'Mal', emoji: '😕', color: '#EF5350', value: 2 },
  { id: 'neutral', label: 'Neutral', emoji: '😐', color: '#FFB74D', value: 3 },
  { id: 'bien', label: 'Bien', emoji: '🙂', color: '#66BB6A', value: 4 },
  { id: 'excelente', label: 'Excelente', emoji: '🤩', color: '#2E7D32', value: 5 },
];

const TAGS = [
  { id: 'sobrecarga', label: 'Sobrecarga' },
  { id: 'clima', label: 'Clima Laboral' },
  { id: 'trato', label: 'Trato Inadecuado' },
  { id: 'infraestructura', label: 'Infraestructura' },
  { id: 'otro', label: 'Otro' },
];

// Componente animado para el botón de mood
const MoodButton = ({ 
  mood, 
  isSelected, 
  onPress, 
  styles 
}: { 
  mood: MoodOption; 
  isSelected: boolean; 
  onPress: () => void;
  styles: any;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isSelected ? 1.2 : 1,
      friction: 5,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [isSelected]);

  return (
    <View style={styles.moodItemContainer}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Animated.View
          style={[
            styles.moodButton,
            {
              transform: [{ scale: scaleAnim }],
              backgroundColor: isSelected ? '#FFFFFF' : '#F8F9FA',
              borderColor: isSelected ? mood.color : 'transparent',
              elevation: isSelected ? 4 : 0,
              shadowOpacity: isSelected ? 0.2 : 0,
            }
          ]}
        >
          <Text style={styles.moodEmoji}>{mood.emoji}</Text>
        </Animated.View>
      </TouchableOpacity>
      <Text style={[
        styles.moodLabel,
        isSelected && { color: mood.color, fontWeight: 'bold' }
      ]}>
        {mood.label}
      </Text>
    </View>
  );
};

const HomeScreen = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { user } = useAuth();
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  
  // Estados
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [hasVotedToday, setHasVotedToday] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastMood, setLastMood] = useState<MoodType | null>(null);

  // Cargar estado del voto al iniciar
  useEffect(() => {
    if (user?.id) {
      checkVoteStatus();
    }
  }, [user?.id]);

  const checkVoteStatus = async () => {
    try {
      if (!user?.id) return;

      // 1. Revisar caché local primero para velocidad
      const today = new Date().toISOString().split('T')[0];
      const localLastVote = await AsyncStorage.getItem(`lastVoteDate_${user.id}`);
      
      if (localLastVote === today) {
        setHasVotedToday(true);
        // Intentar recuperar qué votó (opcional, si lo guardáramos localmente)
        return;
      }

      // 2. Revisar en Supabase para consistencia
      const { data, error } = await checkTodayMood(user.id);
      
      if (data) {
        setHasVotedToday(true);
        setLastMood(data.mood as MoodType);
        // Sincronizar local
        await AsyncStorage.setItem(`lastVoteDate_${user.id}`, today);
      }
    } catch (error) {
      console.error('Error verificando voto:', error);
    }
  };

  const handleMoodSelect = (mood: MoodType) => {
    if (hasVotedToday) return;
    
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    
    // Toggle: Si ya está seleccionado, lo deselecciona
    if (selectedMood === mood) {
      setSelectedMood(null);
    } else {
      setSelectedMood(mood);
      
      // Resetear tags y comentario si cambia a positivo
      const moodObj = MOODS.find(m => m.id === mood);
      if (moodObj && moodObj.value >= 3) {
        setSelectedTags([]);
        setComment('');
      }
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSubmit = async () => {
    if (!selectedMood || !user?.id) return;

    setIsSubmitting(true);
    
    try {
      // Guardar en Supabase
      const { error } = await saveMood({
        user_id: user.id,
        mood: selectedMood,
        comment: comment.trim(),
        tags: selectedTags,
      });

      if (error) throw error;

      // Actualizar estado local
      const today = new Date().toISOString().split('T')[0];
      await AsyncStorage.setItem(`lastVoteDate_${user.id}`, today);
      
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      setLastMood(selectedMood);
      setHasVotedToday(true);
      setSelectedMood(null);
      
      Alert.alert(
        '¡Gracias!',
        'Tu estado ha sido registrado correctamente.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error guardando voto:', error);
      Alert.alert('Error', 'No se pudo registrar tu estado. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para resetear el estado (Solo para desarrollo)
  const handleResetDev = async () => {
    if (!user?.id) return;
    await AsyncStorage.removeItem(`lastVoteDate_${user.id}`);
    setHasVotedToday(false);
    setLastMood(null);
    setSelectedMood(null);
    setComment('');
    setSelectedTags([]);
    Alert.alert('Reset Dev', 'Estado reseteado. Puedes volver a votar.');
  };

  const isNegativeMood = selectedMood === 'muy_mal' || selectedMood === 'mal';
  const currentMoodObj = MOODS.find(m => m.id === selectedMood);
  const lastMoodObj = MOODS.find(m => m.id === lastMood);

  // Obtener saludo según la hora
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 19) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
      
      {/* Fondo Curvo Header */}
      <View style={styles.headerBackground} />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Encabezado */}
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>
            {getGreeting()}, {user?.fullName?.split(' ')[0] || 'Hola'}
          </Text>
          <Text style={styles.subGreeting}>
            ¿Cómo te sientes hoy?
          </Text>
        </View>

        {/* Contenido Principal */}
        {hasVotedToday ? (
          <View>
            <Surface style={styles.votedCard}>
              <Text style={styles.votedEmoji}>
                {lastMoodObj?.emoji || '✅'}
              </Text>
              <Text variant="headlineSmall" style={styles.votedTitle}>
                ¡Registro Completado!
              </Text>
              <Text variant="bodyLarge" style={styles.votedSubtitle}>
                Hoy te sientes: <Text style={{fontWeight: 'bold', color: lastMoodObj?.color}}>{lastMoodObj?.label}</Text>{'\n'}
                Gracias por compartir tu estado.{'\n'}
                Tu bienestar es importante.
              </Text>
             <Button 
               mode="contained" 
               onPress={() => navigation.navigate('History')} 
               style={{ marginTop: 24 }}
               buttonColor={theme.colors.primary}
               icon="chart-line"
             >
               Ver mi Historial
             </Button>
            </Surface>

            {/* Botón temporal de desarrollo */}
            <Button 
              onPress={handleResetDev} 
              style={{ marginTop: 32 }} 
              mode="text" 
              compact
              labelStyle={{ fontSize: 10, color: theme.colors.outline }}
            >
              [DEV] Resetear Voto
            </Button>
          </View>
        ) : (
          <Surface style={styles.card}>
            <Text style={styles.sectionTitle}>
              Selecciona tu estado
            </Text>
            
            <View style={styles.moodContainer}>
              {MOODS.map((mood) => (
                <MoodButton
                  key={mood.id}
                  mood={mood}
                  isSelected={selectedMood === mood.id}
                  onPress={() => handleMoodSelect(mood.id)}
                  styles={styles}
                />
              ))}
            </View>

            {/* Sección de Feedback Condicional */}
            {selectedMood && (
              <View style={styles.feedbackContainer}>
                {isNegativeMood ? (
                  <View style={styles.feedbackCard}>
                    <Text variant="titleMedium" style={styles.feedbackTitle}>
                      Lamentamos eso 😔
                    </Text>
                    <Text variant="bodyMedium" style={styles.feedbackSubtitle}>
                      ¿Quieres contarnos más?
                    </Text>
                    
                    <View style={styles.tagsContainer}>
                      {TAGS.map(tag => (
                        <Chip
                          key={tag.id}
                          selected={selectedTags.includes(tag.id)}
                          onPress={() => toggleTag(tag.id)}
                          showSelectedOverlay
                          style={[styles.chip, selectedTags.includes(tag.id) && styles.chipSelected]}
                          textStyle={{ fontSize: 12 }}
                        >
                          #{tag.label}
                        </Chip>
                      ))}
                    </View>
                  </View>
                ) : (
                  <View style={styles.positiveCard}>
                    <Text variant="headlineSmall" style={{ color: currentMoodObj?.color, fontWeight: 'bold' }}>
                      ¡Qué bien! 🎉
                    </Text>
                    <Text variant="bodyMedium" style={{ marginTop: 8, textAlign: 'center', opacity: 0.7 }}>
                      Nos alegra que tengas un buen día.
                    </Text>
                  </View>
                )}

                {/* Comentario opcional para TODOS los estados */}
                <View style={{ marginTop: 16 }}>
                  <Text variant="labelSmall" style={{ marginBottom: 8, opacity: 0.6 }}>
                    Comentario adicional (Opcional)
                  </Text>
                  <TextInput
                    mode="outlined"
                    placeholder="¿Algo más que quieras compartir?"
                    value={comment}
                    onChangeText={setComment}
                    multiline
                    numberOfLines={3}
                    style={styles.input}
                    outlineColor="transparent"
                    activeOutlineColor={currentMoodObj?.color}
                  />
                </View>

                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  style={[
                    styles.submitButton, 
                    { backgroundColor: currentMoodObj?.color || theme.colors.primary }
                  ]}
                  contentStyle={{ height: 48 }}
                  labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
                >
                  Registrar mi día
                </Button>
              </View>
            )}
          </Surface>
        )}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
