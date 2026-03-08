import { useApp } from '@/context/AppContext';
import { Navigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import { Bookmark, Inbox } from 'lucide-react';

const SCENARIO_LABELS: Record<string, string> = {
  work: 'Trabajo',
  relocation: 'Mudanza',
  relationship: 'Relación',
};

export default function Saved() {
  const { user, consultations } = useApp();
  if (!user) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-background pb-24 liquid-light grain-overlay">
      <div className="gradient-aura px-6 pb-6 pt-12">
        <h1 className="font-lora text-2xl font-bold text-heading">Guardado</h1>
        <p className="mt-1 text-sm text-body font-lato">Tu diario personal de insights</p>
      </div>

      <div className="px-6 mt-4">
        {consultations.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center shadow-soft">
            <Inbox className="mx-auto h-12 w-12 text-muted-foreground/40" />
            <p className="mt-4 text-sm text-muted-foreground">Tu diario está vacío</p>
            <p className="mt-1 text-xs text-muted-foreground/70">Las consultas guardadas aparecerán aquí</p>
          </div>
        ) : (
          <div className="space-y-3">
            {consultations.map(c => (
              <div key={c.id} className="glass rounded-2xl p-5 shadow-soft">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold capitalize text-secondary-foreground">
                    <Bookmark className="h-3 w-3" /> {SCENARIO_LABELS[c.scenario] || c.scenario}
                  </span>
                  <span className="text-xs text-muted-foreground">{c.date}</span>
                </div>
                <p className="text-sm text-body leading-relaxed">{c.insight.advice}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
