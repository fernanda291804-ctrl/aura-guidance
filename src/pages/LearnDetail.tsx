import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { ArrowLeft } from 'lucide-react';
import { NUMBER_PROFILES } from '@/data/numberMeanings';
import BottomNav from '@/components/BottomNav';

const SECTIONS = [
  { key: 'aspectos' as const, label: 'Aspectos Principales', border: 'border-primary' },
  { key: 'positivo' as const, label: 'Características Positivas', border: 'border-success' },
  { key: 'negativo' as const, label: 'Características Negativas', border: 'border-destructive' },
  { key: 'mision' as const, label: 'Misión', border: 'border-accent-foreground' },
];

export default function LearnDetail() {
  const { num } = useParams<{ num: string }>();
  const { user } = useApp();
  const navigate = useNavigate();

  if (!user) return <Navigate to="/" replace />;

  const number = Number(num);
  const profile = NUMBER_PROFILES[number];

  if (!profile) return <Navigate to="/learn" replace />;

  return (
    <div className="min-h-screen bg-background pb-24 liquid-light grain-overlay">
      <div className="gradient-aura px-6 pb-8 pt-12">
        <button onClick={() => navigate('/learn')} className="mb-4 flex items-center gap-1 text-sm text-body">
          <ArrowLeft className="h-4 w-4" /> Volver
        </button>
        <h1 className="font-lora text-2xl font-bold text-heading text-center">{profile.title}</h1>
        <p className="mt-1 text-sm text-body text-center">{profile.subtitles}</p>

        {/* Central orb */}
        <div className="mt-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-card shadow-glow animate-pulse-glow border-2 border-primary/30">
            <span className="font-lora text-4xl font-bold text-primary">{number}</span>
          </div>
        </div>

        <p className="mt-3 text-center text-xs font-semibold text-primary">{profile.energyType}</p>
      </div>

      <div className="space-y-4 px-6 mt-4">
        {SECTIONS.map(({ key, label, border }) => (
          <div key={key} className={`glass rounded-2xl p-5 shadow-soft border-l-4 ${border}`}>
            <h3 className="mb-2 font-lora text-sm font-bold uppercase tracking-wider text-primary">
              {label}
            </h3>
            <p className="text-sm leading-relaxed text-body font-lato">{profile[key]}</p>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
