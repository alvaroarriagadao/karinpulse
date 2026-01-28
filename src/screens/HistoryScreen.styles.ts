import { StyleSheet, Dimensions } from 'react-native';
import { MD3Theme } from 'react-native-paper';

const { width } = Dimensions.get('window');

export const createStyles = (theme: MD3Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.dark ? '#121212' : '#F5F7FA',
  },
  headerBackground: {
    backgroundColor: theme.colors.primary,
    height: 180,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 0,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingBottom: 50,
    paddingTop: 70,
  },
  headerContent: {
    marginBottom: 28,
    zIndex: 1,
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontSize: 32,
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerSubtitle: {
    color: '#FFFFFF',
    marginTop: 6,
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.2,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  // Summary Card
  summaryCard: {
    backgroundColor: theme.dark ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 26,
    padding: 28,
    marginBottom: 24,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: 20,
    letterSpacing: 0.3,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statEmoji: {
    fontSize: 38,
    marginBottom: 6,
  },
  statCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
    letterSpacing: 0.2,
  },
  statLabel: {
    fontSize: 13,
    color: theme.dark ? '#B0B0B0' : '#616161',
    marginTop: 4,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  // Calendar Grid
  calendarCard: {
    backgroundColor: theme.dark ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 26,
    padding: 24,
    marginBottom: 24,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
  },
  calendarTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: 20,
    letterSpacing: 0.3,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  dayLabel: {
    width: (width - 108) / 7,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    color: theme.dark ? '#B0B0B0' : '#616161',
    letterSpacing: 0.2,
  },
  dayCell: {
    width: (width - 108) / 7,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 5,
  },
  dayCellEmpty: {
    backgroundColor: theme.dark ? '#2C2C2C' : '#F0F0F0',
  },
  dayEmoji: {
    fontSize: 22,
  },
  dayNumber: {
    fontSize: 10,
    color: theme.dark ? '#888' : '#666',
    marginTop: 3,
    fontWeight: '600',
  },
  // Help Card (Ley Karin)
  helpCard: {
    backgroundColor: theme.dark ? 'rgba(255, 183, 77, 0.12)' : '#FFF3E0',
    borderRadius: 26,
    padding: 24,
    marginBottom: 24,
    elevation: 4,
    borderWidth: 2,
    borderColor: theme.dark ? 'rgba(255, 183, 77, 0.3)' : '#FFB74D',
  },
  helpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  helpIcon: {
    marginRight: 14,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.dark ? '#FFB74D' : '#E65100',
    flex: 1,
    letterSpacing: 0.3,
  },
  helpText: {
    fontSize: 15,
    color: theme.dark ? '#D0D0D0' : '#5D4037',
    lineHeight: 22,
    marginBottom: 14,
  },
  // Modal
  modalContainer: {
    backgroundColor: theme.dark ? '#1E1E1E' : '#FFFFFF',
    padding: 28,
    margin: 20,
    borderRadius: 26,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 20,
    letterSpacing: 0.3,
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.onSurfaceVariant,
  },
  modalStep: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  modalStepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  modalStepNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  modalStepText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.onSurface,
  },
});
