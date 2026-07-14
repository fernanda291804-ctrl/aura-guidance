import { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Navigate, useNavigate } from 'react-router-dom';
import PentagonChart from '@/components/PentagonChart';
import { Clock, Inbox, Sparkles, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const SCENARIO_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  work: { label: 'Trabajo', bg: 'hsl(225 64% 67%)', text: 'hsl(0 0% 100%)' },
  relocation: { label: 'Mudanza', bg: 'hsl(234 18% 73%)', text: 'hsl(0 0% 100%)' },
  relationship: { label: 'Relación', bg: '#C9A0AE', text: 'hsl(0 0% 100%)' },
  general: { label: 'Sesión', bg: 'hsl(var(--secondary))', text: 'hsl(0 0% 100%)' },
};

function DashboardHero() {
  const [visible, setVisible] = useState(true);
  const [src, setSrc] = useState('/illustrations/dashboard-hero.webp');

  const handleError = () => {
    if (src.endsWith('.webp')) {
      setSrc('/illustrations/dashboard-hero.png');
    } else {
      setVisible(false);
    }
  };

  if (!visible) return null;
  return (
    <img
      src={src}
      alt=""
      onError={handleError}
      className="absolute right-0 top-0 h-full w-auto max-w-[45%] object-contain object-right-top opacity-90 pointer-events-none"
    />
  );
}

export default function Dashboard() {
  const { user, authUser, consultations } = useApp();
  const navigate = useNavigate();
  const [hasSessionToday, setHasSessionToday] = useState(false);

  useEffect(() => {
    if (!authUser) return;
    const since = new Date(Date.now() - 86400000).toISOString();
    supabase
      .from('conversations')
      .select('id')
      .eq('user_id', authUser.id)
      .gte('created_at', since)
      .limit(1)
      .then(({ data }) => {
        setHasSessionToday(Boolean(data && data.length > 0));
      });
  }, [authUser]);

  if (!user) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen pb-24 md:pb-8 gradient-dashboard grain-overlay">
      <div className="relative px-6 pb-6 pt-12 md:max-w-2xl md:mx-auto overflow-hidden">
        <DashboardHero />
        <h1 className="font-lora text-2xl font-bold text-on-gradient relative z-10">
          ¡Hola, {user.name.split(' ')[0]}!
        </h1>
        <p className="mt-1 text-sm font-lato text-on-gradient-muted relative z-10">Tu mapa numerológico te espera</p>
      </div>

      <div className="px-6 -mt-2 md:max-w-2xl md:mx-auto">
        <div className="rounded-3xl bg-white/20 backdrop-blur-sm p-5 border border-white/30">
          <h2 className="mb-1 text-center font-lora text-lg font-semibold text-on-gradient">Tus números</h2>
          <p className="mb-2 text-center text-xs text-on-gradient-muted font-lato">Toca un número para ver su significado</p>
          <PentagonChart numbers={user.numbers} />
        </div>
      </div>

      {/* Today's KYROS session */}
      <div className="mt-5 px-6 md:max-w-2xl md:mx-auto">
        <h3 className="font-lora text-base font-semibold text-on-gradient mb-3">Tu sesión con KYROS</h3>
        <button
          onClick={() => navigate('/mentor')}
          className="flex w-full items-center gap-4 rounded-2xl bg-white/90 backdrop-blur-md p-5 border border-white/50 shadow-soft text-left transition-transform active:scale-[0.98] hover:shadow-card"
        >
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
            style={{ background: 'hsl(var(--secondary))' }}
          >
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-lora text-lg font-semibold text-heading">
              {hasSessionToday ? 'Continuar tu sesión de hoy' : 'Comenzar tu sesión de hoy'}
            </h4>
            <p className="text-sm text-muted-foreground font-lato">
              {hasSessionToday ? 'Ya hablaste con KYROS hoy' : 'Un tema, una conversación, cada día'}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
        </button>
      </div>

      <div className="mt-5 px-6 md:max-w-2xl md:mx-auto">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-4 w-4 text-on-gradient-muted" />
          <h3 className="font-lora text-base font-semibold text-on-gradient">Consultas recientes</h3>
        </div>

        {consultations.length === 0 ? (
          <div className="rounded-2xl bg-white/30 backdrop-blur-sm p-8 text-center border border-white/40">
            <Inbox className="mx-auto h-10 w-10 text-on-gradient-muted/60" />
            <p className="mt-3 text-sm text-on-gradient-muted font-lato">Aún no hay consultas</p>
            <p className="text-xs text-on-gradient-muted/80 font-lato mb-4">Habla con KYROS y recibe tu primera guía numerológica</p>
            <button
              onClick={() => navigate('/mentor')}
              className="inline-flex items-center gap-2 rounded-2xl gradient-warm px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-glow transition-transform active:scale-[0.98] font-lato"
            >
              Comenzar con KYROS
            </button>
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

    </div>
  );
}
