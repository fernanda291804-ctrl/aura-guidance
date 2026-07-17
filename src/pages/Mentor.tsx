import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Check, Loader2, Lock, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Hard ceiling in case the mentor never signals a real conclusion — the
// session normally closes earlier, when the topic is actually resolved.
const SAFETY_MAX_USER_MESSAGES = 8;
const SESSION_WINDOW_MS = 86400000;
// Must match the tokens in supabase/functions/chat/index.ts
const SPLIT_TOKEN = '[[SPLIT]]';
const CONCLUDED_TOKEN = '[[CONCLUDED]]';

interface ChatMessage {
  role: 'mentor' | 'user';
  text: string;
  streaming?: boolean;
}

interface DbMessage {
  role: 'user' | 'assistant';
  content: string;
}

function getGreeting(name: string): string {
  const first = name.split(' ')[0];
  return `Hola ${first}, dime ¿en qué te puedo ayudar hoy?`;
}

const SUGGESTED_PROMPTS = [
  '¿Debería aceptar este nuevo trabajo que me ofrecieron?',
  '¿Es buen momento para mudarme de ciudad?',
  '¿Esta relación potencia mi camino o me frena?',
  'Siento que estoy estancado, ¿qué me dicen mis números?',
  '¿Cuál es mi propósito según mi mapa numerológico?',
];

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
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [saved, setSaved] = useState(false);
  const [persistError, setPersistError] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [sessionClosed, setSessionClosed] = useState(false);
  const [nextUnlockAt, setNextUnlockAt] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Grow the input with the text, up to 5 lines, then it scrolls internally
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [input]);

  // Load today's session (if any) or greet fresh
  useEffect(() => {
    if (!authUser || !user) {
      setInitializing(false);
      return;
    }
    const since = new Date(Date.now() - SESSION_WINDOW_MS).toISOString();
    (async () => {
      const { data: convos } = await supabase
        .from('conversations')
        .select('id, created_at, concluded')
        .eq('user_id', authUser.id)
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(1);

      const convo = convos?.[0];
      if (convo) {
        setConversationId(convo.id);
        setNextUnlockAt(new Date(new Date(convo.created_at).getTime() + SESSION_WINDOW_MS));
        const { data: msgs } = await supabase
          .from('messages')
          .select('role, content')
          .eq('conversation_id', convo.id)
          .order('created_at', { ascending: true });
        const loaded: ChatMessage[] = ((msgs as DbMessage[]) ?? []).map(m => ({
          role: m.role === 'user' ? 'user' : 'mentor',
          text: m.content,
        }));
        setMessages(loaded);
        const userCount = loaded.filter(m => m.role === 'user').length;
        setSessionClosed(Boolean(convo.concluded) || userCount >= SAFETY_MAX_USER_MESSAGES);
        if (userCount > 0) setSaved(true);
      } else {
        setMessages([{ role: 'mentor', text: getGreeting(user.name) }]);
      }
      setInitializing(false);
    })();
  }, [authUser]);

  // Countdown to next session, resets to a fresh greeting once it unlocks
  useEffect(() => {
    if (!nextUnlockAt) return;
    const update = () => {
      const diff = nextUnlockAt.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft('');
        setNextUnlockAt(null);
        setSessionClosed(false);
        setConversationId(null);
        setSaved(false);
        if (user) setMessages([{ role: 'mentor', text: getGreeting(user.name) }]);
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setTimeLeft(h > 0 ? `${h}h ${m}min` : `${m}min`);
    };
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, [nextUnlockAt, user]);

  if (!user) return <Navigate to="/" replace />;

  const callAI = async (apiMessages: { role: string; content: string }[]): Promise<string> => {
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
        userProfile: { name: user.name, numbers: user.numbers, gender: user.gender },
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

  const persistMessage = async (convId: string, role: 'user' | 'assistant', content: string) => {
    if (!authUser || !convId) return;
    const { error } = await supabase.from('messages').insert({ conversation_id: convId, role, content });
    if (error) {
      console.error('Error saving message:', error.message);
      setPersistError(true);
    }
  };

  const ensureConversation = async (): Promise<string | null> => {
    if (conversationId) return conversationId;
    if (!authUser) return null;
    const { data, error } = await supabase
      .from('conversations')
      .insert({ user_id: authUser.id, scenario: 'general' })
      .select('id')
      .single();
    if (error) {
      console.error('Error creating conversation:', error.message);
      setPersistError(true);
      return null;
    }
    const id = data?.id ?? null;
    if (id) {
      setConversationId(id);
      setNextUnlockAt(new Date(Date.now() + SESSION_WINDOW_MS));
      const greeting = messages[0];
      if (greeting) await persistMessage(id, 'assistant', greeting.text);
    }
    return id;
  };

  const handleSend = async () => {
    if (!input.trim() || loading || sessionClosed) return;

    const userText = input.trim();
    setInput('');

    const updatedMessages: ChatMessage[] = [...messages, { role: 'user', text: userText }];
    setMessages(updatedMessages);

    const convId = await ensureConversation();
    if (convId) await persistMessage(convId, 'user', userText);

    setLoading(true);
    const streamingIndex = updatedMessages.length;
    setMessages(prev => [...prev, { role: 'mentor', text: '', streaming: true }]);

    try {
      const apiMessages = updatedMessages.map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const rawText = await callAI(apiMessages);
      const concluded = rawText.includes(CONCLUDED_TOKEN);
      const fullText = rawText.split(CONCLUDED_TOKEN).join('');

      // KYROS replies in up to 3 short, consecutive WhatsApp-style bubbles
      const rawBubbles = fullText.split(SPLIT_TOKEN).map(part => part.trim()).filter(Boolean);
      const bubbles = rawBubbles.length > 0 ? rawBubbles : [fullText.trim()];

      setMessages(prev => {
        const next = [...prev];
        next.splice(streamingIndex, 1, ...bubbles.map(text => ({ role: 'mentor' as const, text, streaming: false })));
        return next;
      });

      if (convId) {
        for (const bubble of bubbles) {
          await persistMessage(convId, 'assistant', bubble);
        }
      }

      const userCount = updatedMessages.filter(m => m.role === 'user').length;
      if (concluded || userCount >= SAFETY_MAX_USER_MESSAGES) {
        setSessionClosed(true);
        if (convId) {
          const { error } = await supabase.from('conversations').update({ concluded: true }).eq('id', convId);
          if (error) console.error('Error marking conversation concluded:', error.message);
        }
      }

      if (bubbles.length > 0) {
        const firstUserMsg = updatedMessages.find(m => m.role === 'user')?.text || '';
        const ok = await addConsultation({
          id: convId ?? Date.now().toString(),
          scenario: 'general',
          date: new Date().toLocaleDateString('es-ES'),
          conversationId: convId ?? undefined,
          insight: {
            reason: firstUserMsg,
            advice: bubbles.join('\n\n'),
            actions: [],
          },
        });
        if (ok) setSaved(true);
      }
    } catch (err) {
      console.error('Error calling KYROS chat:', (err as Error).message);
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

  const applySuggestion = (prompt: string) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  if (initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: '#FFFFFF' }}>
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const showSuggestions = !sessionClosed && !loading && messages.filter(m => m.role === 'user').length === 0;

  return (
    <div className="flex min-h-screen flex-col" style={{ background: '#FFFFFF' }}>
      {/* Header */}
      <div
        className="border-b px-4 pb-3 pt-10"
        style={{
          background: 'hsla(0, 0%, 100%, 0.3)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          borderColor: 'hsla(0, 0%, 100%, 0.4)',
        }}
      >
        <div className="flex items-center gap-3 md:max-w-2xl md:mx-auto">
          <button onClick={() => navigate('/dashboard')} className="text-body">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex flex-1 items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{ background: 'hsl(var(--secondary))' }}
            >
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-base font-semibold text-heading font-lora">KYROS</p>
              <p className="text-xs text-body">
                {sessionClosed && timeLeft ? `Próxima sesión en ${timeLeft}` : 'Tu sesión de hoy'}
              </p>
            </div>
          </div>
          {sessionClosed && <Lock className="h-4 w-4 text-muted-foreground shrink-0" />}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-36">
        <div className="space-y-3 md:max-w-2xl md:mx-auto">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-base leading-relaxed font-lato break-words ${
                  msg.role === 'user' ? 'rounded-br-md' : 'rounded-bl-md'
                }`}
                style={
                  msg.role === 'user'
                    ? { background: 'hsl(var(--secondary))', color: 'hsl(0 0% 100%)' }
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

          {saved && sessionClosed && (
            <div className="pt-1">
              <div className="flex items-center justify-center gap-2 rounded-xl py-3 text-base font-semibold" style={{ background: 'hsl(160 50% 50% / 0.12)', color: 'hsl(160 50% 40%)' }}>
                <Check className="h-4 w-4" /> Guardado en tu Bitácora
              </div>
            </div>
          )}

          {persistError && (
            <div className="pt-1">
              <div className="rounded-xl py-3 px-4 text-center text-sm font-semibold" style={{ background: 'hsl(0 100% 65% / 0.1)', color: 'hsl(0 80% 45%)' }}>
                No se pudo guardar esta sesión. Si sales del chat, se perderá.
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input */}
      <div
        className="fixed bottom-16 left-0 right-0 md:bottom-0 md:left-60 border-t px-4 py-3"
        style={{
          background: 'hsla(0, 0%, 100%, 0.95)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          borderColor: 'hsla(0, 0%, 100%, 0.4)',
        }}
      >
        <div className="md:max-w-2xl md:mx-auto">
        {sessionClosed ? (
          <p className="text-center text-sm text-muted-foreground py-2">
            La sesión de hoy ha concluido. Vuelve mañana para un nuevo tema.
          </p>
        ) : (
          <>
            {showSuggestions && (
              <div className="flex gap-2 overflow-x-auto pb-3 -mx-1 px-1">
                {SUGGESTED_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => applySuggestion(prompt)}
                    className="shrink-0 rounded-full border border-border bg-card/70 px-3 py-1.5 text-xs text-foreground font-lato whitespace-nowrap transition-colors hover:bg-card"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Escribe tu mensaje..."
                disabled={loading}
                className="flex-1 resize-none rounded-xl border border-border bg-card/50 px-4 py-2.5 text-base leading-6 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 max-h-36 overflow-y-auto"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full gradient-warm shadow-glow transition-transform active:scale-95 disabled:opacity-40"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 text-foreground animate-spin" />
                ) : (
                  <Send className="h-4 w-4 text-foreground" />
                )}
              </button>
            </div>
          </>
        )}
        </div>
      </div>
    </div>
  );
}
