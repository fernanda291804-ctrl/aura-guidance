import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, ConsultationRow } from '@/lib/supabase';

export interface UserProfile {
  name: string;
  birthDate: string; // DD/MM/YYYY
  numbers: {
    soul: number;
    personality: number;
    pastLife: number;
    gift: number;
    path: number;
  };
}

export interface Consultation {
  id: string;
  scenario: 'work' | 'relocation' | 'relationship';
  date: string;
  conversationId?: string;
  insight: {
    reason: string;
    advice: string;
    actions: string[];
  };
}

interface AppState {
  // Auth
  session: Session | null;
  authUser: User | null;
  authLoading: boolean;
  // Profile
  user: UserProfile | null;
  // Consultations
  consultations: Consultation[];
  // Actions
  setUser: (user: UserProfile) => void;
  addConsultation: (c: Consultation) => Promise<boolean>;
  loadConsultations: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AppContext = createContext<AppState | undefined>(undefined);

function reduceToSingleOr10(n: number): number {
  while (n > 10) {
    n = String(n).split('').reduce((a, b) => a + parseInt(b), 0);
  }
  return n;
}

export function calculateNumbers(_name: string, birthDate: string) {
  // Parse DD/MM/YYYY
  const parts = birthDate.split('/');
  const day = parseInt(parts[0]) || 1;
  const month = parseInt(parts[1]) || 1;
  const year = parseInt(parts[2]) || 2000;

  // Soul (Alma): Sum digits of the Day
  const dayDigitSum = String(day).split('').reduce((s, d) => s + parseInt(d), 0);
  const soul = reduceToSingleOr10(dayDigitSum);

  // Personality (Personalidad): Use the Month digit. If 11→2, 12→3, else keep.
  let personality: number;
  if (month >= 10) {
    personality = String(month).split('').reduce((s, d) => s + parseInt(d), 0);
  } else {
    personality = month;
  }

  // Gift (Don): Sum last two digits of Year, reduce to single or 10
  const lastTwo = year % 100;
  const giftSum = String(lastTwo).split('').reduce((s, d) => s + parseInt(d), 0);
  const gift = reduceToSingleOr10(giftSum);

  // Past Life (Vida Pasada): Sum all 4 digits of Year, reduce to single or 10
  const yearSum = String(year).split('').reduce((s, d) => s + parseInt(d), 0);
  const pastLife = reduceToSingleOr10(yearSum);

  // Path (Camino): Soul + Personality + Past Life, reduce to single or 10
  const path = reduceToSingleOr10(soul + personality + pastLife);

  return { soul, personality, pastLife, gift, path };
}

function rowToConsultation(row: ConsultationRow): Consultation {
  return {
    id: row.id,
    scenario: row.scenario,
    date: new Date(row.created_at).toLocaleDateString('es-ES'),
    conversationId: row.conversation_id ?? undefined,
    insight: {
      reason: row.insight_reason || '',
      advice: row.insight_advice || '',
      actions: row.insight_actions || [],
    },
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUserState] = useState<UserProfile | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);

  // Initialize auth session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthUser(session?.user ?? null);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthUser(session?.user ?? null);
      setAuthLoading(false);
      // Clear local state on sign out
      if (!session) {
        setUserState(null);
        setConsultations([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load profile when auth user changes
  useEffect(() => {
    if (!authUser) return;
    supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single()
      .then(({ data }) => {
        if (data) {
          const parts = data.birth_date.split('T')[0].split('-'); // YYYY-MM-DD
          const birthDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
          setUserState({
            name: data.name,
            birthDate,
            numbers: {
              soul: data.soul,
              personality: data.personality,
              pastLife: data.past_life,
              gift: data.gift,
              path: data.path,
            },
          });
        }
      });
  }, [authUser]);

  const setUser = (profile: UserProfile) => {
    setUserState(profile);
  };

  const addConsultation = async (c: Consultation): Promise<boolean> => {
    if (authUser) {
      // Only include conversation_id if the column exists (migration 002)
      const insertPayload: Record<string, unknown> = {
        user_id: authUser.id,
        scenario: c.scenario,
        insight_reason: c.insight.reason,
        insight_advice: c.insight.advice,
        insight_actions: c.insight.actions,
      };
      if (c.conversationId) insertPayload.conversation_id = c.conversationId;

      const { error } = await supabase.from('consultations').insert(insertPayload);
      if (error) {
        console.error('Error saving consultation:', error.message);
        return false;
      }
      // Reload from DB
      const { data } = await supabase
        .from('consultations')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false });
      if (data) setConsultations(data.map(rowToConsultation));
      return true;
    } else {
      setConsultations(prev => [c, ...prev]);
      return true;
    }
  };

  const loadConsultations = async () => {
    if (!authUser) return;
    const { data } = await supabase
      .from('consultations')
      .select('*')
      .eq('user_id', authUser.id)
      .order('created_at', { ascending: false });
    if (data) {
      setConsultations(data.map(rowToConsultation));
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AppContext.Provider value={{
      session,
      authUser,
      authLoading,
      user,
      consultations,
      setUser,
      addConsultation,
      loadConsultations,
      signOut,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
