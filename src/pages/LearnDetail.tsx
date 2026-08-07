import { useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, ChevronDown, Sparkles, Zap, Sun, ShieldAlert, Heart, Compass } from 'lucide-react';
import { NUMBER_PROFILES, NUMBER_LEARN, NumberLearn } from '@/data/numberMeanings';

const LEARN_SECTIONS: { key: keyof NumberLearn; label: string; icon: React.ElementType }[] = [
  { key: 'descripcion', label: 'Descripción', icon: Sparkles },
  { key: 'aspectos', label: 'Aspectos principales de su energía', icon: Zap },
  { key: 'luz', label: 'Estado de luz (Virtudes)', icon: Sun },
  { key: 'sombra', label: 'Estado de sombra (Desequilibrios)', icon: ShieldAlert },
  { key: 'relaciones', label: 'Dinámica en las relaciones', icon: Heart },
  { key: 'mision', label: 'Su misión evolutiva', icon: Compass },
];

export default function LearnDetail() {
  const { num } = useParams<{ num: string }>();
  const { user } = useApp();
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState<string | null>(null);

  if (!user) return <Navigate to="/" replace />;

  const number = Number(num);
  const profile = NUMBER_PROFILES[number];
  const learn = NUMBER_LEARN[number];

  if (!profile || !learn) return <Navigate to="/learn" replace />;

  const toggle = (key: string) => setOpenSection(prev => (prev === key ? null : key));

  const renderAccordion = (items: { key: string; label: string; icon: React.ElementType; text: string }[]) => (
    <>
      {items.map(s => {
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
                  <div className="space-y-2">
                    {s.text.split('\n\n').map((chunk, i) => {
                      const colonIdx = chunk.indexOf(':');
                      if (colonIdx > 0 && colonIdx < 40) {
                        const heading = chunk.slice(0, colonIdx);
                        const body = chunk.slice(colonIdx + 1).trim();
                        return (
                          <p key={i} className="text-sm leading-relaxed text-muted-foreground font-lato">
                            <span className="font-bold text-foreground">{heading}:</span> {body}
                          </p>
                        );
                      }
                      return (
                        <p key={i} className="text-sm leading-relaxed text-muted-foreground font-lato">
                          {chunk}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen pb-24 md:pb-8 gradient-dashboard grain-overlay">
      <div className="px-6 pb-8 pt-12">
        <button onClick={() => navigate('/learn')} className="mb-4 flex items-center gap-1 text-sm text-on-gradient-muted font-lato">
          <ArrowLeft className="h-4 w-4" /> Volver
        </button>
        <h1 className="font-lora text-2xl font-bold text-on-gradient">{profile.title}</h1>
        <p className="mt-1 text-sm text-on-gradient-muted font-lato">{profile.subtitles}</p>

        <div className="mt-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm shadow-glow animate-pulse-glow border-2 border-white/50">
            <span className="font-lora text-4xl font-bold text-on-gradient">{number}</span>
          </div>
        </div>

        <p className="mt-3 text-center text-xs font-semibold text-on-gradient font-lato">{profile.energyType}</p>
      </div>

      <div className="mx-6 space-y-3">
        {renderAccordion(LEARN_SECTIONS.map(s => ({ key: s.key, label: s.label, icon: s.icon, text: learn[s.key] })))}
      </div>

    </div>
  );
}
