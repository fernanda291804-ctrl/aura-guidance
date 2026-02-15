import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Send, Lock } from 'lucide-react';

type Scenario = 'work' | 'relocation' | 'relationship';
type ChatStep = 1 | 2 | 3 | 4 | 5 | 6;

interface Message {
  role: 'mentor' | 'user';
  text: string;
}

const FOLLOW_UP: Record<Scenario, string> = {
  work: '¿Cómo describirías el clima en tu trabajo actual y cuáles son tus metas profesionales más importantes?',
  relationship: '¿Cuál es el obstáculo emocional principal que sientes en este momento en tu relación?',
  relocation: '¿A dónde estás considerando mudarte y qué es lo que más te preocupa del cambio?',
};

const SCENARIO_LABELS: Record<Scenario, string> = {
  work: 'Trabajo',
  relationship: 'Relación',
  relocation: 'Mudanza',
};

function generateInsight(scenario: Scenario, pathNumber: number) {
  const insights: Record<Scenario, { analysis: string; suggestions: string; action: string }> = {
    work: {
      analysis: `Tu Número de Camino ${pathNumber} revela un ciclo de transformación profesional. La energía de este período favorece los movimientos audaces y alinear tu carrera con tu propósito más profundo. Las vibraciones actuales indican que estás en un momento clave para redefinir tu trayectoria.`,
      suggestions: 'Confía en tu intuición para las decisiones profesionales. Tu número sugiere que prosperas cuando tu trabajo refleja tus valores internos. Busca roles que honren tanto la ambición como la autenticidad. Rodéate de personas que vibren en tu misma frecuencia de crecimiento.',
      action: 'Esta semana, dedica 30 minutos a escribir una carta a tu yo profesional del futuro, describiendo exactamente dónde te ves y cómo te sientes en tu trabajo ideal.',
    },
    relationship: {
      analysis: `Tu Número de Camino ${pathNumber} señala un período de profundo crecimiento emocional. Las relaciones son espejos de tu estado interior, y este ciclo te llama a la conexión auténtica. La vibración actual amplifica tu capacidad de empatía y comprensión.`,
      suggestions: 'Ábrete a la vulnerabilidad. Tu numerología indica lecciones kármicas alrededor de la confianza. Abraza las relaciones que fomentan el crecimiento mutuo en lugar de solo la comodidad. Practica la comunicación desde el corazón, no desde el miedo.',
      action: 'Hoy, escribe una carta de gratitud a la persona más significativa en tu vida, expresando tres cualidades específicas que admiras de ella.',
    },
    relocation: {
      analysis: `Tu Número de Camino ${pathNumber} indica una fuerte atracción hacia nuevos entornos. Tu carta numerológica sugiere que el cambio geográfico puede desbloquear un potencial dormido. Este es un momento propicio para que la energía del movimiento trabaje a tu favor.`,
      suggestions: 'Considera lugares que resuenen con la vibración de tu número de vida. Los espacios cerca del agua o paisajes naturales pueden amplificar tu energía creativa y espiritual durante este tránsito. No temas al cambio; es tu aliado natural.',
      action: 'Investiga tres ciudades o barrios potenciales y visita al menos uno durante las próximas dos semanas, prestando atención a cómo te hace sentir el lugar.',
    },
  };
  return insights[scenario];
}

interface MentorChatProps {
  scenario: Scenario;
  onBack: () => void;
}

export default function MentorChat({ scenario, onBack }: MentorChatProps) {
  const { user, addConsultation } = useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState<ChatStep>(1);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const userName = user?.name.split(' ')[0] || 'amigo';
  const pathNumber = user?.numbers.path || 7;

  // Theme classes based on scenario
  const themeClasses: Record<Scenario, { liquid1: string; liquid2: string; accent: string; bubbleBg: string }> = {
    work: {
      liquid1: 'bg-[hsl(var(--theme-work-1)/0.15)]',
      liquid2: 'bg-[hsl(var(--theme-work-2)/0.12)]',
      accent: 'from-[hsl(var(--theme-work-1))] to-[hsl(var(--theme-work-2))]',
      bubbleBg: 'bg-[hsl(var(--theme-work-1)/0.35)]',
    },
    relationship: {
      liquid1: 'bg-[hsl(var(--theme-relation-1)/0.2)]',
      liquid2: 'bg-[hsl(var(--theme-relation-2)/0.18)]',
      accent: 'from-[hsl(var(--theme-relation-1))] to-[hsl(var(--theme-relation-2))]',
      bubbleBg: 'bg-[hsl(var(--theme-relation-1)/0.3)]',
    },
    relocation: {
      liquid1: 'bg-[hsl(var(--theme-moving-1)/0.15)]',
      liquid2: 'bg-[hsl(var(--theme-moving-2)/0.12)]',
      accent: 'from-[hsl(var(--theme-moving-1))] to-[hsl(var(--theme-moving-2))]',
      bubbleBg: 'bg-[hsl(var(--theme-moving-1)/0.3)]',
    },
  };

  const theme = themeClasses[scenario];

  useEffect(() => {
    // Step 1: Greeting
    simulateMentorMessage(`Hola ${userName}, ¿qué quieres consultar hoy sobre tu ${SCENARIO_LABELS[scenario]}?`);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const simulateMentorMessage = (text: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'mentor', text }]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const handleSend = () => {
    if (!input.trim() || step === 6) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);

    if (step === 1) {
      // User asked their question (step 2), mentor asks for context (step 3)
      setStep(3);
      simulateMentorMessage(FOLLOW_UP[scenario]);
    } else if (step === 3) {
      // User provided context (step 4), mentor gives final insight (step 5)
      setStep(5);
      setIsTyping(true);
      setTimeout(() => {
        const insight = generateInsight(scenario, pathNumber);
        const fullInsight = `**Análisis de Situación:**\n${insight.analysis}\n\n**Sugerencias:**\n${insight.suggestions}\n\n**Acción Concreta:**\n${insight.action}`;
        setMessages(prev => [...prev, { role: 'mentor', text: fullInsight }]);
        setIsTyping(false);

        // Save consultation
        addConsultation({
          id: Date.now().toString(),
          scenario,
          date: new Date().toLocaleDateString(),
          insight: {
            reason: insight.analysis,
            advice: insight.suggestions,
            actions: [insight.action],
          },
        });

        // Step 6: Closure
        setTimeout(() => {
          setStep(6);
          setMessages(prev => [...prev, { role: 'mentor', text: 'Has recibido tu guía de hoy. Reflexiona y vuelve mañana. ✨' }]);
        }, 1500);
      }, 2000 + Math.random() * 1000);
    }
  };

  const renderMessageText = (text: string) => {
    // Parse bold markers **text**
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <span key={i} className="block mt-3 mb-1 font-lora font-bold text-heading text-sm">
            {part.slice(2, -2)}
          </span>
        );
      }
      return part.split('\n').map((line, j) => (
        <span key={`${i}-${j}`}>
          {j > 0 && <br />}
          {line}
        </span>
      ));
    });
  };

  return (
    <div className="flex flex-col h-screen bg-background grain-overlay relative overflow-hidden">
      {/* Themed liquid light background */}
      <div className={`absolute top-[-20%] right-[-15%] w-[55%] h-[55%] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] ${theme.liquid1} blur-3xl opacity-60 animate-float pointer-events-none`} />
      <div className={`absolute bottom-[-15%] left-[-10%] w-[50%] h-[50%] rounded-[60%_40%_30%_70%/50%_60%_40%_50%] ${theme.liquid2} blur-3xl opacity-50 pointer-events-none`} style={{ animation: 'float 6s ease-in-out infinite reverse' }} />

      {/* Header */}
      <div className={`relative z-10 px-5 pt-12 pb-4 bg-gradient-to-r ${theme.accent} bg-opacity-20`} style={{ background: `linear-gradient(135deg, hsl(var(--background)), hsl(var(--card)))` }}>
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-sm text-body hover:text-heading transition-colors">
            ← Volver
          </button>
          <div className="flex-1 text-center">
            <h1 className="font-lora text-lg font-bold text-heading">{SCENARIO_LABELS[scenario]}</h1>
            <p className="text-xs text-body">Sesión con tu Mentor</p>
          </div>
          <div className="w-12" />
        </div>
      </div>

      {/* Chat messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 relative z-10">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div
              className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'mentor'
                  ? `glass shadow-soft text-body ${msg.text.includes('Has recibido') ? 'border border-success/30 bg-success/5' : ''}`
                  : `${theme.bubbleBg} backdrop-blur-sm text-heading`
              }`}
            >
              {msg.role === 'mentor' ? renderMessageText(msg.text) : msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="glass rounded-2xl px-4 py-3 shadow-soft">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="relative z-10 px-4 pb-6 pt-3 glass border-t border-border">
        {step === 6 ? (
          <div className="flex items-center justify-center gap-2 py-3 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            <span className="font-lato">Sesión completada</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Escribe tu mensaje..."
              disabled={isTyping}
              className="flex-1 rounded-xl border border-border bg-card/50 px-4 py-3 text-sm text-foreground font-lato placeholder:text-muted-foreground outline-none transition-all focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl gradient-warm shadow-glow transition-transform active:scale-95 disabled:opacity-40"
            >
              <Send className="h-4 w-4 text-foreground" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
