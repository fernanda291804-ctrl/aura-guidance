import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { ArrowLeft } from 'lucide-react';
import { NUMBER_PROFILES } from '@/data/numberMeanings';
import BottomNav from '@/components/BottomNav';

const SECTIONS: { key: 'aspectos' | 'positivo' | 'negativo' | 'mision'; label: string }[] = [
  { key: 'aspectos', label: 'Aspectos principales' },
  { key: 'positivo', label: 'Características positivas' },
  { key: 'negativo', label: 'Características negativas' },
  { key: 'mision', label: 'Misión' },
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

      <div className="mx-6 rounded-2xl bg-white/90 backdrop-blur-md p-6 border border-white/50 shadow-card">
        {SECTIONS.map((s, i) => (
          <div key={s.key} className={`py-5 ${i < SECTIONS.length - 1 ? 'border-b' : ''}`} style={{ borderColor: 'hsla(225, 25%, 70%, 0.2)' }}>
            <h3 className="font-lora text-sm font-bold text-heading mb-2">{s.label}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground font-lato">{profile[s.key]}</p>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
