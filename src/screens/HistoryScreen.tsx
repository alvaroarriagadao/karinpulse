import React, { useState, useEffect } from 'react';
import { View, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { Text, useTheme, Button, Portal, Modal, Divider } from 'react-native-paper';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useAuth } from '@/store/AuthContext';
import { createStyles } from './HistoryScreen.styles';
import { supabase } from '@/services';

type MoodType = 'muy_mal' | 'mal' | 'neutral' | 'bien' | 'excelente';

interface MoodEntry {
  mood: MoodType;
  created_at: string;
}

const MOOD_CONFIG = {
  muy_mal: { emoji: '😫', color: '#D32F2F', label: 'Muy Mal' },
  mal: { emoji: '😕', color: '#EF5350', label: 'Mal' },
  neutral: { emoji: '😐', color: '#FFB74D', label: 'Neutral' },
  bien: { emoji: '🙂', color: '#66BB6A', label: 'Bien' },
  excelente: { emoji: '🤩', color: '#2E7D32', label: 'Excelente' },
};

const HistoryScreen = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { user } = useAuth();

  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadMoodHistory();
    }
  }, [user?.id]);

  const loadMoodHistory = async () => {
    try {
      setLoading(true);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('daily_moods')
        .select('mood, created_at')
        .eq('user_id', user?.id)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMoodHistory(data || []);
    } catch (error) {
      console.error('Error loading mood history:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calcular estadísticas de la semana
  const getWeeklyStats = () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weekMoods = moodHistory.filter(
      entry => new Date(entry.created_at) >= sevenDaysAgo
    );

    const stats = {
      muy_mal: 0,
      mal: 0,
      neutral: 0,
      bien: 0,
      excelente: 0,
    };

    weekMoods.forEach(entry => {
      stats[entry.mood]++;
    });

    return stats;
  };

  // Generar calendario de últimos 30 días
  const generateCalendar = () => {
    const calendar = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      const moodEntry = moodHistory.find(
        entry => entry.created_at.split('T')[0] === dateString
      );

      calendar.push({
        date: date.getDate(),
        fullDate: dateString,
        mood: moodEntry?.mood || null,
      });
    }

    return calendar;
  };

  // Organizar calendario en semanas
  const organizeIntoWeeks = (calendar: any[]) => {
    const weeks = [];
    for (let i = 0; i < calendar.length; i += 7) {
      weeks.push(calendar.slice(i, i + 7));
    }
    return weeks;
  };

  const stats = getWeeklyStats();
  const calendar = generateCalendar();
  const weeks = organizeIntoWeeks(calendar);

  // Calcular mood predominante
  const predominantMood = Object.entries(stats).reduce((a, b) =>
    stats[a[0] as MoodType] > stats[b[0] as MoodType] ? a : b
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />

      {/* Fondo Curvo Header */}
      <View style={styles.headerBackground} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Mi Historial</Text>
          <Text style={styles.headerSubtitle}>
            Evolución de tu bienestar emocional
          </Text>
        </View>

        {/* Resumen Semanal */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumen de esta semana</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>
                {MOOD_CONFIG[predominantMood[0] as MoodType]?.emoji}
              </Text>
              <Text style={styles.statLabel}>Predominante</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statCount}>{moodHistory.length}</Text>
              <Text style={styles.statLabel}>Registros</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statCount}>
                {stats.bien + stats.excelente}
              </Text>
              <Text style={styles.statLabel}>Días Positivos</Text>
            </View>
          </View>

          <Divider style={{ marginVertical: 16 }} />

          {/* Mini stats por emoji */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            {Object.entries(stats).map(([mood, count]) => (
              <View key={mood} style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 24 }}>
                  {MOOD_CONFIG[mood as MoodType].emoji}
                </Text>
                <Text style={{ fontSize: 14, fontWeight: 'bold', marginTop: 4 }}>
                  {count}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Calendario Visual */}
        <View style={styles.calendarCard}>
          <Text style={styles.calendarTitle}>Últimos 30 días</Text>

          {/* Encabezado de días */}
          <View style={styles.weekRow}>
            {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day, idx) => (
              <Text key={idx} style={styles.dayLabel}>
                {day}
              </Text>
            ))}
          </View>

          {/* Filas de semanas */}
          {weeks.map((week, weekIdx) => (
            <View key={weekIdx} style={styles.weekRow}>
              {week.map((day, dayIdx) => (
                <View
                  key={dayIdx}
                  style={[
                    styles.dayCell,
                    !day.mood && styles.dayCellEmpty,
                    day.mood && {
                      backgroundColor: `${MOOD_CONFIG[day.mood].color}20`,
                      borderWidth: 2,
                      borderColor: MOOD_CONFIG[day.mood].color,
                    },
                  ]}
                >
                  {day.mood ? (
                    <>
                      <Text style={styles.dayEmoji}>
                        {MOOD_CONFIG[day.mood].emoji}
                      </Text>
                      <Text style={styles.dayNumber}>{day.date}</Text>
                    </>
                  ) : (
                    <Text style={{ fontSize: 12, color: '#999' }}>
                      {day.date}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Tarjeta de Ayuda - Ley Karin */}
        <View style={styles.helpCard}>
          <View style={styles.helpHeader}>
            <Icon
              name="shield-check"
              size={28}
              color="#E65100"
              style={styles.helpIcon}
            />
            <Text style={styles.helpTitle}>Conoce tus derechos</Text>
          </View>
          <Text style={styles.helpText}>
            La Ley Karin te protege contra el acoso laboral y violencia en el
            trabajo. Tu bienestar es un derecho.
          </Text>
          <Button
            mode="contained"
            onPress={() => setModalVisible(true)}
            buttonColor="#FF6F00"
            textColor="#FFFFFF"
            icon="information"
          >
            Ver más información
          </Button>
        </View>
      </ScrollView>

      {/* Modal Ley Karin */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.modalTitle}>Ley Karin - Ley 21.643</Text>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>¿Qué es?</Text>
              <Text style={styles.modalText}>
                La Ley Karin modifica el Código del Trabajo para prevenir,
                investigar y sancionar el acoso laboral, sexual y la violencia
                en el trabajo.
              </Text>
            </View>

            <Divider style={{ marginVertical: 16 }} />

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>
                ¿Qué hacer si sufres acoso?
              </Text>

              <View style={styles.modalStep}>
                <View style={styles.modalStepNumber}>
                  <Text style={styles.modalStepNumberText}>1</Text>
                </View>
                <Text style={styles.modalStepText}>
                  <Text style={{ fontWeight: 'bold' }}>Documenta</Text> todo:
                  fechas, hechos, testigos, correos, mensajes.
                </Text>
              </View>

              <View style={styles.modalStep}>
                <View style={styles.modalStepNumber}>
                  <Text style={styles.modalStepNumberText}>2</Text>
                </View>
                <Text style={styles.modalStepText}>
                  <Text style={{ fontWeight: 'bold' }}>Denuncia</Text> ante tu
                  empleador por escrito (carta, correo).
                </Text>
              </View>

              <View style={styles.modalStep}>
                <View style={styles.modalStepNumber}>
                  <Text style={styles.modalStepNumberText}>3</Text>
                </View>
                <Text style={styles.modalStepText}>
                  Si no hay respuesta, denuncia ante la{' '}
                  <Text style={{ fontWeight: 'bold' }}>
                    Inspección del Trabajo
                  </Text>
                  .
                </Text>
              </View>

              <View style={styles.modalStep}>
                <View style={styles.modalStepNumber}>
                  <Text style={styles.modalStepNumberText}>4</Text>
                </View>
                <Text style={styles.modalStepText}>
                  Si es grave, puedes acudir a Tribunales o a la{' '}
                  <Text style={{ fontWeight: 'bold' }}>Fiscalía</Text> (si hay
                  delito).
                </Text>
              </View>
            </View>

            <Divider style={{ marginVertical: 16 }} />

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Contactos Útiles</Text>
              <Text style={styles.modalText}>
                • Inspección del Trabajo: 600 450 4000{'\n'}• Denuncia Online:
                www.dt.gob.cl{'\n'}• Fiscalía: 600 333 0000
              </Text>
            </View>

            <Button
              mode="contained"
              onPress={() => setModalVisible(false)}
              style={{ marginTop: 16 }}
            >
              Cerrar
            </Button>
          </ScrollView>
        </Modal>
      </Portal>
    </View>
  );
};

export default HistoryScreen;

