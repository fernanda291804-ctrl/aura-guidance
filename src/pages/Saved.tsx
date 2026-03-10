import { useApp } from '@/context/AppContext';
import { Navigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import { Bookmark, Inbox } from 'lucide-react';

const SCENARIO_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  work: { label: 'Trabajo', bg: 'hsl(225 64% 67%)', text: 'hsl(0 0% 100%)' },
  relocation: { label: 'Mudanza', bg: 'hsl(234 18% 73%)', text: 'hsl(0 0% 100%)' },
  relationship: { label: 'Relación', bg: 'hsl(336 22% 81%)', text: 'hsl(225 40% 20%)' },
};

export default function Saved() {
  const { user, consultations } = useApp();
  if (!user) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen pb-24 gradient-dashboard grain-overlay">
      <div className="px-6 pb-6 pt-12">
        <h1 className="font-lora text-2xl font-bold text-on-gradient">Guardado</h1>
        <p className="mt-1 text-sm text-on-gradient-muted font-lato">Tu diario personal de insights</p>
      </div>

      <div className="px-6 mt-4">
        {consultations.length === 0 ? (
          <div className="rounded-2xl bg-white/30 backdrop-blur-sm p-10 text-center border border-white/40">
            <Inbox className="mx-auto h-12 w-12 text-on-gradient-muted/60" />
            <p className="mt-4 text-sm text-on-gradient-muted font-lato">Tu diario está vacío</p>
            <p className="mt-1 text-xs text-on-gradient-muted/80 font-lato">Las consultas guardadas aparecerán aquí</p>
          </div>
        ) : (
          <div className="space-y-3">
            {consultations.map(c => (
              <div key={c.id} className="rounded-2xl bg-white/90 backdrop-blur-md p-5 border border-white/50 shadow-soft">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold capitalize text-secondary-foreground font-lato">
                    <Bookmark className="h-3 w-3" /> {SCENARIO_LABELS[c.scenario] || c.scenario}
                  </span>
                  <span className="text-xs text-muted-foreground font-lato">{c.date}</span>
                </div>
                <p className="text-sm text-foreground leading-relaxed font-lato">{c.insight.advice}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
