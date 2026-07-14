import { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import type { Consultation } from '@/context/AppContext';
import { Navigate } from 'react-router-dom';
import { Bookmark, Inbox, ChevronDown, ChevronUp, Loader2, MessageSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const SCENARIO_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  work: { label: 'Trabajo', bg: 'hsl(225 64% 67%)', text: 'hsl(0 0% 100%)' },
  relocation: { label: 'Mudanza', bg: 'hsl(234 18% 73%)', text: 'hsl(0 0% 100%)' },
  relationship: { label: 'Relación', bg: '#C9A0AE', text: 'hsl(0 0% 100%)' },
  general: { label: 'Sesión', bg: 'hsl(var(--secondary))', text: 'hsl(0 0% 100%)' },
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function truncate(text: string, max: number): string {
  const clean = text.trim();
  return clean.length > max ? `${clean.slice(0, max).trim()}…` : clean;
}

function ConsultationCard({ c }: { c: Consultation }) {
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [loadingMsgs, setLoadingMsgs] = useState(false);

  const handleExpand = async () => {
    if (!expanded && messages === null && c.conversationId) {
      setLoadingMsgs(true);
      const { data } = await supabase
        .from('messages')
        .select('role, content')
        .eq('conversation_id', c.conversationId)
        .order('created_at', { ascending: true });
      setMessages((data as Message[]) ?? []);
      setLoadingMsgs(false);
    }
    setExpanded(prev => !prev);
  };

  const cfg = SCENARIO_CONFIG[c.scenario];
  // Older entries were bucketed into a scenario category; new sessions are all
  // 'general', so lead with the topic the person actually brought instead.
  const title = c.scenario !== 'general' && cfg
    ? cfg.label
    : c.insight.reason
      ? truncate(c.insight.reason, 48)
      : 'Sesión con KYROS';

  return (
    <div className="rounded-2xl bg-white/90 backdrop-blur-md border border-white/50 shadow-soft overflow-hidden flex flex-col">
      {/* Card header */}
      <div className="p-5 md:p-6 flex-1">
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="flex items-center gap-1.5 min-w-0 text-sm font-semibold text-heading font-lato">
            <Bookmark className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate">{title}</span>
          </span>
          <span className="text-xs text-muted-foreground font-lato shrink-0">{c.date}</span>
        </div>

        <p className="text-sm md:text-base text-foreground leading-relaxed font-lato line-clamp-2">
          {c.insight.advice}
        </p>
      </div>

      {/* Expand button */}
      {c.conversationId && (
        <div className="px-5 md:px-6 pb-4">
          <button
            onClick={handleExpand}
            className="flex items-center gap-2 text-xs md:text-sm text-primary font-lato font-medium rounded-lg border border-primary/20 px-3 py-2 hover:bg-primary/5 transition-colors"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            {expanded ? (
              <>Ver menos <ChevronUp className="h-3 w-3 ml-1" /></>
            ) : (
              <>Ver conversación <ChevronDown className="h-3 w-3 ml-1" /></>
            )}
          </button>
        </div>
      )}

      {/* Expanded conversation */}
      {expanded && (
        <div className="border-t border-border/30 bg-white/50">
          <div className="px-5 md:px-6 py-4 space-y-4 max-h-[400px] md:max-h-[500px] overflow-y-auto">
            {loadingMsgs ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : messages && messages.length > 0 ? (
              messages.map((msg, i) => (
                <div key={i} className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] md:text-xs font-semibold text-muted-foreground font-lato px-1">
                    {msg.role === 'user' ? 'Tú' : 'KYROS'}
                  </span>
                  <div
                    className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 text-xs md:text-sm leading-relaxed font-lato ${
                      msg.role === 'user' ? 'rounded-br-md' : 'rounded-bl-md'
                    }`}
                    style={
                      msg.role === 'user'
                        ? { background: cfg?.bg || 'hsl(var(--secondary))', color: cfg?.text || '#fff' }
                        : { background: '#F0F2FA', color: 'hsl(var(--foreground))' }
                    }
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground text-center py-4 font-lato">
                No hay mensajes guardados.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Saved() {
  const { user, consultations, loadConsultations } = useApp();

  useEffect(() => {
    loadConsultations();
  }, []);

  if (!user) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen pb-24 md:pb-10 gradient-dashboard grain-overlay">
      {/* Header */}
      <div className="px-6 md:px-10 pb-4 pt-12 md:pt-10 max-w-5xl mx-auto">
        <h1 className="font-lora text-2xl md:text-3xl font-bold text-on-gradient">Guardado</h1>
        <p className="mt-1 text-sm text-on-gradient-muted font-lato">Tu diario personal de insights</p>
      </div>

      {/* Content */}
      <div className="px-6 md:px-10 mt-2 max-w-5xl mx-auto">
        {consultations.length === 0 ? (
          <div className="rounded-2xl bg-white/30 backdrop-blur-sm p-10 md:p-16 text-center border border-white/40">
            <Inbox className="mx-auto h-12 w-12 md:h-16 md:w-16 text-on-gradient-muted/60" />
            <p className="mt-4 text-sm md:text-base text-on-gradient-muted font-lato">Tu diario está vacío</p>
            <p className="mt-1 text-xs md:text-sm text-on-gradient-muted/80 font-lato">
              Las consultas guardadas aparecerán aquí
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {consultations.map(c => (
              <ConsultationCard key={c.id} c={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
