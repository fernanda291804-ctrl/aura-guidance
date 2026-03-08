import { useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, ChevronDown, Sparkles, Sun, ShieldAlert, Compass } from 'lucide-react';
import { NUMBER_PROFILES } from '@/data/numberMeanings';
import BottomNav from '@/components/BottomNav';

const SECTIONS: { key: 'aspectos' | 'positivo' | 'negativo' | 'mision'; label: string; icon: React.ElementType }[] = [
  { key: 'aspectos', label: 'Aspectos principales', icon: Sparkles },
  { key: 'positivo', label: 'Características positivas', icon: Sun },
  { key: 'negativo', label: 'Características negativas', icon: ShieldAlert },
  { key: 'mision', label: 'Misión', icon: Compass },
];

export default function LearnDetail() {
  const { num } = useParams<{ num: string }>();
  const { user } = useApp();
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState<string | null>(null);

  if (!user) return <Navigate to="/" replace />;

  const number = Number(num);
  const profile = NUMBER_PROFILES[number];

  if (!profile) return <Navigate to="/learn" replace />;

  const toggle = (key: string) => setOpenSection(prev => (prev === key ? null : key));

  return (
    <div className="min-h-screen pb-24 gradient-dashboard grain-overlay">
      <div className="px-6 pb-8 pt-12">
        <button onClick={() => navigate('/learn')} className="mb-4 flex items-center gap-1 text-sm text-white/80 font-lato">
          <ArrowLeft className="h-4 w-4" /> Volver
        </button>
        <h1 className="font-lora text-2xl font-bold text-white text-center">{profile.title}</h1>
        <p className="mt-1 text-sm text-white/80 text-center font-lato">{profile.subtitles}</p>

        <div className="mt-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm shadow-glow animate-pulse-glow border-2 border-white/40">
            <span className="font-lora text-4xl font-bold text-white">{number}</span>
          </div>
        </div>

        <p className="mt-3 text-center text-xs font-semibold text-white/90 font-lato">{profile.energyType}</p>
      </div>

      <div className="mx-6 space-y-3">
        {SECTIONS.map(s => {
          const isOpen = openSection === s.key;
          return (
            <div key={s.key} className="rounded-2xl bg-white/90 backdrop-blur-md border border-white/50 shadow-card overflow-hidden transition-all">
              <button
                onClick={() => toggle(s.key)}
                className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors active:bg-white/70"
              >
                <s.icon className="h-4 w-4 text-primary shrink-0" />
                <span className="flex-1 font-lora text-sm font-bold text-heading">{s.label}</span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              <div
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden">
                  <div className="px-5 pb-5 pt-0">
                    <div className="h-px bg-border/30 mb-4" />
                    <p className="text-sm leading-relaxed text-muted-foreground font-lato">{profile[s.key]}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
}