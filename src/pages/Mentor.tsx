import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Navigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import { Briefcase, MapPin, Heart, ArrowLeft, Send, Bookmark, Check, Sparkles } from 'lucide-react';
import { NUMBER_PROFILES } from '@/data/numberMeanings';

type Scenario = 'work' | 'relocation' | 'relationship';
type ChatStep = 'select' | 'greeting' | 'ask_situation' | 'ask_detail' | 'thinking' | 'insight' | 'closed';

interface ChatMessage {
  role: 'mentor' | 'user';
  text: string;
}

const SCENARIOS = [
  { id: 'work' as Scenario, icon: Briefcase, title: 'Trabajo', desc: 'Carrera y camino profesional', iconBg: undefined },
  { id: 'relocation' as Scenario, icon: MapPin, title: 'Mudanza', desc: 'Cambios y nuevos comienzos', iconBg: '#9DA1D5' },
  { id: 'relationship' as Scenario, icon: Heart, title: 'Relación', desc: 'Amor y conexiones', iconBg: '#DBC0C9' },
];

const SCENARIO_LABELS: Record<Scenario, string> = {
  work: 'Trabajo',
  relocation: 'Mudanza',
  relationship: 'Relación',
};

const SCENARIO_THEMES: Record<Scenario, { bg: string; mentorBubble: string; accent: string }> = {
  work: {
    bg: 'linear-gradient(180deg, hsl(220 100% 96%) 0%, hsl(195 80% 95%) 100%)',
    mentorBubble: 'rgba(106, 90, 205, 0.08)',
    accent: 'hsl(195 100% 50%)',
  },
  relocation: {
    bg: 'linear-gradient(180deg, hsl(25 80% 96%) 0%, hsl(35 70% 94%) 100%)',
    mentorBubble: 'rgba(106, 90, 205, 0.08)',
    accent: 'hsl(25 90% 63%)',
  },
  relationship: {
    bg: 'linear-gradient(180deg, hsl(340 40% 96%) 0%, hsl(330 30% 94%) 100%)',
    mentorBubble: 'rgba(219, 192, 201, 0.25)',
    accent: 'hsl(340 30% 80%)',
  },
};

const DETAIL_QUESTIONS: Record<Scenario, (name: string, pathNumber: number, profile: any) => string> = {
  work: (name, pathNumber, profile) =>
    `Entiendo perfectamente, ${name}. Para una frecuencia **${pathNumber}** como la tuya — **${profile?.title || 'tu vibración'}** —, el estancamiento suele sentirse como una jaula; tu esencia siempre te pedirá movimiento y expansión.\n\nPara ayudarte a encontrar esa claridad que buscas, cuéntame un poco más:\n\n• ¿Qué es lo que más te impulsa hoy a querer dar este paso?\n\n• ¿Cómo te hace sentir la idea de dejar lo que tienes ahora?\n\n• ¿Qué es lo que más necesitas aclarar hoy para tomar esta decisión con seguridad?\n\nAquí estoy para escucharte.`,
  relocation: (name, pathNumber, profile) =>
    `Te escucho, ${name}. Para una frecuencia **${pathNumber}** — **${profile?.title || 'tu vibración'}** —, el lugar donde vives necesita resonar con quien te estás convirtiendo.\n\nPara orientarte mejor, cuéntame:\n\n• ¿Qué te está pidiendo este cambio de espacio?\n\n• ¿Qué dejas atrás y qué esperas encontrar?\n\n• ¿Qué necesitas resolver hoy para dar este paso con confianza?\n\nAquí estoy para escucharte.`,
  relationship: (name, pathNumber, profile) =>
    `Te escucho, ${name}. Para una frecuencia **${pathNumber}** — **${profile?.title || 'tu vibración'}** —, las conexiones emocionales tienen una profundidad que no todos comprenden.\n\nPara acompañarte mejor, cuéntame:\n\n• ¿Qué es lo que más te inquieta hoy en este terreno?\n\n• ¿Cómo te sientes con lo que tienes ahora?\n\n• ¿Qué necesitas aclarar para avanzar con el corazón en paz?\n\nAquí estoy para escucharte.`,
};

function generateInsight(scenario: Scenario, pathNumber: number, userName: string, userContext: string, userDetail: string) {
  const profile = NUMBER_PROFILES[pathNumber];
  const name = userName.split(' ')[0];
  const situationRef = userDetail || userContext || 'lo que estás atravesando';
  const shortSituation = situationRef.slice(0, 60);

  if (!profile) {
    return {
      validation: `Te entiendo, ${name}. Lo que sientes es real y tiene sentido.`,
      connection: `Tu frecuencia vibra en un momento de transformación. La incomodidad que sientes no es un error — es tu brújula interna recalibrándose.`,
      advice: `**Tu siguiente paso:** Detente hoy 5 minutos. Escribe una sola palabra que represente lo que necesitas soltar. Guárdala donde no la veas hasta la próxima semana.`,
      question: `¿Qué decisión estás postergando hoy por miedo a equivocarte?`,
    };
  }

  const frameworks: Record<Scenario, { validation: string; connection: string; advice: string; question: string }> = {
    work: {
      validation: `Te escucho, ${name}.\nEntiendo ese miedo, pero no lo veas como un freno; para mí, es la señal de que tu ciclo ahí terminó y estás lista para algo más grande.`,
      connection: `Como tu camino es el **${pathNumber}** — **${profile.title}** —, la incomodidad es tu brújula: te está avisando que ya no cabes en ese espacio y necesitas expandirte.`,
      advice: `Para irte con las puertas abiertas, mi mejor consejo es que agradezcas honestamente lo aprendido y dejes todo en orden. Esa impecabilidad profesional es lo que te dará la libertad para saltar a lo nuevo sin pesos.`,
      question: `Antes de dar el paso, quiero que lo veas desde aquí: ¿Qué es eso que este nuevo episodio te permitirá vivir que hoy el miedo te prohíbe?`,
    },
    relocation: {
      validation: `Te escucho, ${name}.\nEntiendo esa mezcla de emoción y vértigo. Mudarse no es solo cambiar de dirección — es renegociar quién eres.`,
      connection: `Como tu camino es el **${pathNumber}** — **${profile.title}** —, necesitas que tu espacio exterior refleje tu evolución interior. Cuando el lugar donde vives ya no resuena contigo, tu frecuencia te empuja a buscar un nuevo punto de anclaje.`,
      advice: `Mi consejo: cierra los ojos 5 minutos. Imagínate despertando en tu nuevo espacio. ¿Qué ves, qué hueles, qué sientes? Escríbelo. Eso te dirá más que cualquier lista de pros y contras.`,
      question: `Quiero que te preguntes esto con honestidad: ¿Qué te da más miedo — quedarte donde estás o atreverte a ese nuevo comienzo?`,
    },
    relationship: {
      validation: `Te escucho, ${name}.\nLo que sientes en este terreno emocional es real, y lo que me compartes me dice que ya sabes algo que no te has permitido decir en voz alta.`,
      connection: `Como tu camino es el **${pathNumber}** — **${profile.title}** —, tu forma de amar tiene una profundidad que no todo el mundo comprende. Eso puede generar desencuentros, pero también conexiones extraordinarias cuando encuentras a alguien que vibra en tu misma frecuencia.`,
      advice: `Mi consejo: envía un mensaje genuino a alguien importante hoy. No tiene que ser profundo — "pensé en ti" es suficiente. El vínculo se nutre de presencia, no de grandes gestos.`,
      question: `Quiero que mires hacia adentro: ¿Estás protegiendo tu corazón o lo estás aislando?`,
    },
  };

  return frameworks[scenario];
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
  const { user, addConsultation } = useApp();
  const [step, setStep] = useState<ChatStep>('select');
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [userContext, setUserContext] = useState('');
  const [saved, setSaved] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, step]);

  if (!user) return <Navigate to="/" replace />;

  const addMessage = (role: ChatMessage['role'], text: string) => {
    setMessages(prev => [...prev, { role, text }]);
  };

  const handleSelect = (s: Scenario) => {
    setScenario(s);
    setStep('greeting');
    const name = user.name.split(' ')[0];
    const greetings: Record<Scenario, string> = {
      work: `Hola ${name}, qué gusto saludarte.\n\nSoy **KYROS**, y estoy aquí para acompañarte en tu evolución profesional. Cuéntame, ¿en qué tema de tu trabajo o relacionado con él necesitas ayuda hoy?\n\nDime, ¿cómo te puedo ayudar a encontrar claridad en tu siguiente paso?`,
      relocation: `Hola ${name}, qué gusto saludarte.\n\nSoy **KYROS**, y estoy aquí para acompañarte en este momento de transición. Cuéntame, ¿qué cambio de espacio estás considerando?\n\nDime, ¿cómo te puedo ayudar a encontrar claridad en este nuevo comienzo?`,
      relationship: `Hola ${name}, qué gusto saludarte.\n\nSoy **KYROS**, y estoy aquí para acompañarte en el terreno más importante: tus vínculos. Cuéntame, ¿qué te trae hoy al espacio del corazón?\n\nDime, ¿cómo te puedo ayudar a encontrar claridad en tus conexiones?`,
    };
    setMessages([{ role: 'mentor', text: greetings[s] }]);
  };

  const handleSend = () => {
    if (!input.trim() || !scenario) return;
    const text = input.trim();
    setInput('');

    if (step === 'greeting') {
      addMessage('user', text);
      setUserContext(text);
      const profile = NUMBER_PROFILES[user.numbers.path];
      const name = user.name.split(' ')[0];
      setTimeout(() => {
        addMessage('mentor', DETAIL_QUESTIONS[scenario](name, user.numbers.path, profile));
        setStep('ask_detail');
      }, 800);
    } else if (step === 'ask_detail') {
      addMessage('user', text);
      setStep('thinking');
      setTimeout(() => {
        const insight = generateInsight(scenario, user.numbers.path, user.name, userContext, text);
        const insightText = `${insight.validation}\n\n${insight.connection}\n\n${insight.advice}`;
        addMessage('mentor', insightText);
        setStep('insight');
        setTimeout(() => {
          addMessage('mentor', `_${insight.question}_`);
          setStep('closed');
          setTimeout(() => {
            addMessage('mentor', 'He compartido contigo lo que mi visión ve por hoy. Ahora, la parte más importante es que dejes que estas palabras se asienten en ti.\n\nPara que nuestro trabajo sea profundo y real, solo tenemos un encuentro al día. Esto te asegura el espacio necesario para integrar lo que hablamos antes de dar el siguiente paso.\n\nEstaré aquí mañana para escucharte de nuevo si lo necesitas.');
          }, 1200);
        }, 1500);
      }, 2500);
    }
  };

  const handleSave = () => {
    if (!scenario) return;
    const insight = generateInsight(scenario, user.numbers.path, user.name, userContext, '');
    addConsultation({
      id: Date.now().toString(),
      scenario,
      date: new Date().toLocaleDateString('es-ES'),
      insight: {
        reason: `${insight.validation} ${insight.connection}`,
        advice: insight.advice,
        actions: [insight.advice, insight.question],
      },
    });
    setSaved(true);
  };

  const handleReset = () => {
    setStep('select');
    setScenario(null);
    setMessages([]);
    setInput('');
    setUserContext('');
    setSaved(false);
  };

  const theme = scenario ? SCENARIO_THEMES[scenario] : null;

  // Chat view
  if (step !== 'select' && scenario) {
    return (
      <div className="flex min-h-screen flex-col grain-overlay" style={{ background: theme?.bg }}>
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
            <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-warm">
              <Sparkles className="h-4 w-4 text-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-heading font-lora">KYROS</p>
              <p className="text-[10px] text-body">{SCENARIO_LABELS[scenario]}</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                 className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed font-lato ${
                  msg.role === 'user'
                    ? 'rounded-br-md text-foreground'
                    : 'rounded-bl-md text-foreground'
                }`}
                style={
                  msg.role === 'user'
                    ? {
                        background: 'hsl(var(--primary))',
                        color: 'hsl(var(--primary-foreground))',
                      }
                    : {
                        background: theme?.mentorBubble || 'rgba(106, 90, 205, 0.08)',
                        backdropFilter: 'blur(15px)',
                        WebkitBackdropFilter: 'blur(15px)',
                        border: '1px solid rgba(106, 90, 205, 0.12)',
                        boxShadow: '0 2px 12px rgba(106, 90, 205, 0.06)',
                      }
                }
              >
                <RichText text={msg.text} />
              </div>
            </div>
          ))}

          {step === 'thinking' && (
            <div className="flex justify-start">
              <div
                className="rounded-2xl rounded-bl-md px-4 py-3"
                style={{
                  background: theme?.mentorBubble || 'rgba(106, 90, 205, 0.08)',
                  backdropFilter: 'blur(15px)',
                  WebkitBackdropFilter: 'blur(15px)',
                  border: '1px solid rgba(106, 90, 205, 0.12)',
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs text-body">Consultando tu mapa energético...</span>
                </div>
              </div>
            </div>
          )}

          {step === 'closed' && (
            <div className="pt-2">
              {saved ? (
                <div className="flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold" style={{ background: 'hsl(160 50% 50% / 0.12)', color: 'hsl(160 50% 40%)' }}>
                  <Check className="h-4 w-4" /> Guardado en tu Bitácora
                </div>
              ) : (
                <button
                  onClick={handleSave}
                  className="flex w-full items-center justify-center gap-2 rounded-xl gradient-warm py-3 text-sm font-bold text-foreground shadow-glow transition-transform active:scale-[0.98]"
                >
                  <Bookmark className="h-4 w-4" /> Guardar en mi Bitácora
                </button>
              )}
              <button
                onClick={handleReset}
                className="mt-2 w-full rounded-xl border border-border py-3 text-sm font-semibold text-body transition-colors hover:bg-secondary"
              >
                Nueva consulta
              </button>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        {(step === 'greeting' || step === 'ask_detail') && (
          <div
            className="border-t px-4 py-3 pb-20"
            style={{
              background: 'hsla(0, 0%, 100%, 0.3)',
              backdropFilter: 'blur(15px)',
              WebkitBackdropFilter: 'blur(15px)',
              borderColor: 'hsla(0, 0%, 100%, 0.4)',
            }}
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Escribe tu mensaje..."
                className="flex-1 rounded-xl border border-border bg-card/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-full gradient-warm shadow-glow transition-transform active:scale-95 disabled:opacity-40"
              >
                <Send className="h-4 w-4 text-foreground" />
              </button>
            </div>
          </div>
        )}

        {step !== 'greeting' && step !== 'ask_detail' && <div className="pb-20" />}
        <BottomNav />
      </div>
    );
  }

  // Scenario selector
  return (
    <div className="min-h-screen pb-24 gradient-dashboard grain-overlay">
      <div className="px-6 pb-6 pt-12">
        <h1 className="font-lora text-2xl font-bold text-on-gradient">KYROS</h1>
        <p className="mt-1 text-sm text-on-gradient-muted font-lato">La voz que acompaña y aconseja</p>
      </div>

      <div className="space-y-4 px-6 mt-2">
        {SCENARIOS.map(s => (
          <button
            key={s.id}
            onClick={() => handleSelect(s.id)}
            className="flex w-full items-center gap-4 rounded-2xl bg-white/90 backdrop-blur-md p-5 border border-white/50 shadow-soft text-left transition-transform active:scale-[0.98] hover:shadow-card"
          >
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
              style={{ background: s.iconBg || 'hsl(var(--secondary))' }}
            >
              <s.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-lora text-base font-semibold text-heading">{s.title}</h3>
              <p className="text-xs text-muted-foreground font-lato">{s.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
