import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Navigate } from 'react-router-dom';
import { Briefcase, MapPin, Heart, ArrowLeft, Send, Check, Loader2, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { UserProfile } from '@/context/AppContext';

type Scenario = 'work' | 'relocation' | 'relationship';

interface ChatMessage {
  role: 'mentor' | 'user';
  text: string;
  streaming?: boolean;
}

const SCENARIOS = [
  { id: 'work' as Scenario, icon: Briefcase, title: 'Trabajo', desc: 'Carrera y camino profesional', iconBg: undefined },
  { id: 'relocation' as Scenario, icon: MapPin, title: 'Mudanza', desc: 'Cambios y nuevos comienzos', iconBg: '#9DA1D5' },
  { id: 'relationship' as Scenario, icon: Heart, title: 'Relación', desc: 'Amor y conexiones', iconBg: '#C9A0AE' },
];

const SCENARIO_LABELS: Record<Scenario, string> = {
  work: 'Trabajo',
  relocation: 'Mudanza',
  relationship: 'Relación',
};

const SCENARIO_THEMES: Record<Scenario, { userBubble: string; userText: string }> = {
  work: { userBubble: 'hsl(225 64% 67%)', userText: 'hsl(0 0% 100%)' },
  relocation: { userBubble: 'hsl(248 54% 58%)', userText: 'hsl(0 0% 100%)' },
  relationship: { userBubble: 'hsl(336 22% 81%)', userText: 'hsl(0 0% 10%)' },
};

const SCENARIO_ICON_COLORS: Record<Scenario, string> = {
  work: '#738DE1',
  relocation: '#9DA1D5',
  relationship: '#C9A0AE',
};

function getGreeting(scenario: Scenario, name: string, numbers: UserProfile['numbers']): string {
  const first = name.split(' ')[0];

  const workByPath: Record<number, string> = {
    1: `Hola ${first}, qué gusto saludarte.\n\nSoy KYROS, y estoy aquí para acompañarte en tu evolución profesional. Como número 1, tu alma está llamada a liderar e innovar.\n\n¿Qué decisión profesional necesita claridad hoy?`,
    2: `Hola ${first}, qué gusto saludarte.\n\nSoy KYROS, y estoy aquí para acompañarte en tu evolución profesional. Tu número de Camino habla de colaboración y equilibrio.\n\n¿En qué parte de tu trabajo buscas mayor armonía hoy?`,
    3: `Hola ${first}, qué gusto saludarte.\n\nSoy KYROS, y estoy aquí para acompañarte en tu evolución profesional. Tu don de crear y comunicar es tu mayor fuerza laboral.\n\n¿Qué proyecto o camino creativo estás evaluando?`,
    4: `Hola ${first}, qué gusto saludarte.\n\nSoy KYROS, y estoy aquí para acompañarte en tu evolución profesional. Valoras el orden y la seguridad en lo que construyes.\n\n¿Qué decisión profesional necesita claridad hoy?`,
    5: `Hola ${first}, qué gusto saludarte.\n\nSoy KYROS, y estoy aquí para acompañarte en tu evolución profesional. Tu alma busca libertad en lo que haces.\n\n¿Qué cambio laboral estás evaluando?`,
    6: `Hola ${first}, qué gusto saludarte.\n\nSoy KYROS, y estoy aquí para acompañarte en tu evolución profesional. Tu misión de cuidar y servir guía tu camino profesional.\n\n¿En qué tema laboral necesitas orientación hoy?`,
    7: `Hola ${first}, qué gusto saludarte.\n\nSoy KYROS, y estoy aquí para acompañarte en tu evolución profesional. Tu naturaleza analítica y profunda te abre puertas únicas.\n\n¿Qué investigas o planificas en tu carrera?`,
    8: `Hola ${first}, qué gusto saludarte.\n\nSoy KYROS, y estoy aquí para acompañarte en tu evolución profesional. Tienes una capacidad natural para gestionar recursos y ambición.\n\n¿Qué decisión de poder o carrera enfrentas hoy?`,
    9: `Hola ${first}, qué gusto saludarte.\n\nSoy KYROS, y estoy aquí para acompañarte en tu evolución profesional. Tu camino está marcado por inspirar y servir al bien mayor.\n\n¿Qué propósito profesional busca claridad hoy?`,
    10: `Hola ${first}, qué gusto saludarte.\n\nSoy KYROS, y estoy aquí para acompañarte en tu evolución profesional. Tu número de Camino habla de completud y nuevos ciclos.\n\n¿Qué transición profesional estás viviendo?`,
  };

  const relocationByPastLife: Record<number, string> = {
    1: `Hola ${first}. Soy KYROS y estoy aquí para acompañarte en este cambio de espacio y energía.\n\nTus patrones kármicos hablan de nuevos comienzos y autonomía.\n\n¿A qué lugar estás considerando ir?`,
    2: `Hola ${first}. Soy KYROS y estoy aquí para acompañarte en este cambio de espacio y energía.\n\nTu karma de vida pasada busca equilibrio y conexión en los entornos.\n\n¿Qué cambio de espacio estás evaluando?`,
    3: `Hola ${first}. Soy KYROS y estoy aquí para acompañarte en este cambio de espacio y energía.\n\nTus raíces kármicas florecen donde puedes expresarte y crear.\n\n¿A qué lugar estás considerando mudarte?`,
    4: `Hola ${first}. Soy KYROS y estoy aquí para acompañarte en este cambio de espacio y energía.\n\nTu karma busca estabilidad y estructura en cada entorno.\n\n¿Qué cambio de hogar estás considerando?`,
    5: `Hola ${first}. Soy KYROS y estoy aquí para acompañarte en este cambio de espacio y energía.\n\nTus lecciones de vida pasada te piden libertad de movimiento.\n\n¿A qué lugar estás pensando en ir?`,
    6: `Hola ${first}. Soy KYROS y estoy aquí para acompañarte en este cambio de espacio y energía.\n\nTu karma de vida pasada busca hogar y comunidad.\n\n¿Qué cambio de entorno estás evaluando?`,
    7: `Hola ${first}. Soy KYROS y estoy aquí para acompañarte en este cambio de espacio y energía.\n\nTus patrones kármicos muestran profundidad en el análisis del entorno.\n\n¿A qué lugar estás considerando ir?`,
    8: `Hola ${first}. Soy KYROS y estoy aquí para acompañarte en este cambio de espacio y energía.\n\nTu karma de vida pasada tiene que ver con el poder de los entornos.\n\n¿Qué mudanza o cambio de espacio contemplas?`,
    9: `Hola ${first}. Soy KYROS y estoy aquí para acompañarte en este cambio de espacio y energía.\n\nTu vida pasada te enseñó a trascender lugares y fronteras.\n\n¿A qué nuevo hogar estás llamando?`,
    10: `Hola ${first}. Soy KYROS y estoy aquí para acompañarte en este cambio de espacio y energía.\n\nTu karma habla de ciclos completados en distintos espacios.\n\n¿Qué nuevo entorno estás evaluando?`,
  };

  const relationshipBySoul: Record<number, string> = {
    1: `Hola ${first}, qué gusto saludarte.\n\nSoy KYROS, y estoy aquí para acompañarte en el terreno de tus vínculos. Tu alma desea conexiones donde puedas brillar en tu unicidad.\n\nPara explorar la energía de esta relación, necesito la fecha de nacimiento de la otra persona (día, mes y año). ¿Me la compartes?`,
    2: `Hola ${first}, qué gusto saludarte.\n\nSoy KYROS, y estoy aquí para acompañarte en el terreno de tus vínculos. Tu alma anhela vínculos de equilibrio y reciprocidad profunda.\n\nPara explorar esta relación, ¿me compartes la fecha de nacimiento de la otra persona?`,
    3: `Hola ${first}, qué gusto saludarte.\n\nSoy KYROS, y estoy aquí para acompañarte en el terreno de tus vínculos. Tu alma busca relaciones llenas de alegría y expresión compartida.\n\nPara analizar esta conexión, ¿me das la fecha de nacimiento de la otra persona?`,
    4: `Hola ${first}, qué gusto saludarte.\n\nSoy KYROS, y estoy aquí para acompañarte en el terreno de tus vínculos. Tu alma desea vínculos seguros y estables.\n\nPara explorar esta relación, ¿me compartes la fecha de nacimiento de la otra persona?`,
    5: `Hola ${first}, qué gusto saludarte.\n\nSoy KYROS, y estoy aquí para acompañarte en el terreno de tus vínculos. Tu alma anhela libertad incluso dentro del amor.\n\nPara analizar esta energía, ¿me das la fecha de nacimiento de la otra persona?`,
    6: `Hola ${first}, qué gusto saludarte.\n\nSoy KYROS, y estoy aquí para acompañarte en el terreno de tus vínculos. Tu alma está llamada a amar con profundidad y entrega.\n\nPara explorar este vínculo, ¿me compartes la fecha de nacimiento de la otra persona?`,
    7: `Hola ${first}, qué gusto saludarte.\n\nSoy KYROS, y estoy aquí para acompañarte en el terreno de tus vínculos. Tu alma busca conexiones donde haya verdad y profundidad.\n\nPara analizar esta relación, ¿me compartes la fecha de nacimiento de la otra persona?`,
    8: `Hola ${first}, qué gusto saludarte.\n\nSoy KYROS, y estoy aquí para acompañarte en el terreno de tus vínculos. Tu alma desea vínculos de fuerza y crecimiento mutuo.\n\nPara explorar esta energía, ¿me das la fecha de nacimiento de la otra persona?`,
    9: `Hola ${first}, qué gusto saludarte.\n\nSoy KYROS, y estoy aquí para acompañarte en el terreno de tus vínculos. Tu alma anhela amor que trascienda y tenga propósito.\n\nPara explorar esta relación, ¿me compartes la fecha de nacimiento de la otra persona?`,
    10: `Hola ${first}, qué gusto saludarte.\n\nSoy KYROS, y estoy aquí para acompañarte en el terreno de tus vínculos. Tu alma está en un ciclo de completud en el amor.\n\nPara analizar este vínculo, ¿me das la fecha de nacimiento de la otra persona?`,
  };

  if (scenario === 'work') return workByPath[numbers.path] ?? workByPath[9];
  if (scenario === 'relocation') return relocationByPastLife[numbers.pastLife] ?? relocationByPastLife[9];
  if (scenario === 'relationship') return relationshipBySoul[numbers.soul] ?? relationshipBySoul[9];
  return `Hola ${first}. Soy KYROS. ¿En qué puedo acompañarte hoy?`;
}

function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split('\n').map((line, j, arr) => (
        <span key={j}>
          {line.split(/(\*\*.*?\*\*|_.*?_)/g).map((segment, k) => {
            if (segment.startsWith('**') && segment.endsWith('**'))
              return <strong key={k} className="font-bold">{segment.slice(2, -2)}</strong>;
            if (segment.startsWith('_') && segment.endsWith('_'))
              return <em key={k} className="italic">{segment.slice(1, -1)}</em>;
            return <span key={k}>{segment}</span>;
          })}
          {j < arr.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}

export default function Mentor() {
  const { user, authUser, addConsultation } = useApp();
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [blockedScenarios, setBlockedScenarios] = useState<Set<Scenario>>(new Set());
  const [nextUnlockAt, setNextUnlockAt] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check which scenarios are already consulted in the last 24h (backend guard)
  useEffect(() => {
    if (!authUser) return;
    const since = new Date(Date.now() - 86400000).toISOString();
    supabase
      .from('conversations')
      .select('scenario, created_at')
      .eq('user_id', authUser.id)
      .gte('created_at', since)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setBlockedScenarios(new Set(data.map(d => d.scenario as Scenario)));
          const earliest = data.reduce((min, d) =>
            d.created_at < min ? d.created_at : min, data[0].created_at
          );
          setNextUnlockAt(new Date(new Date(earliest).getTime() + 86400000));
        }
      });
  }, [authUser]);

  // Countdown to next unlock
  useEffect(() => {
    if (!nextUnlockAt) return;
    const update = () => {
      const diff = nextUnlockAt.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft('');
        setBlockedScenarios(new Set());
        setNextUnlockAt(null);
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setTimeLeft(h > 0 ? `${h}h ${m}min` : `${m}min`);
    };
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, [nextUnlockAt]);

  if (!user) return <Navigate to="/" replace />;

  const callAI = async (
    apiMessages: { role: string; content: string }[],
    s: Scenario,
  ): Promise<string> => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
    const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY) as string;
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    const token = currentSession?.access_token ?? supabaseAnonKey;

    const res = await fetch(`${supabaseUrl}/functions/v1/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        messages: apiMessages,
        userProfile: { name: user.name, numbers: user.numbers },
        scenario: s,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      if (res.status === 429) throw new Error('RATE_LIMIT');
      throw new Error(`Chat ${res.status}: ${err}`);
    }
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data.text ?? '';
  };

  const createConversation = async (s: Scenario): Promise<string | null> => {
    if (!authUser) return null;
    const { data } = await supabase
      .from('conversations')
      .insert({ user_id: authUser.id, scenario: s })
      .select('id')
      .single();
    return data?.id ?? null;
  };

  const persistMessage = async (convId: string, role: 'user' | 'assistant', content: string) => {
    if (!authUser || !convId) return;
    await supabase.from('messages').insert({ conversation_id: convId, role, content });
  };

  const handleSelect = async (s: Scenario) => {
    if (blockedScenarios.has(s)) return;

    setScenario(s);
    const greeting = getGreeting(s, user.name, user.numbers);
    setMessages([{ role: 'mentor', text: greeting }]);

    const convId = await createConversation(s);
    setConversationId(convId);
    // Mark this scenario as blocked now that we've started
    setBlockedScenarios(prev => new Set([...prev, s]));
    // Set next unlock time if not already set (first consultation of the day)
    setNextUnlockAt(prev => prev ?? new Date(Date.now() + 86400000));
    if (convId) {
      await persistMessage(convId, 'assistant', greeting);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !scenario || loading) return;

    const userText = input.trim();
    setInput('');

    const updatedMessages: ChatMessage[] = [...messages, { role: 'user', text: userText }];
    setMessages(updatedMessages);

    if (conversationId) {
      await persistMessage(conversationId, 'user', userText);
    }

    setLoading(true);
    const streamingIndex = updatedMessages.length;
    setMessages(prev => [...prev, { role: 'mentor', text: '', streaming: true }]);

    try {
      const apiMessages = updatedMessages.map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const fullText = await callAI(apiMessages, scenario);

      setMessages(prev => {
        const next = [...prev];
        next[streamingIndex] = { role: 'mentor', text: fullText, streaming: false };
        return next;
      });

      if (conversationId && fullText) {
        await persistMessage(conversationId, 'assistant', fullText);
      }

      // Auto-save after the 3rd user message
      const userCount = updatedMessages.filter(m => m.role === 'user').length;
      if (userCount >= 3 && !saved) {
        const firstUserMsg = updatedMessages.find(m => m.role === 'user')?.text || '';
        const ok = await addConsultation({
          id: Date.now().toString(),
          scenario,
          date: new Date().toLocaleDateString('es-ES'),
          conversationId: conversationId ?? undefined,
          insight: {
            reason: firstUserMsg,
            advice: fullText,
            actions: [],
          },
        });
        if (ok) setSaved(true);
      }
    } catch (err) {
      setMessages(prev => {
        const next = [...prev];
        next[streamingIndex] = {
          role: 'mentor',
          text:
            (err as Error).message === 'RATE_LIMIT'
              ? 'El servicio está un poco saturado ahora mismo. Espera unos segundos e inténtalo de nuevo.'
              : 'Lo siento, no pude conectarme en este momento. Inténtalo de nuevo.',
          streaming: false,
        };
        return next;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setScenario(null);
    setMessages([]);
    setInput('');
    setSaved(false);
    setConversationId(null);
    setLoading(false);
  };

  const theme = scenario ? SCENARIO_THEMES[scenario] : null;

  // Chat view
  if (scenario) {
    return (
      <div className="flex min-h-screen flex-col" style={{ background: '#FFFFFF' }}>
        {/* Header */}
        <div
          className="border-b px-4 pb-3 pt-10 flex items-center gap-3"
          style={{
            background: 'hsla(0, 0%, 100%, 0.3)',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            borderColor: 'hsla(0, 0%, 100%, 0.4)',
          }}
        >
          <button onClick={handleReset} className="text-body">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{ background: SCENARIO_ICON_COLORS[scenario] }}
            >
              {scenario === 'work' ? <Briefcase className="h-4 w-4 text-white" /> :
               scenario === 'relocation' ? <MapPin className="h-4 w-4 text-white" /> :
               <Heart className="h-4 w-4 text-white" />}
            </div>
            <div>
              <p className="text-base font-semibold text-heading font-lora">KYROS</p>
              <p className="text-xs text-body">{SCENARIO_LABELS[scenario]}</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-36">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-base leading-relaxed font-lato ${
                  msg.role === 'user' ? 'rounded-br-md' : 'rounded-bl-md'
                }`}
                style={
                  msg.role === 'user'
                    ? { background: theme!.userBubble, color: theme!.userText }
                    : { background: '#F8F9FE', border: '1px solid rgba(115, 141, 225, 0.12)', color: 'hsl(var(--foreground))' }
                }
              >
                <RichText text={msg.text} />
                {msg.streaming && (
                  <span className="inline-block ml-1 animate-pulse text-primary">▍</span>
                )}
              </div>
            </div>
          ))}

          {saved && (
            <div className="pt-1">
              <div className="flex items-center justify-center gap-2 rounded-xl py-3 text-base font-semibold" style={{ background: 'hsl(160 50% 50% / 0.12)', color: 'hsl(160 50% 40%)' }}>
                <Check className="h-4 w-4" /> Guardado en tu Bitácora
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div
          className="fixed bottom-16 left-0 right-0 border-t px-4 py-3"
          style={{
            background: 'hsla(0, 0%, 100%, 0.95)',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            borderColor: 'hsla(0, 0%, 100%, 0.4)',
          }}
        >
          {messages.filter(m => m.role === 'user').length >= 3 && !loading ? (
            <p className="text-center text-sm text-muted-foreground py-2">
              La consulta de hoy ha concluido. Vuelve mañana para una nueva sesión.
            </p>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Escribe tu mensaje..."
                disabled={loading}
                className="flex-1 rounded-xl border border-border bg-card/50 px-4 py-2.5 text-base text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="flex h-10 w-10 items-center justify-center rounded-full gradient-warm shadow-glow transition-transform active:scale-95 disabled:opacity-40"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 text-foreground animate-spin" />
                ) : (
                  <Send className="h-4 w-4 text-foreground" />
                )}
              </button>
            </div>
          )}
        </div>

      </div>
    );
  }

  // Scenario selector
  return (
    <div className="min-h-screen pb-24 md:pb-8 gradient-dashboard grain-overlay">
      <div className="px-6 pb-6 pt-12 md:max-w-2xl md:mx-auto">
        <h1 className="font-lora text-3xl font-bold text-on-gradient">KYROS</h1>
        <p className="mt-1 text-base text-on-gradient-muted font-lato">La voz que acompaña y aconseja</p>
        <p className="mt-1 text-xs text-on-gradient-muted font-lato">Recuerda que solo tienes una consulta diaria.</p>
      </div>

      <div className="space-y-4 px-6 mt-2 md:max-w-2xl md:mx-auto">
        {blockedScenarios.size > 0 && timeLeft && (
          <div className="flex items-center gap-3 rounded-2xl px-5 py-4" style={{ background: 'linear-gradient(135deg, hsl(16 100% 66% / 0.25), hsl(248 54% 58% / 0.2))', border: '1px solid hsl(16 100% 66% / 0.35)' }}>
            <Lock className="h-5 w-5 shrink-0 text-on-gradient" aria-hidden="true" />
            <div>
              <p className="text-sm text-on-gradient-muted font-lato">Próxima consulta disponible en</p>
              <p className="text-lg font-bold text-on-gradient font-lora">{timeLeft}</p>
            </div>
          </div>
        )}

        {SCENARIOS.map(s => {
          const isBlocked = blockedScenarios.has(s.id);
          return (
            <button
              key={s.id}
              onClick={() => !isBlocked && handleSelect(s.id)}
              disabled={isBlocked}
              className={`flex w-full items-center gap-4 rounded-2xl backdrop-blur-md p-5 border border-white/50 shadow-soft text-left transition-transform ${
                isBlocked
                  ? 'bg-white/50 opacity-60 cursor-not-allowed'
                  : 'bg-white/90 active:scale-[0.98] hover:shadow-card'
              }`}
            >
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                style={{ background: s.iconBg || 'hsl(var(--secondary))' }}
              >
                <s.icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-lora text-lg font-semibold text-heading">{s.title}</h3>
                <p className="text-sm text-muted-foreground font-lato">{s.desc}</p>
              </div>
              {isBlocked && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground font-lato shrink-0">
                  <Lock className="h-3 w-3" />
                  <span>Consultado hoy</span>
                </div>
              )}
            </button>
          );
        })}

      </div>

    </div>
  );
}
