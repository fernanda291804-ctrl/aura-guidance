import { useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, ChevronDown, Sparkles, Sun, ShieldAlert, Compass } from 'lucide-react';
import { NUMBER_MEANINGS, NUMBER_LABELS, NUMBER_DESCRIPTIONS, NUMBER_PROFILES } from '@/data/numberMeanings';
import BottomNav from '@/components/BottomNav';

const SECTIONS: { key: 'energy' | 'positive' | 'negative' | 'learning'; label: string; icon: React.ElementType }[] = [
  { key: 'energy', label: 'Esencia', icon: Sparkles },
  { key: 'positive', label: 'Luz: Donde brillas', icon: Sun },
  { key: 'negative', label: 'Sombra: Tu desafío', icon: ShieldAlert },
  { key: 'learning', label: 'Misión', icon: Compass },
];

export default function NumberDetail() {
  const { type } = useParams<{ type: string }>();
  const { user } = useApp();
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState<string | null>(null);

  if (!user) return <Navigate to="/" replace />;
  if (!type || !(type in user.numbers)) return <Navigate to="/dashboard" replace />;

  const value = user.numbers[type as keyof typeof user.numbers];
  const meaning = NUMBER_MEANINGS[value];
  const label = NUMBER_LABELS[type] || type;
  const description = NUMBER_DESCRIPTIONS[type] || '';
  const profile = NUMBER_PROFILES[value];

  if (!meaning) return <Navigate to="/dashboard" replace />;

  const toggle = (key: string) => setOpenSection(prev => (prev === key ? null : key));

  return (
    <div className="min-h-screen pb-24 gradient-dashboard grain-overlay">
      <div className="px-6 pb-8 pt-12">
        <button onClick={() => navigate('/dashboard')} className="mb-4 flex items-center gap-1 text-sm text-on-gradient-muted font-lato">
          <ArrowLeft className="h-4 w-4" /> Volver
        </button>
        <h1 className="font-lora text-3xl font-bold text-on-gradient text-center">{label}</h1>
        <p className="mt-1 text-sm text-on-gradient-muted text-center font-lato">{description}</p>

        <div className="mt-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm shadow-glow animate-pulse-glow border-2 border-white/50">
           <span className="font-lora text-4xl font-bold text-on-gradient">{value}</span>
          </div>
        </div>
        {profile && (
          <p className="mt-3 text-center text-sm font-semibold text-on-gradient font-lato">{profile.title}</p>
        )}
      </div>

      <div className="mx-6 space-y-3">
        {value === 0 ? (
          <div className="rounded-2xl bg-white/90 backdrop-blur-md border border-white/50 shadow-card p-5">
            <p className="text-sm leading-relaxed text-muted-foreground font-lato whitespace-pre-line">
              Representa la HUMANIDAD y LA VIDA ETERNA. Éste sólo puede aparecer en el número de Don (1900, 2000) y si se tiene es un ser que maneja la energía de todos, de la humanidad pero si no vibra en armonía tiende a perderse en los deseos de todos y a irse con las masas con facilidad. Pierde totalmente su rumbo y su vida. Son seres que tiene claro el sentido del conjunto y de la evolución de la humanidad.
            </p>
          </div>
        ) : (
          SECTIONS.map(s => {
            const isOpen = openSection === s.key;
            return (
              <div key={s.key} className="rounded-2xl bg-white/90 backdrop-blur-md border border-white/50 shadow-card overflow-hidden transition-all">
                <button
                  onClick={() => toggle(s.key)}
                  className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors active:bg-white/70"
                >
                  <s.icon className="h-4 w-4 text-accent shrink-0" />
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
                      <p className="text-sm leading-relaxed text-muted-foreground font-lato whitespace-pre-line">{meaning[s.key]}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <BottomNav />
    </div>
  );
}
