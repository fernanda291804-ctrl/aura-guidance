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

function reduceToSingle(n: number): number {
  while (n > 9 && n !== 11 && n !== 22) {
    n = String(n).split('').reduce((a, b) => a + parseInt(b), 0);
  }
  return n;
}

function calcLetterValue(c: string): number {
  const val = c.toLowerCase().charCodeAt(0) - 96;
  return val > 0 && val <= 26 ? val : 0;
}

const VOWELS = 'aeiou';

export function calculateNumbers(name: string, birthDate: string) {
  const letters = name.replace(/[^a-zA-Z]/g, '');
  
  // Soul: vowels sum
  const vowelSum = letters.split('').filter(c => VOWELS.includes(c.toLowerCase())).reduce((s, c) => s + calcLetterValue(c), 0);
  const soul = reduceToSingle(vowelSum);

  // Personality: consonants sum
  const consSum = letters.split('').filter(c => !VOWELS.includes(c.toLowerCase())).reduce((s, c) => s + calcLetterValue(c), 0);
  const personality = reduceToSingle(consSum);

  // Path: birth date digits
  const dateDigits = birthDate.replace(/\D/g, '');
  const pathSum = dateDigits.split('').reduce((s, d) => s + parseInt(d), 0);
  const path = reduceToSingle(pathSum);

  // Past Life: day of birth
  const day = parseInt(birthDate.split('/')[0]) || 1;
  const pastLife = reduceToSingle(day);

  // Gift: month + day
  const month = parseInt(birthDate.split('/')[1]) || 1;
  const gift = reduceToSingle(day + month);

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
