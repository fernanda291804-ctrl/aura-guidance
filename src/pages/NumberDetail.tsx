import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { ArrowLeft } from 'lucide-react';
import { NUMBER_MEANINGS, NUMBER_LABELS } from '@/data/numberMeanings';
import BottomNav from '@/components/BottomNav';

const SECTION_COLORS = {
  energy: { bg: 'bg-secondary', border: 'border-primary', label: 'Energía' },
  positive: { bg: 'bg-success/10', border: 'border-success', label: 'Positivo' },
  negative: { bg: 'bg-destructive/10', border: 'border-destructive', label: 'Negativo' },
  learning: { bg: 'bg-accent', border: 'border-primary', label: 'Aprendizaje' },
};

export default function NumberDetail() {
  const { type } = useParams<{ type: string }>();
  const { user } = useApp();
  const navigate = useNavigate();

  if (!user) return <Navigate to="/" replace />;
  if (!type || !(type in user.numbers)) return <Navigate to="/dashboard" replace />;

  const value = user.numbers[type as keyof typeof user.numbers];
  const meaning = NUMBER_MEANINGS[value];
  const label = NUMBER_LABELS[type] || type;

  if (!meaning) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-background pb-24 liquid-light grain-overlay">
      <div className="gradient-aura px-6 pb-8 pt-12">
        <button onClick={() => navigate('/dashboard')} className="mb-4 flex items-center gap-1 text-sm text-body">
          <ArrowLeft className="h-4 w-4" /> Volver
        </button>
        <h1 className="font-lora text-3xl font-bold text-heading text-center">{label}</h1>
        <p className="mt-1 text-sm text-body text-center">{meaning.name}</p>

        {/* Central orb */}
        <div className="mt-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-card shadow-glow animate-pulse-glow border-2 border-primary/30">
            <span className="font-lora text-4xl font-bold text-primary">{value}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 px-6 mt-4">
        {(Object.keys(SECTION_COLORS) as Array<keyof typeof SECTION_COLORS>).map(key => (
          <div key={key} className={`glass rounded-2xl p-5 shadow-soft border-l-4 ${SECTION_COLORS[key].border}`}>
            <h3 className="mb-2 font-lora text-sm font-bold uppercase tracking-wider text-primary">
              {SECTION_COLORS[key].label}
            </h3>
            <p className="text-sm leading-relaxed text-body">{meaning[key]}</p>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
