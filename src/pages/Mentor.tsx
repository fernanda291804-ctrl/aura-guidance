import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Navigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import MentorChat from '@/components/MentorChat';
import { Briefcase, MapPin, Heart } from 'lucide-react';

type Scenario = 'work' | 'relocation' | 'relationship';

const SCENARIOS = [
  { id: 'work' as Scenario, icon: Briefcase, title: 'Trabajo', desc: 'Carrera y camino profesional', color: 'bg-[hsl(var(--theme-work-1)/0.4)]' },
  { id: 'relocation' as Scenario, icon: MapPin, title: 'Mudanza', desc: 'Nuevos comienzos y destinos', color: 'bg-[hsl(var(--theme-moving-1)/0.4)]' },
  { id: 'relationship' as Scenario, icon: Heart, title: 'Relación', desc: 'Amor y conexiones', color: 'bg-[hsl(var(--theme-relation-1)/0.4)]' },
];

export default function Mentor() {
  const { user } = useApp();
  const [scenario, setScenario] = useState<Scenario | null>(null);

  if (!user) return <Navigate to="/" replace />;

  // If a scenario is selected, show the full-screen chat
  if (scenario) {
    return <MentorChat scenario={scenario} onBack={() => setScenario(null)} />;
  }

  // Scenario selector
  return (
    <div className="min-h-screen bg-background pb-24 liquid-light grain-overlay">
      <div className="gradient-aura px-6 pb-6 pt-12">
        <h1 className="font-lora text-2xl font-bold text-heading">Mentor</h1>
        <p className="mt-1 text-sm text-body">Elige un espacio de guía</p>
      </div>

      <div className="space-y-4 px-6 mt-6">
        {SCENARIOS.map(s => (
          <button
            key={s.id}
            onClick={() => setScenario(s.id)}
            className="glass flex w-full items-center gap-4 rounded-2xl p-5 shadow-soft text-left transition-transform active:scale-[0.98] hover:shadow-card"
          >
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${s.color}`}>
              <s.icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-lora text-base font-semibold text-heading">{s.title}</h3>
              <p className="text-xs text-body">{s.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
