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

export type DailyBotRate = {
  date: string;
  buy_rate: number;
  sell_rate: number;
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

// Get a daily, gap-free bot-rate series for the chart. A missing day inherits
// the most recently uploaded rate so the graph represents the rate in effect.
export async function getBotRateHistory(days: number = 30): Promise<DailyBotRate[]> {
  const now = new Date();

  const firstDay = new Date(now);
  firstDay.setHours(0, 0, 0, 0);
  firstDay.setDate(firstDay.getDate() - days + 1);

  const [historyResult, previousResult] = await Promise.all([
    supabase
      .from('bot_rates')
      .select('*')
      .gte('updated_at', firstDay.toISOString())
      .lte('updated_at', now.toISOString())
      .order('updated_at', { ascending: true }),
    supabase
      .from('bot_rates')
      .select('*')
      .lt('updated_at', firstDay.toISOString())
      .order('updated_at', { ascending: false })
      .limit(1),
  ]);

  if (historyResult.error || previousResult.error) {
    console.error('Error fetching bot rate history:', historyResult.error || previousResult.error);
    return [];
  }

  const rates = [
    ...((previousResult.data || []) as BotRate[]),
    ...((historyResult.data || []) as BotRate[]),
  ].filter((rate): rate is BotRate & { updated_at: string } => Boolean(rate.updated_at));

  let latestRate: BotRate | undefined = rates[0];
  const dailyRates: DailyBotRate[] = [];

  for (let offset = 0; offset < days; offset += 1) {
    const day = new Date(firstDay);
    day.setDate(firstDay.getDate() + offset);
    const nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);

    const updatesForDay = rates.filter((rate) => {
      const updatedAt = new Date(rate.updated_at);
      return updatedAt >= day && updatedAt < nextDay;
    });

    if (updatesForDay.length > 0) {
      latestRate = updatesForDay[updatesForDay.length - 1];
    }

    if (latestRate) {
      dailyRates.push({
        date: [day.getFullYear(), day.getMonth() + 1, day.getDate()]
          .map((part) => String(part).padStart(2, '0'))
          .join('-'),
        buy_rate: latestRate.buy_rate,
        sell_rate: latestRate.sell_rate,
      });
    }
  }

  return dailyRates;
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
