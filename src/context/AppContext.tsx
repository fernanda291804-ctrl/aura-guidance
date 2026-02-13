import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  insight: {
    reason: string;
    advice: string;
    actions: string[];
  };
}

interface AppState {
  user: UserProfile | null;
  consultations: Consultation[];
  setUser: (user: UserProfile) => void;
  addConsultation: (c: Consultation) => void;
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

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);

  const addConsultation = (c: Consultation) => {
    setConsultations(prev => [c, ...prev]);
  };

  return (
    <AppContext.Provider value={{ user, consultations, setUser, addConsultation }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
