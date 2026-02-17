import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Navigate, useNavigate } from 'react-router-dom';
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
  { id: 'work' as Scenario, icon: Briefcase, title: 'Trabajo', desc: 'Carrera y camino profesional' },
  { id: 'relocation' as Scenario, icon: MapPin, title: 'Mudanza', desc: 'Cambios y nuevos comienzos' },
  { id: 'relationship' as Scenario, icon: Heart, title: 'Relación', desc: 'Amor y conexiones' },
];

const SCENARIO_LABELS: Record<Scenario, string> = {
  work: 'Trabajo',
  relocation: 'Mudanza',
  relationship: 'Relación',
};

const SCENARIO_THEMES: Record<Scenario, { gradient: string; accent: string }> = {
  work: {
    gradient: 'linear-gradient(135deg, hsl(220 100% 93% / 0.6), hsl(195 100% 50% / 0.15))',
    accent: 'hsl(195 100% 50%)',
  },
  relocation: {
    gradient: 'linear-gradient(135deg, hsl(25 95% 74% / 0.4), hsl(25 90% 57% / 0.15))',
    accent: 'hsl(25 90% 63%)',
  },
  relationship: {
    gradient: 'linear-gradient(135deg, hsl(340 60% 90% / 0.6), hsl(250 67% 93% / 0.4))',
    accent: 'hsl(340 60% 75%)',
  },
};

const DETAIL_QUESTIONS: Record<Scenario, string> = {
  work: '¿Podrías contarme más sobre tu situación laboral actual? ¿Buscas un cambio de carrera, un ascenso, o estás iniciando un nuevo proyecto?',
  relocation: '¿Qué tipo de mudanza estás considerando? ¿Es un cambio de ciudad, de país, o simplemente un nuevo hogar? ¿Qué te motiva este cambio?',
  relationship: '¿Cómo describirías tu situación sentimental actual? ¿Buscas iniciar una relación, fortalecer una existente, o sanar de una experiencia pasada?',
};

/**
 * Camino-Céntrico + Regla 20/80:
 * 20% teoría del número → 80% interpretación creativa aplicada al contexto del usuario.
 * Nunca cita textualmente la base de datos; parafrasea y proyecta hacia el futuro.
 */
function generateInsight(scenario: Scenario, pathNumber: number, userContext: string, userDetail: string) {
  const profile = NUMBER_PROFILES[pathNumber];
  if (!profile) {
    return {
      analysis: `Tu frecuencia vibratoria está en un punto de inflexión. Siento que hay una transformación profunda gestándose dentro de ti.`,
      suggestions: [
        'Dedica 10 minutos hoy a escribir qué sería tu escenario ideal dentro de 6 meses.',
        'Antes de dormir, pregúntate: _¿Qué decisión estoy postergando por miedo?_',
        'Mañana, haz una cosa que te incomode levemente — ahí está tu crecimiento.',
      ],
      action: 'Hoy mismo, escribe en un papel una sola palabra que represente lo que quieres soltar. Dóblalo y guárdalo en un lugar donde no lo veas hasta la próxima luna llena.',
    };
  }

  // Extract essence without quoting verbatim
  const strengthEssence = profile.positivo.split(', ').slice(0, 2).join(' y ').toLowerCase();
  const shadowEssence = profile.negativo.split(', ')[0].toLowerCase();
  const missionVerb = profile.mision.split(' ').slice(1, 5).join(' ').toLowerCase();

  const situationRef = userDetail || userContext || 'tu situación actual';

  // Scenario-specific creative frameworks (80% of the response)
  const creativeFrameworks: Record<Scenario, {
    feeling: string;
    projection: string;
    challenge: string;
    task: string;
    introspection: string;
  }> = {
    work: {
      feeling: `Cuando pienso en tu frecuencia ${pathNumber} frente a lo que me cuentas sobre "${situationRef.slice(0, 60)}…", percibo una energía que necesita **canal, no contención**. Tu vibración natural te empuja hacia la acción, pero el entorno laboral a veces te pide pausa — y ahí es donde se genera la tensión.`,
      projection: `Tu capacidad de ${strengthEssence} es exactamente lo que este momento profesional necesita de ti. No se trata de forzar resultados, sino de posicionarte como alguien que **ya sabe** hacia dónde va, incluso cuando el camino aún no está del todo claro.`,
      challenge: `Ojo: la tendencia hacia ${shadowEssence} puede disfrazarse de "profesionalismo" o "cautela". Pregúntate con honestidad: _¿Estoy siendo estratégico o estoy evitando el riesgo por miedo?_`,
      task: `**Ejercicio para hoy:** Escribe tres decisiones laborales que has estado posponiendo. Ordénalas de menor a mayor impacto. Ejecuta la primera antes de que termine el día — no mañana, hoy.`,
      introspection: `Reflexiona: _¿Mi trabajo actual me acerca o me aleja de quien quiero ser en 3 años?_ La respuesta honesta a eso vale más que cualquier consejo externo.`,
    },
    relocation: {
      feeling: `Tu energía ${pathNumber} frente a este cambio de entorno me dice algo interesante: no es solo una mudanza física, es un **reposicionamiento de tu frecuencia vital**. Lo que describes sobre "${situationRef.slice(0, 60)}…" refleja una necesidad profunda de alinearte con un espacio que resuene contigo.`,
      projection: `Esa cualidad tuya de ${strengthEssence} es tu brújula aquí. No elijas el lugar más lógico — elige el que te haga sentir que puedes respirar más profundo. Tu intuición ya sabe la respuesta; tu mente es la que necesita convencerse.`,
      challenge: `Cuidado con ${shadowEssence} disfrazada de "planificación excesiva". A veces, analizar demasiado un cambio es la forma elegante de no hacerlo. _¿Estás preparándote o estás postergando?_`,
      task: `**Ejercicio para hoy:** Cierra los ojos 5 minutos e imagínate despertando en tu nuevo espacio. ¿Qué es lo primero que ves, hueles, sientes? Escríbelo. Ese ejercicio sensorial te dirá más que cualquier lista de pros y contras.`,
      introspection: `Pregúntate: _¿Estoy huyendo de algo o caminando hacia algo?_ Ambas son válidas, pero la claridad sobre cuál es tu caso cambia completamente la estrategia.`,
    },
    relationship: {
      feeling: `Tu frecuencia ${pathNumber} en el terreno emocional es reveladora. Lo que me compartes sobre "${situationRef.slice(0, 60)}…" no es casualidad — tu vibración está pidiendo **autenticidad radical** en cómo te vinculas. Hay algo que ya sabes pero que quizás no te has permitido decir en voz alta.`,
      projection: `Tu don natural de ${strengthEssence} es magnético en las relaciones, pero solo cuando lo ejerces desde la vulnerabilidad, no desde la performance. La persona correcta no necesita tu mejor versión — necesita tu versión real.`,
      challenge: `Tu punto ciego aquí es ${shadowEssence}. En relaciones, esto puede manifestarse como construir muros elegantes que parecen "estándares altos". _¿Estás protegiendo tu corazón o estás aislándolo?_`,
      task: `**Ejercicio para hoy:** Envía un mensaje honesto a alguien importante. No tiene que ser profundo — solo genuino. "Pensé en ti hoy" es suficiente. El vínculo se nutre de presencia, no de grandes gestos.`,
      introspection: `Reflexiona: _¿Qué patrón se repite en mis relaciones y qué me está enseñando?_ Los patrones no son errores — son lecciones que no has graduado aún.`,
    },
  };

  const fw = creativeFrameworks[scenario];

  return {
    analysis: `${fw.feeling}\n\n${fw.projection}`,
    suggestions: [
      fw.challenge,
      fw.introspection,
      `Tu energía de **${profile.title}** hoy te invita a ${missionVerb} — no como obligación, sino como el siguiente paso natural de tu evolución.`,
    ],
    action: fw.task,
  };
}

/** Renders text with **bold** and _italic_ markdown */
function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split('\n').map((line, j, arr) => (
        <span key={j}>
          {line.split(/(\*\*.*?\*\*|_.*?_)/g).map((segment, k) => {
            if (segment.startsWith('**') && segment.endsWith('**')) {
              return <strong key={k} className="font-bold">{segment.slice(2, -2)}</strong>;
            }
            if (segment.startsWith('_') && segment.endsWith('_')) {
              return <em key={k} className="italic">{segment.slice(1, -1)}</em>;
            }
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
  const navigate = useNavigate();
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
    const profile = NUMBER_PROFILES[user.numbers.path];
    const greeting = `¡Hola, ${user.name.split(' ')[0]}! 🌟\n\nSoy tu mentor numerológico. He analizado tu mapa energético y como **${profile?.title || 'guía'}** con Camino ${user.numbers.path}, tengo una perspectiva especial para orientarte en el área de **${SCENARIO_LABELS[s]}**.\n\n¿Cuéntame, qué situación específica te trae hoy?`;
    setMessages([{ role: 'mentor', text: greeting }]);
  };

  const handleSend = () => {
    if (!input.trim() || !scenario) return;
    const text = input.trim();
    setInput('');

    if (step === 'greeting') {
      addMessage('user', text);
      setUserContext(text);
      setTimeout(() => {
        addMessage('mentor', DETAIL_QUESTIONS[scenario]);
        setStep('ask_detail');
      }, 800);
    } else if (step === 'ask_detail') {
      addMessage('user', text);
      setStep('thinking');
      setTimeout(() => {
        const insight = generateInsight(scenario, user.numbers.path, userContext, text);
        const insightText = `✨ **Análisis de tu Energía**\n\n${insight.analysis}\n\n🔮 **Sugerencias**\n\n${insight.suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n\n')}\n\n⚡ **Acción Recomendada**\n\n${insight.action}`;
        addMessage('mentor', insightText);
        setStep('insight');
        setTimeout(() => {
          addMessage('mentor', '🙏 Esta sesión ha concluido. Puedes guardar este insight en tu diario para consultarlo cuando lo necesites.\n\n_Que la energía de tus números te guíe._');
          setStep('closed');
        }, 1500);
      }, 2500);
    }
  };

  const handleSave = () => {
    if (!scenario) return;
    const insight = generateInsight(scenario, user.numbers.path, userContext, '');
    addConsultation({
      id: Date.now().toString(),
      scenario,
      date: new Date().toLocaleDateString('es-ES'),
      insight: {
        reason: insight.analysis,
        advice: insight.suggestions.join(' | '),
        actions: [insight.action, ...insight.suggestions],
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
      <div className="flex min-h-screen flex-col bg-background grain-overlay" style={theme ? { background: theme.gradient } : undefined}>
        {/* Header */}
        <div className="glass border-b border-border px-4 pb-3 pt-10 flex items-center gap-3">
          <button onClick={handleReset} className="text-body">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-warm">
              <Sparkles className="h-4 w-4 text-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-heading font-lora">Mentor NUMI</p>
              <p className="text-[10px] text-body">{SCENARIO_LABELS[scenario]}</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-md'
                    : 'glass shadow-soft rounded-bl-md text-foreground'
                }`}
              >
                <RichText text={msg.text} />
              </div>
            </div>
          ))}

          {step === 'thinking' && (
            <div className="flex justify-start">
              <div className="glass rounded-2xl rounded-bl-md px-4 py-3 shadow-soft">
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
                <div className="flex items-center justify-center gap-2 rounded-xl bg-success/15 py-3 text-sm font-semibold text-success">
                  <Check className="h-4 w-4" /> Guardado en tu diario
                </div>
              ) : (
                <button
                  onClick={handleSave}
                  className="flex w-full items-center justify-center gap-2 rounded-xl gradient-warm py-3 text-sm font-bold text-foreground shadow-glow transition-transform active:scale-[0.98]"
                >
                  <Bookmark className="h-4 w-4" /> Guardar en mi diario
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
          <div className="glass border-t border-border px-4 py-3 pb-20">
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
    <div className="min-h-screen bg-background pb-24 liquid-light grain-overlay">
      <div className="gradient-aura px-6 pb-6 pt-12">
        <h1 className="font-lora text-2xl font-bold text-heading">Mentor</h1>
        <p className="mt-1 text-sm text-body">Elige un área de orientación</p>
      </div>

      <div className="space-y-4 px-6 mt-6">
        {SCENARIOS.map(s => (
          <button
            key={s.id}
            onClick={() => handleSelect(s.id)}
            className="glass flex w-full items-center gap-4 rounded-2xl p-5 shadow-soft text-left transition-transform active:scale-[0.98] hover:shadow-card"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary">
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
