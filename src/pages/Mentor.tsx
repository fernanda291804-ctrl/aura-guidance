import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Navigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import { Briefcase, MapPin, Heart, ArrowLeft, Send, Bookmark, Check } from 'lucide-react';
import { NUMBER_PROFILES } from '@/data/numberMeanings';

type Scenario = 'work' | 'relocation' | 'relationship';
type ChatStep = 'select' | 'greeting' | 'ask_situation' | 'ask_detail' | 'thinking' | 'insight' | 'first_response' | 'second_thinking' | 'rel_gathering' | 'rel_processing' | 'closed';

interface ChatMessage {
  role: 'mentor' | 'user';
  text: string;
  isRelBubble?: boolean; // relationship-themed bubble
}

interface RelationshipData {
  vinculo: string | null;
  birthDate: string | null;
  conflicto: string | null;
  otherNumber: number | null;
}

/** Reduce all digits of a date string to a single digit (1-9) */
function reduceToSingle(n: number): number {
  while (n > 9) {
    n = String(n).split('').reduce((a, b) => a + parseInt(b), 0);
  }
  return n;
}

function calculateOtherNumber(dateStr: string): number {
  const digits = dateStr.replace(/\D/g, '');
  const sum = digits.split('').reduce((a, b) => a + parseInt(b), 0);
  return reduceToSingle(sum);
}

/** Try to extract a date pattern from text (D/MM/YYYY, DD/MM/YYYY, DD-MM-YYYY, etc.) */
function extractDate(text: string): string | null {
  const match = text.match(/(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})/);
  return match ? match[0] : null;
}

/** Try to extract vínculo keywords */
function extractVinculo(text: string): string | null {
  const keywords = [
    { pattern: /\b(mam[aá]|madre)\b/i, label: 'Mamá' },
    { pattern: /\b(pap[aá]|padre)\b/i, label: 'Papá' },
    { pattern: /\b(pareja|novio|novia|esposo|esposa|marido|mujer)\b/i, label: 'Pareja' },
    { pattern: /\b(hermano|hermana)\b/i, label: 'Hermano/a' },
    { pattern: /\b(amigo|amiga)\b/i, label: 'Amigo/a' },
    { pattern: /\b(hijo|hija)\b/i, label: 'Hijo/a' },
    { pattern: /\b(jefe|jefa)\b/i, label: 'Jefe/a' },
    { pattern: /\b(socio|socia|compa[ñn]ero|compa[ñn]era)\b/i, label: 'Socio/a' },
    { pattern: /\b(abuelo|abuela)\b/i, label: 'Abuelo/a' },
    { pattern: /\b(t[ií]o|t[ií]a)\b/i, label: 'Tío/a' },
    { pattern: /\b(primo|prima)\b/i, label: 'Primo/a' },
    { pattern: /\b(suegro|suegra)\b/i, label: 'Suegro/a' },
    { pattern: /\b(cu[ñn]ado|cu[ñn]ada)\b/i, label: 'Cuñado/a' },
    { pattern: /\b(ex)\b/i, label: 'Ex' },
  ];
  for (const kw of keywords) {
    if (kw.pattern.test(text)) return kw.label;
  }
  return null;
}

/** Extract conflicto: text minus the date and vinculo keyword */
function extractConflicto(text: string, date: string | null, vinculo: string | null): string | null {
  let cleaned = text;
  if (date) cleaned = cleaned.replace(date, '').trim();
  // Remove common vinculo words
  cleaned = cleaned.replace(/\b(mi\s+)?(mam[aá]|madre|pap[aá]|padre|pareja|novio|novia|esposo|esposa|marido|mujer|hermano|hermana|amigo|amiga|hijo|hija|jefe|jefa|socio|socia|compa[ñn]ero|compa[ñn]era|abuelo|abuela|t[ií]o|t[ií]a|primo|prima|suegro|suegra|cu[ñn]ado|cu[ñn]ada|ex)\b/gi, '').trim();
  // Clean up punctuation artifacts
  cleaned = cleaned.replace(/^[\s,.\-;:]+|[\s,.\-;:]+$/g, '').trim();
  return cleaned.length > 5 ? cleaned : null;
}

/** Generate the numerological compatibility insight */
function generateRelationshipInsight(
  userName: string,
  userPathNumber: number,
  vinculo: string,
  otherNumber: number,
  conflicto: string
) {
  const userProfile = NUMBER_PROFILES[userPathNumber];
  const otherProfile = NUMBER_PROFILES[otherNumber];
  const name = userName.split(' ')[0];

  const userTitle = userProfile?.title || `vibración ${userPathNumber}`;
  const otherTitle = otherProfile?.title || `vibración ${otherNumber}`;

  // Dynamic tension analysis
  const tensions: Record<string, string> = {
    // Key archetype tensions
    '1': 'liderazgo e independencia',
    '2': 'protección y sensibilidad',
    '3': 'expresión y creatividad',
    '4': 'estructura y control',
    '5': 'libertad y movimiento',
    '6': 'amor incondicional y servicio',
    '7': 'sabiduría y soledad',
    '8': 'poder y seguridad',
    '9': 'entrega y cierre de ciclos',
  };

  const userEnergy = tensions[String(userPathNumber)] || 'tu propia frecuencia';
  const otherEnergy = tensions[String(otherNumber)] || 'su propia frecuencia';

  const bubble1 = `Entiendo el peso de esa situación, ${name}.\n\nTu ${vinculo.toLowerCase()} vibra en la frecuencia del **${otherNumber}** — **${otherTitle}** —, lo que significa que su energía se mueve desde ${otherEnergy}. Tú, como un **${userPathNumber}** — **${userTitle}** —, te mueves desde ${userEnergy}.\n\nEsa diferencia de frecuencias es justo lo que crea la fricción que sientes.`;

  const bubble2 = `Sobre lo que me compartes — _"${conflicto}"_ —, lo que yo veo es esto:\n\nTu ${vinculo.toLowerCase()}, desde su frecuencia **${otherNumber}**, necesita ${otherNumber === 8 ? 'sentir que tiene el control y la certeza de que todo estará bien' : otherNumber === 4 ? 'estabilidad y saber que las cosas siguen un orden' : otherNumber === 2 ? 'sentirse segura y protegida emocionalmente' : otherNumber === 6 ? 'sentir que el vínculo sigue intacto y que no se rompe la armonía' : otherNumber === 1 ? 'sentir que su opinión importa y que no pierde su lugar' : otherNumber === 9 ? 'soltar con amor, aunque eso le cueste profundamente' : otherNumber === 7 ? 'procesar internamente antes de aceptar un cambio' : otherNumber === 3 ? 'sentir conexión emocional y que la comunicación fluya' : 'comprender el cambio a su propio ritmo'}. Mientras que tú necesitas ${userPathNumber === 5 ? 'espacio para expandirte sin sentirte atrapado' : userPathNumber === 1 ? 'autonomía para tomar tus propias decisiones' : userPathNumber === 8 ? 'que respeten tu visión y tu autoridad' : userPathNumber === 4 ? 'certeza y un plan claro antes de actuar' : userPathNumber === 2 ? 'armonía sin perder tu propia voz' : userPathNumber === 6 ? 'dar amor sin sacrificarte' : userPathNumber === 3 ? 'expresarte libremente sin ser juzgado' : userPathNumber === 7 ? 'profundidad y honestidad en la conversación' : userPathNumber === 9 ? 'soltar sin culpa' : 'honrar tu propia frecuencia'}.\n\nEl puente entre ambos no es convencer, sino **traducir**: habla en el idioma de su frecuencia para que pueda escucharte.`;

  const bubble3 = `Antes de actuar, quiero que te hagas esta pregunta con total honestidad:\n\n_¿Estás buscando que tu ${vinculo.toLowerCase()} te entienda, o estás buscando que te dé permiso?_\n\nPorque si es lo primero, la conversación se trata de **conexión**. Si es lo segundo, la conversación que necesitas tener primero es contigo.`;

  const bubbleFarewell = `He compartido mi visión por hoy. Solo tenemos un encuentro al día para que tengas espacio de integrar esto.\n\nVuelve mañana.`;

  return { bubble1, bubble2, bubble3, bubbleFarewell };
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
    bg: 'linear-gradient(180deg, hsl(230 30% 92%) 0%, hsl(233 35% 85%) 100%)',
    mentorBubble: 'rgba(157, 161, 213, 0.15)',
    accent: '#9DA1D5',
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

function generateRelocationFirstResponse(pathNumber: number, userName: string) {
  const profile = NUMBER_PROFILES[pathNumber];
  const name = userName.split(' ')[0];
  if (!profile) {
    return `Te escucho, ${name}. Cruzar una frontera es un acto de transformación profunda. Tu frecuencia vibra con la necesidad de expandirte y encontrar un espacio que resuene con quien te estás convirtiendo.\n\nPara que este gran salto sea exitoso, mi mejor consejo es que limpies tu energía soltando lo que ya no te nutre antes de cerrar la maleta. Viaja ligero; tu capacidad de adaptación es tu mayor superpoder, pero necesitas espacio vacío para recibir lo que ese nuevo lugar tiene para ti.\n\nAntes de que empieces con la logística, dime: ¿Qué parte de tu esencia esperas que despierte en ese nuevo destino que hoy sientes que está dormida?`;
  }
  return `Te escucho, ${name}. Cruzar una frontera es el acto de libertad más puro que puedes vivir, y para tu frecuencia **${pathNumber}** — **${profile.title}** —, este movimiento es la respuesta de tu alma a una necesidad de aire nuevo y expansión que ya no cabe donde estás.\n\nPara que este gran salto sea exitoso, mi mejor consejo es que limpies tu energía soltando lo que ya no te nutre antes de cerrar la maleta. Viaja ligero; tu capacidad de adaptación es tu mayor superpoder, pero necesitas espacio vacío para recibir lo que ese nuevo lugar tiene para ti.\n\nAntes de que empieces con la logística, dime: ¿Qué parte de tu esencia esperas que despierte en ese nuevo destino que hoy sientes que está dormida?`;
}

function generateRelocationSecondResponse(pathNumber: number, userName: string) {
  const profile = NUMBER_PROFILES[pathNumber];
  const name = userName.split(' ')[0];
  if (!profile) {
    return {
      insight: `Es natural que el ruido de la logística intente apagar tu entusiasmo, ${name}, pero recuerda: el cambio es tu estado natural de crecimiento, aunque el caos a veces te haga sentir que pierdes el control.\n\nPara que no te satures, yo te sugiero este primer paso: suelta la lista completa y elige solo una cosa que resolver hoy. Tu energía brilla cuando fluye, no cuando se angustia por el futuro. Enfocarte en lo inmediato calmará tu sistema y te devolverá la claridad para dar el siguiente paso.\n\nAntes de que sigas con los pendientes, dime: Si hoy pudieras resolver una sola cosa que te diera paz absoluta, ¿qué sería?`,
      farewell: `He compartido mi visión por hoy. Ahora te dejo este espacio para que integres lo que hablamos; la calma llega cuando dejas de correr. Estaré aquí mañana para escucharte de nuevo.`,
    };
  }
  return {
    insight: `Es natural que el ruido de la logística intente apagar tu entusiasmo, ${name}, pero recuerda: para tu frecuencia **${pathNumber}** — **${profile.title}** —, el cambio es tu estado natural de crecimiento, aunque el caos a veces te haga sentir que pierdes el control.\n\nPara que no te satures, yo te sugiero este primer paso: suelta la lista completa y elige solo una cosa que resolver hoy. Tu energía brilla cuando fluye, no cuando se angustia por el futuro. Enfocarte en lo inmediato calmará tu sistema y te devolverá la claridad para dar el siguiente paso.\n\nAntes de que sigas con los pendientes, dime: Si hoy pudieras resolver una sola cosa que te diera paz absoluta, ¿qué sería?`,
    farewell: `He compartido mi visión por hoy. Ahora te dejo este espacio para que integres lo que hablamos; la calma llega cuando dejas de correr. Estaré aquí mañana para escucharte de nuevo.`,
  };
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
  const [relData, setRelData] = useState<RelationshipData>({ vinculo: null, birthDate: null, conflicto: null, otherNumber: null });
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, step]);

  if (!user) return <Navigate to="/" replace />;

  const addMsg = (role: ChatMessage['role'], text: string, isRelBubble = false) => {
    setMessages(prev => [...prev, { role, text, isRelBubble }]);
  };

  // Keep backward compat
  const addMessage = (role: ChatMessage['role'], text: string) => addMsg(role, text);

  const handleSelect = (s: Scenario) => {
    setScenario(s);
    const name = user.name.split(' ')[0];

    if (s === 'relationship') {
      setStep('rel_gathering');
      setRelData({ vinculo: null, birthDate: null, conflicto: null, otherNumber: null });
      setMessages([{
        role: 'mentor',
        text: `Hola ${name}, qué gusto saludarte.\n\nSoy **KYROS**, y estoy aquí para acompañarte en el terreno más importante: tus vínculos.\n\nPara darte una lectura profunda, necesito tres cosas:\n\n1. **¿Con quién es?** (ej. mamá, pareja, amigo)\n2. **Su fecha de nacimiento** (ej. 9/02/1968)\n3. **¿Qué está pasando?** (ej. 'no sé cómo decirle que me quiero mudar')\n\nPuedes decírmelo todo junto o paso a paso. Aquí estoy para escucharte.`,
      }]);
    } else {
      setStep('greeting');
      const greetings: Record<Scenario, string> = {
        work: `Hola ${name}, qué gusto saludarte.\n\nSoy **KYROS**, y estoy aquí para acompañarte en tu evolución profesional. Cuéntame, ¿en qué tema de tu trabajo o relacionado con él necesitas ayuda hoy?\n\nDime, ¿cómo te puedo ayudar a encontrar claridad en tu siguiente paso?`,
        relocation: `Hola ${name}. Soy **KYROS** y estoy aquí para acompañarte en este cambio de espacio y energía.\n\nCuéntame, ¿en qué parte de tu mudanza o de tu nuevo hogar necesitas mi ayuda hoy? Dime, ¿cómo te puedo ayudar a sintonizar con tu nuevo centro?`,
        relationship: '',
      };
      setMessages([{ role: 'mentor', text: greetings[s] }]);
    }
  };

  /** Process relationship data gathering */
  const handleRelationshipInput = (text: string) => {
    const updated = { ...relData };
    const foundDate = extractDate(text);
    const foundVinculo = extractVinculo(text);
    const foundConflicto = extractConflicto(text, foundDate, foundVinculo);

    if (foundVinculo && !updated.vinculo) updated.vinculo = foundVinculo;
    if (foundDate && !updated.birthDate) {
      updated.birthDate = foundDate;
      updated.otherNumber = calculateOtherNumber(foundDate);
    }
    if (foundConflicto && !updated.conflicto) updated.conflicto = foundConflicto;

    setRelData(updated);

    const name = user.name.split(' ')[0];

    // Check what's still missing
    const missing: string[] = [];
    if (!updated.vinculo) missing.push('**el vínculo** (¿quién es esta persona para ti?)');
    if (!updated.birthDate) missing.push('**su fecha de nacimiento** (día/mes/año)');
    if (!updated.conflicto) missing.push('**la situación** que quieres resolver');

    if (missing.length > 0) {
      setTimeout(() => {
        addMessage('mentor', `Gracias, ${name}. Para completar tu lectura, aún necesito:\n\n${missing.map((m, i) => `${i + 1}. ${m}`).join('\n')}\n\nTómate tu tiempo.`);
      }, 600);
    } else {
      // All data gathered — process and send multi-bubble response
      setStep('rel_processing');
      const insight = generateRelationshipInsight(
        user.name,
        user.numbers.path,
        updated.vinculo!,
        updated.otherNumber!,
        updated.conflicto!
      );

      // Bubble 1: Validation + number contrast
      setTimeout(() => {
        addMsg('mentor', insight.bubble1, true);

        // Bubble 2: Logical advice
        setTimeout(() => {
          addMsg('mentor', insight.bubble2, true);

          // Bubble 3: Reflection question
          setTimeout(() => {
            addMsg('mentor', insight.bubble3, true);

            // Bubble 4: Daily limit + save
            setTimeout(() => {
              addMsg('mentor', insight.bubbleFarewell, false);
              setStep('closed');
            }, 1800);
          }, 2000);
        }, 2200);
      }, 1500);
    }
  };

  const handleSend = () => {
    if (!input.trim() || !scenario) return;
    const text = input.trim();
    setInput('');

    // Relationship flow
    if (scenario === 'relationship' && step === 'rel_gathering') {
      addMessage('user', text);
      handleRelationshipInput(text);
      return;
    }

    if (step === 'greeting') {
      addMessage('user', text);
      setUserContext(text);

      if (scenario === 'relocation') {
        setTimeout(() => {
          addMessage('mentor', generateRelocationFirstResponse(user.numbers.path, user.name));
          setStep('first_response');
        }, 800);
      } else {
        const profile = NUMBER_PROFILES[user.numbers.path];
        const name = user.name.split(' ')[0];
        setTimeout(() => {
          addMessage('mentor', DETAIL_QUESTIONS[scenario](name, user.numbers.path, profile));
          setStep('ask_detail');
        }, 800);
      }
    } else if (step === 'first_response' && scenario === 'relocation') {
      addMessage('user', text);
      setStep('second_thinking');
      setTimeout(() => {
        const response = generateRelocationSecondResponse(user.numbers.path, user.name);
        addMessage('mentor', response.insight);
        setStep('closed');
        setTimeout(() => {
          addMessage('mentor', response.farewell);
        }, 1200);
      }, 2500);
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

    if (scenario === 'relationship' && relData.vinculo && relData.otherNumber && relData.conflicto) {
      const insight = generateRelationshipInsight(user.name, user.numbers.path, relData.vinculo, relData.otherNumber, relData.conflicto);
      addConsultation({
        id: Date.now().toString(),
        scenario,
        date: new Date().toLocaleDateString('es-ES'),
        insight: {
          reason: insight.bubble1,
          advice: insight.bubble2,
          actions: [insight.bubble3],
        },
      });
    } else {
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
    }
    setSaved(true);
  };

  const handleReset = () => {
    setStep('select');
    setScenario(null);
    setMessages([]);
    setInput('');
    setUserContext('');
    setSaved(false);
    setRelData({ vinculo: null, birthDate: null, conflicto: null, otherNumber: null });
  };

  const theme = scenario ? SCENARIO_THEMES[scenario] : null;

  // Chat view
  if (step !== 'select' && scenario) {
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
            <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: scenario === 'work' ? '#738DE1' : scenario === 'relocation' ? '#9DA1D5' : '#DBC0C9' }}>
              {scenario === 'work' ? <Briefcase className="h-4 w-4 text-white" /> : scenario === 'relocation' ? <MapPin className="h-4 w-4 text-white" /> : <Heart className="h-4 w-4 text-white" />}
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
                    ? 'rounded-br-md'
                    : 'rounded-bl-md'
                }`}
                style={
                  msg.role === 'user'
                    ? {
                        background: 'hsl(var(--primary))',
                        color: 'hsl(var(--primary-foreground))',
                      }
                    : msg.isRelBubble
                    ? {
                        background: '#4683DB',
                        color: '#FFFFFF',
                        border: 'none',
                      }
                    : {
                        background: '#F8F9FE',
                        border: '1px solid rgba(115, 141, 225, 0.12)',
                        color: 'hsl(var(--foreground))',
                      }
                }
              >
                <RichText text={msg.text} />
              </div>
            </div>
          ))}

          {(step === 'thinking' || step === 'second_thinking' || step === 'rel_processing') && (
            <div className="flex justify-start">
              <div
                className="rounded-2xl rounded-bl-md px-4 py-3"
                style={{
                  background: '#F8F9FE',
                  border: '1px solid rgba(115, 141, 225, 0.12)',
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
        {(step === 'greeting' || step === 'ask_detail' || step === 'first_response' || step === 'rel_gathering') && (
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

        {step !== 'greeting' && step !== 'ask_detail' && step !== 'rel_gathering' && <div className="pb-20" />}
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
