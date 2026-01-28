import { supabase } from './supabase';

export interface MoodEntry {
  id?: string;
  user_id: string;
  mood: 'muy_mal' | 'mal' | 'neutral' | 'bien' | 'excelente';
  comment?: string;
  tags?: string[];
  created_at?: string;
}

export const saveMood = async (entry: Omit<MoodEntry, 'id' | 'created_at'>) => {
  try {
    const { data, error } = await supabase
      .from('daily_moods')
      .insert(entry)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error saving mood:', error);
    return { data: null, error };
  }
};

export const checkTodayMood = async (userId: string) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const startDate = `${today}T00:00:00.000Z`;
    const endDate = `${today}T23:59:59.999Z`;

    const { data, error } = await supabase
      .from('daily_moods')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 es "no rows returned"
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

