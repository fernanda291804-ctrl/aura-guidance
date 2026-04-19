import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY) as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Scenario = 'work' | 'relocation' | 'relationship';

export interface ProfileRow {
  id: string;
  name: string;
  birth_date: string;
  soul: number;
  personality: number;
  past_life: number;
  gift: number;
  path: number;
  created_at: string;
}

export interface ConversationRow {
  id: string;
  user_id: string;
  scenario: Scenario;
  title: string | null;
  created_at: string;
}

export interface MessageRow {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface ConsultationRow {
  id: string;
  user_id: string;
  scenario: Scenario;
  conversation_id: string | null;
  insight_reason: string | null;
  insight_advice: string | null;
  insight_actions: string[] | null;
  created_at: string;
}
