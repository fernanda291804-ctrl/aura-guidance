import { useApp } from '@/context/AppContext';
import { Navigate } from 'react-router-dom';
import PentagonChart from '@/components/PentagonChart';
import BottomNav from '@/components/BottomNav';
import { Clock, Inbox } from 'lucide-react';

const SCENARIO_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  work: { label: 'Trabajo', bg: 'hsl(225 64% 67%)', text: 'hsl(0 0% 100%)' },
  relocation: { label: 'Mudanza', bg: 'hsl(234 18% 73%)', text: 'hsl(0 0% 100%)' },
  relationship: { label: 'Relación', bg: 'hsl(336 22% 81%)', text: 'hsl(225 40% 20%)' },
};

export default function Dashboard() {
  const { user, consultations } = useApp();
  if (!user) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen pb-24 gradient-dashboard grain-overlay">
      <div className="px-6 pb-6 pt-12">
        <h1 className="font-lora text-2xl font-bold text-on-gradient">
          ¡Hola, {user.name.split(' ')[0]}!
        </h1>
        <p className="mt-1 text-sm font-lato text-on-gradient-muted">Tu mapa numerológico te espera</p>
      </div>

      <div className="px-6 -mt-2">
        <div className="rounded-3xl bg-white/20 backdrop-blur-sm p-5 border border-white/30">
          <h2 className="mb-1 text-center font-lora text-lg font-semibold text-on-gradient">Tus números</h2>
          <p className="mb-2 text-center text-xs text-on-gradient-muted font-lato">Toca un número para ver su significado</p>
          <PentagonChart numbers={user.numbers} />
        </div>
      </div>

      <div className="mt-6 px-6">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-4 w-4 text-on-gradient-muted" />
          <h3 className="font-lora text-base font-semibold text-on-gradient">Consultas recientes</h3>
        </div>

        {consultations.length === 0 ? (
          <div className="rounded-2xl bg-white/30 backdrop-blur-sm p-8 text-center border border-white/40">
            <Inbox className="mx-auto h-10 w-10 text-on-gradient-muted/60" />
            <p className="mt-3 text-sm text-on-gradient-muted font-lato">Aún no hay consultas</p>
            <p className="text-xs text-on-gradient-muted/80 font-lato">Toca el botón KYROS para comenzar tu viaje</p>
          </div>
        ) : (
          <div className="space-y-3">
            {consultations.slice(0, 3).map(c => (
              <div key={c.id} className="rounded-xl bg-white/30 backdrop-blur-sm p-4 border border-white/40">
                <div className="flex items-center justify-between">
                   <span
                     className="rounded-full px-3 py-1 text-xs font-semibold capitalize font-lato"
                     style={{
                       background: SCENARIO_CONFIG[c.scenario]?.bg || 'hsl(var(--secondary))',
                       color: SCENARIO_CONFIG[c.scenario]?.text || 'hsl(0 0% 100%)',
                     }}
                   >
                    {SCENARIO_CONFIG[c.scenario]?.label || c.scenario}
                   </span>
                  <span className="text-xs text-on-gradient-muted font-lato">{c.date}</span>
                </div>
                <p className="mt-2 text-sm text-on-gradient line-clamp-2 font-lato">{c.insight.advice}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
