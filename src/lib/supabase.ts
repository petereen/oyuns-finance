import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export type BotRate = {
  id: number;
  buy_rate: number;
  sell_rate: number;
  updated_at: string | null;
  created_at: string | null;
};

export type BusinessRate = {
  id: number;
  b2c_rate: number;
  b2b_rate: number;
  updated_at: string | null;
  created_at: string | null;
};

// Get latest individual (bot) rate
export async function getLatestBotRate() {
  const { data, error } = await supabase
    .from('bot_rates')
    .select('*')
    .order('updated_at', { ascending: false, nullsFirst: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching bot rates:', error);
    return null;
  }

  return data as BotRate;
}

// Get latest business rate
export async function getLatestBusinessRate() {
  const { data, error } = await supabase
    .from('business_rates')
    .select('*')
    .order('updated_at', { ascending: false, nullsFirst: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching business rates:', error);
    return null;
  }

  return data as BusinessRate;
}

// Get historical bot rates for chart
export async function getBotRateHistory(days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('bot_rates')
    .select('*')
    .gte('updated_at', startDate.toISOString())
    .order('updated_at', { ascending: true });

  if (error) {
    console.error('Error fetching bot rate history:', error);
    return [];
  }

  return data as BotRate[];
}

// Get historical business rates for chart
export async function getBusinessRateHistory(days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('business_rates')
    .select('*')
    .gte('updated_at', startDate.toISOString())
    .order('updated_at', { ascending: true });

  if (error) {
    console.error('Error fetching business rate history:', error);
    return [];
  }

  return data as BusinessRate[];
}
