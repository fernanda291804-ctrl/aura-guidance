import { useApp } from '@/context/AppContext';
import { Navigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import { User, Calendar, Hash } from 'lucide-react';
import { NUMBER_DESCRIPTIONS, NUMBER_PROFILES } from '@/data/numberMeanings';

export default function Profile() {
  const { user } = useApp();
  if (!user) return <Navigate to="/" replace />;

  const numberList = [
    { label: 'Alma', value: user.numbers.soul, desc: 'Tus deseos internos' },
    { label: 'Personalidad', value: user.numbers.personality, desc: 'Cómo te perciben los demás' },
    { label: 'Vida Pasada', value: user.numbers.pastLife, desc: 'Lecciones kármicas' },
    { label: 'Don', value: user.numbers.gift, desc: 'Tus talentos naturales' },
    { label: 'Camino', value: user.numbers.path, desc: 'Tu dirección de vida' },
  ];

  return (
    <div className="min-h-screen pb-24 gradient-dashboard grain-overlay">
      <div className="px-6 pb-8 pt-12 text-center">
        <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm border border-white/40 shadow-card">
          <User className="h-10 w-10 text-white" />
        </div>
        <h1 className="font-lora text-2xl font-bold text-white">{user.name}</h1>
        <div className="mt-2 flex items-center justify-center gap-1.5 text-sm text-white/80 font-lato">
          <Calendar className="h-3.5 w-3.5" /> {user.birthDate}
        </div>
      </div>

      <div className="px-6 mt-4">
        <h2 className="mb-3 flex items-center gap-2 font-lora text-base font-semibold text-white">
          <Hash className="h-4 w-4 text-white/80" /> Tus números
        </h2>
        <div className="space-y-3">
          {numberList.map(n => (
            <div key={n.label} className="flex items-center gap-4 rounded-xl bg-white/90 backdrop-blur-md p-4 border border-white/50 shadow-soft">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-secondary font-lora text-lg font-bold text-primary">
                {n.value}
              </div>
              <div>
                <p className="text-sm font-semibold text-heading font-lato">{n.label}</p>
                <p className="text-xs text-muted-foreground font-lato">{n.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
