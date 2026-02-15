import { useApp } from '@/context/AppContext';
import { Navigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import { User, Calendar, Hash } from 'lucide-react';

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
    <div className="min-h-screen bg-background pb-24 liquid-light grain-overlay">
      <div className="gradient-aura px-6 pb-8 pt-12 text-center">
        <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-secondary shadow-card">
          <User className="h-10 w-10 text-primary" />
        </div>
        <h1 className="font-lora text-2xl font-bold text-heading">{user.name}</h1>
        <div className="mt-2 flex items-center justify-center gap-1.5 text-sm text-body">
          <Calendar className="h-3.5 w-3.5" /> {user.birthDate}
        </div>
      </div>

      <div className="px-6 mt-4">
        <h2 className="mb-3 flex items-center gap-2 font-lora text-base font-semibold text-heading">
          <Hash className="h-4 w-4 text-primary" /> Tus Números
        </h2>
        <div className="space-y-3">
          {numberList.map(n => (
            <div key={n.label} className="glass flex items-center gap-4 rounded-xl p-4 shadow-soft">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-secondary font-lora text-lg font-bold text-primary">
                {n.value}
              </div>
              <div>
                <p className="text-sm font-semibold text-heading">{n.label}</p>
                <p className="text-xs text-body">{n.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
