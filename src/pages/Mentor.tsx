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

/** Camino-Céntrico: generates advice strictly from the user's Path number profile */
function generateInsight(scenario: Scenario, pathNumber: number, _userContext: string, _userDetail: string) {
  const profile = NUMBER_PROFILES[pathNumber];
  if (!profile) {
    return {
      analysis: `Tu número de Camino (${pathNumber}) indica un período de transformación.`,
      suggestions: ['Reflexiona sobre tu propósito', 'Conecta con tu intuición', 'Actúa con conciencia'],
      action: 'Mantente alineado con tu energía interior.',
    };
  }

  const scenarioContext: Record<Scenario, { area: string; verb: string; focus: string }> = {
    work: { area: 'profesional', verb: 'construir tu carrera', focus: 'tu camino laboral' },
    relocation: { area: 'de cambio', verb: 'abrir este nuevo capítulo', focus: 'tu nuevo entorno' },
    relationship: { area: 'emocional', verb: 'nutrir tus vínculos', focus: 'tus relaciones' },
  };

  const ctx = scenarioContext[scenario];

  return {
    analysis: `Como **${profile.title}** (Camino ${pathNumber}), tu ${profile.energyType} influye directamente en ${ctx.focus}. Tus aspectos principales — ${profile.aspectos.split('.')[0]} — son la clave para entender cómo abordar esta situación ${ctx.area}.\n\nTu perfil positivo te dice: **${profile.positivo.split('.')[0]}**. Esta es tu mayor fortaleza en este momento.`,
    suggestions: [
      `**Usa tu fortaleza:** ${profile.positivo.split('. ').slice(0, 2).join('. ')}. Aplica esta energía para ${ctx.verb}.`,
      `**Cuidado con tu sombra:** ${profile.negativo.split('. ')[0]}. En el área de ${SCENARIO_LABELS[scenario].toLowerCase()}, esto podría manifestarse como resistencia o bloqueo.`,
      `**Tu misión te guía:** ${profile.mision.split('. ')[0]}. Deja que este propósito sea tu brújula para tomar decisiones.`,
    ],
    action: `Recuerda: tu misión como ${profile.title} es **${profile.mision.split('. ').slice(0, 2).join('. ')}**. Cada decisión en ${ctx.focus} debe alinearse con este propósito. Confía en tu ${profile.energyType.toLowerCase()} para avanzar con claridad.`,
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
