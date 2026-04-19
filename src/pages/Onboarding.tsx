import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, Heart } from 'lucide-react';
import { useApp, calculateNumbers, UserProfile } from '@/context/AppContext';
import PentagonChart from '@/components/PentagonChart';
import { supabase } from '@/lib/supabase';

type Phase = 'choose' | 'intro' | 'form' | 'loading' | 'explain' | 'guide';

function IllustrationSlot({ src, fallback, alt, className }: { src: string; fallback?: string; alt: string; className?: string }) {
  const [visible, setVisible] = useState(true);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleError = () => {
    if (fallback && currentSrc !== fallback) {
      setCurrentSrc(fallback);
    } else {
      setVisible(false);
    }
  };

  if (!visible) return null;
  return (
    <img
      src={currentSrc}
      alt={alt}
      onError={handleError}
      className={className}
    />
  );
}

const INTRO_STEPS = [
  {
    title: 'Vivimos rodeados de ruido.',
    body: 'En un mundo lleno de opiniones ajenas y estímulos constantes, ¿cuántas veces escuchas realmente a tu propia voz antes de elegir?',
    illustration: '/illustrations/intro-01.webp',
    illustrationFallback: '/illustrations/intro-01.png',
    btnLabel: 'Siguiente',
  },
  {
    title: 'Kyros es tu mentor personal.',
    body: 'No es un horóscopo, es una brújula. Usamos tu fecha de nacimiento como un código único para devolverte la claridad y ayudarte a decidir con seguridad.',
    illustration: '/illustrations/intro-02.webp',
    illustrationFallback: '/illustrations/intro-02.png',
    btnLabel: 'Siguiente',
  },
  {
    title: '5 números, una sola esencia.',
    body: 'Descifraremos tu Alma, Personalidad, Don, Vida Pasada y Camino. Juntos revelan tu mapa vibratorio para que entiendas quién eres y hacia dónde vas.',
    illustration: '/illustrations/intro-03.webp',
    illustrationFallback: '/illustrations/intro-03.png',
    btnLabel: 'Comenzar',
  },
];

export default function Onboarding() {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [errors, setErrors] = useState<{ name?: string; birthDate?: string }>({});
  const [phase, setPhase] = useState<Phase>('choose');
  const [introStep, setIntroStep] = useState(0);
  const [guideStep, setGuideStep] = useState(0);
  const [computedUser, setComputedUser] = useState<UserProfile | null>(null);
  const [saveError, setSaveError] = useState('');
  const { setUser, authUser } = useApp();
  const navigate = useNavigate();

  const validate = () => {
    const errs: typeof errors = {};
    if (!name.trim()) errs.name = 'Por favor, ingresa tu nombre';
    if (!birthDate.trim()) {
      errs.birthDate = 'Por favor, ingresa tu fecha de nacimiento';
    } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
      errs.birthDate = 'Usa el formato DD/MM/AAAA';
    } else {
      const [d, m, y] = birthDate.split('/').map(Number);
      const date = new Date(y, m - 1, d);
      const currentYear = new Date().getFullYear();
      if (
        m < 1 || m > 12 ||
        d < 1 ||
        y < 1900 || y > currentYear ||
        date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d
      ) {
        errs.birthDate = 'Ingresa una fecha de nacimiento válida';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setPhase('loading');
    const numbers = calculateNumbers(name, birthDate);
    const profile: UserProfile = { name: name.trim(), birthDate, numbers };
    setTimeout(() => {
      setComputedUser(profile);
      setPhase('explain');
    }, 2500);
  };

  const handleContinue = async () => {
    if (!computedUser) return;
    setSaveError('');
    setUser(computedUser);

    // Persist to Supabase if authenticated
    if (authUser) {
      const parts = computedUser.birthDate.split('/');
      const isoDate = `${parts[2]}-${parts[1]}-${parts[0]}`; // YYYY-MM-DD
      const { error } = await supabase.from('profiles').upsert({
        id: authUser.id,
        name: computedUser.name,
        birth_date: isoDate,
        soul: computedUser.numbers.soul,
        personality: computedUser.numbers.personality,
        past_life: computedUser.numbers.pastLife,
        gift: computedUser.numbers.gift,
        path: computedUser.numbers.path,
      });
      if (error) {
        setSaveError('No se pudo guardar tu perfil. Continúa de todos modos.');
      }
    }

    setPhase('guide');
  };

  const handleStartJourney = () => {
    navigate('/dashboard');
  };

  const formatBirthInput = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 8);
    let formatted = '';
    for (let i = 0; i < digits.length; i++) {
      if (i === 2 || i === 4) formatted += '/';
      formatted += digits[i];
    }
    setBirthDate(formatted);
  };

  if (phase === 'choose') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 gradient-dashboard grain-overlay liquid-light">
        <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
          <div className="mb-12 flex flex-col items-center gap-2">
            <h1 className="font-lora text-4xl font-bold text-on-gradient tracking-tight">KYROS</h1>
            <p className="text-on-gradient-muted text-center text-sm font-lato">Descubre tu esencia numerológica</p>
          </div>

          <p className="text-on-gradient-muted text-center text-sm font-lato mb-3">Antes de comenzar...</p>
          <p className="font-lora text-lg font-semibold text-on-gradient text-center mb-8">
            ¿Ya tienes experiencia con la numerología pitagórica?
          </p>

          <div className="w-full space-y-3">
            <button
              onClick={() => setPhase('form')}
              className="w-full rounded-2xl gradient-warm py-4 text-sm font-bold text-primary-foreground shadow-glow transition-transform active:scale-[0.98] font-lato"
            >
              Sí, la conozco
            </button>
            <button
              onClick={() => setPhase('intro')}
              className="w-full rounded-2xl bg-white/30 border border-white/30 backdrop-blur-sm py-4 text-sm font-bold text-on-gradient transition-transform active:scale-[0.98] font-lato"
            >
              Es mi primera vez
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'intro') {
    const step = INTRO_STEPS[introStep];
    const isLast = introStep === INTRO_STEPS.length - 1;
    return (
      <div
        className="relative flex flex-col overflow-hidden"
        style={{ background: '#FCFCFC', height: '100svh' }}
      >
        {/* ── Saltar — abs top-right, oculto en último slide ── */}
        {!isLast && (
          <button
            onClick={() => setPhase('form')}
            className="absolute z-10"
            style={{
              top: 20,
              right: 24,
              fontSize: 14,
              fontWeight: 600,
              color: '#6a5e7a',
              background: 'none',
              border: 'none',
            }}
          >
            Saltar
          </button>
        )}

        {/* ── Zona de ilustración (~55% alto) ── */}
        <div className="w-full overflow-hidden" style={{ flex: 1.1 }}>
          <IllustrationSlot
            key={introStep}
            src={step.illustration}
            fallback={step.illustrationFallback}
            alt={step.title}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* ── Contenido inferior ── */}
        <div className="flex flex-col px-8 pb-8 pt-4" style={{ flex: 1 }}>
          {/* Dots */}
          <div className="flex justify-center mb-4" style={{ gap: 6 }}>
            {INTRO_STEPS.map((_, i) => (
              <div
                key={i}
                style={{
                  height: 6,
                  borderRadius: 3,
                  transition: 'width 0.3s, background 0.3s',
                  width: i === introStep ? 20 : 6,
                  background: i === introStep ? '#7a6a9a' : '#8878a8',
                }}
              />
            ))}
          </div>

          {/* Título */}
          <h2
            className="font-lora text-center mb-3"
            style={{ fontSize: 22, fontWeight: 700, color: '#2a2035', lineHeight: 1.3 }}
          >
            {step.title}
          </h2>

          {/* Texto */}
          <p
            className="font-lato text-center mb-6"
            style={{ fontSize: 15, color: '#6a5e7a', lineHeight: 1.6, paddingLeft: 8, paddingRight: 8 }}
          >
            {step.body}
          </p>

          {/* Botón primario */}
          <button
            onClick={() => isLast ? setPhase('form') : setIntroStep(s => s + 1)}
            className="w-full font-lato active:scale-[0.98] transition-transform"
            style={{
              padding: '14px 0',
              borderRadius: 50,
              background: '#f0845a',
              color: '#ffffff',
              fontSize: 15,
              fontWeight: 700,
              border: 'none',
              textAlign: 'center',
            }}
          >
            {step.btnLabel}
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'loading') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 gradient-dashboard grain-overlay liquid-light">
        <div className="relative z-10 flex flex-col items-center">
          <div className="h-40 w-40 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 animate-shimmer" style={{ background: 'linear-gradient(270deg, hsl(16 100% 66% / 0.3), hsl(248 54% 58% / 0.25), hsl(16 100% 66% / 0.3))', backgroundSize: '400% 100%' }} />
          <p className="mt-8 font-lora text-xl text-on-gradient animate-pulse">
            Calculando tus números...
          </p>
          <p className="mt-2 text-sm text-on-gradient-muted font-lato">Alineando energías cósmicas</p>
        </div>
      </div>
    );
  }

  if (phase === 'explain' && computedUser) {
    const DIMENSIONS = [
      {
        key: 'soul' as const,
        label: 'Alma',
        hue: 225,
        desc: 'Tu esencia más profunda. Lo que eres antes de que el mundo opine.',
      },
      {
        key: 'personality' as const,
        label: 'Personalidad',
        hue: 248,
        desc: 'Lo que viniste a aprender en esta vida.',
      },
      {
        key: 'gift' as const,
        label: 'Don',
        hue: 225,
        desc: 'Tu tendencia genética. El talento que traes de origen.',
      },
      {
        key: 'pastLife' as const,
        label: 'Vida Pasada',
        hue: 225,
        desc: 'Conocerlo te da la oportunidad de recordarlo y recobrarlo.',
      },
      {
        key: 'path' as const,
        label: 'Camino',
        hue: 248,
        desc: 'Las decisiones que tomas en tu vida. Tu dirección natural.',
      },
    ];

    return (
      <div className="min-h-screen px-6 py-10 gradient-dashboard grain-overlay overflow-y-auto">
        <div className="relative z-10 w-full max-w-sm mx-auto">
          <h1 className="text-center font-lora text-2xl font-bold text-on-gradient mb-1">
            Tus 5 números
          </h1>
          <p className="text-center text-sm text-on-gradient-muted font-lato mb-4">
            Cada uno representa un aspecto diferente de tu vida
          </p>

          <div className="rounded-3xl bg-white/20 backdrop-blur-sm p-4 border border-white/30 mb-5">
            <PentagonChart numbers={computedUser.numbers} />
          </div>

          {/* Subtítulo de sección */}
          <p
            className="font-lora"
            style={{ fontSize: 18, fontWeight: 700, color: '#3a2e5a', marginBottom: 12 }}
          >
            ¿Qué significa cada uno?
          </p>

          {/* 5 cards de dimensiones */}
          <div className="mb-6" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {DIMENSIONS.map(({ key, label, hue, desc }) => (
              <div
                key={key}
                className="flex items-center gap-3"
                style={{ background: 'rgba(255,255,255,0.42)', borderRadius: 18, padding: '13px 15px' }}
              >
                {/* Esfera — mismo gradiente radial que el pentágono */}
                <div
                  className="flex flex-col items-center justify-center shrink-0"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: `radial-gradient(circle at 40% 35%, hsl(${hue} 60% 82%), hsl(${hue} 50% 68%))`,
                    boxShadow: '0 3px 8px hsl(225 40% 20% / 0.15)',
                  }}
                >
                  <span className="font-lora" style={{ fontSize: 18, fontWeight: 700, color: '#fff', lineHeight: 1 }}>
                    {computedUser.numbers[key]}
                  </span>
                  <span style={{ fontSize: label.length > 6 ? 6 : 7.5, color: 'rgba(255,255,255,0.85)', marginTop: 2, textAlign: 'center', lineHeight: 1, maxWidth: 42, overflow: 'hidden' }}>
                    {label}
                  </span>
                </div>

                {/* Texto */}
                <div>
                  <p className="font-lato" style={{ fontSize: 12, fontWeight: 700, color: '#1e1530', marginBottom: 3 }}>
                    {label}
                  </p>
                  <p className="font-lato" style={{ fontSize: 10.5, color: '#5a4e7a', lineHeight: 1.45 }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {saveError && (
            <p className="text-xs text-destructive font-lato text-center mb-2">{saveError}</p>
          )}
          <button
            onClick={handleContinue}
            className="w-full rounded-2xl gradient-warm py-3.5 text-sm font-bold text-primary-foreground shadow-glow transition-transform active:scale-[0.98] font-lato"
          >
            Explorar mi mapa
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'guide') {
    const isLastGuide = guideStep === 1;

    const GUIDE_META = [
      {
        title: 'Tu mentor está listo.',
        body: 'Kyros es un chat interactivo donde puedes contar tus problemas y recibir consejo basado en tus números. Te acompaña en 3 grandes campos de tu vida.',
        btnLabel: 'Siguiente',
      },
      {
        title: null,
        body: null,
        btnLabel: 'Comenzar',
      },
    ];

    const CATEGORIES = [
      {
        Icon: Briefcase,
        color: '#748DEA',
        label: 'Trabajo',
        desc: '¿Cambiar de empleo? ¿Emprender? Te digo si ese paso resuena con tu propósito.',
      },
      {
        Icon: MapPin,
        color: '#9DA1D5',
        label: 'Mudanza',
        desc: 'Te ayudo a entender si ese nuevo lugar es donde tu energía puede florecer.',
      },
      {
        Icon: Heart,
        color: '#C9A0AE',
        label: 'Relaciones',
        desc: 'Comparo tu frecuencia con la de otra persona para explicarte qué vienen a aprender juntos.',
      },
    ];

    const meta = GUIDE_META[guideStep];

    const renderUpper = () => {
      if (guideStep === 0) {
        return (
          <div className="w-full overflow-hidden flex items-center justify-center" style={{ flex: 1.1 }}>
            <IllustrationSlot
              key="guide-char"
              src="/illustrations/choose.webp"
              fallback="/illustrations/choose.png"
              alt="KYROS"
              className="h-full object-contain mix-blend-multiply"
            />
          </div>
        );
      }
      if (guideStep === 1) {
        return (
          <div className="flex flex-col justify-center px-6 gap-3" style={{ flex: 1 }}>
            {CATEGORIES.map(({ Icon, color, label, desc }) => (
              <div
                key={label}
                className="flex items-center gap-3"
                style={{ background: 'rgba(255,255,255,0.45)', borderRadius: 14, padding: '12px 14px' }}
              >
                <div
                  className="flex shrink-0 items-center justify-center"
                  style={{ width: 44, height: 44, borderRadius: 12, background: color }}
                >
                  <Icon style={{ width: 20, height: 20, color: 'white', strokeWidth: 2.2 }} />
                </div>
                <div>
                  <p className="font-lato" style={{ fontSize: 12, fontWeight: 700, color: '#1e1530', marginBottom: 2 }}>
                    {label}
                  </p>
                  <p className="font-lato" style={{ fontSize: 11, color: '#5a4e7a', lineHeight: 1.4 }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        );
      }
    };

    return (
      <div
        className={`relative flex flex-col overflow-hidden ${guideStep === 0 ? '' : 'gradient-dashboard grain-overlay liquid-light'}`}
        style={{ height: '100svh', background: guideStep === 0 ? '#FCFCFC' : undefined }}
      >
        {/* Saltar — oculto en slide 3 */}
        {!isLastGuide && (
          <button
            onClick={handleStartJourney}
            className="absolute z-10 font-lato"
            style={{ top: 20, right: 24, fontSize: 14, fontWeight: 600, color: '#6a5e7a', background: 'none', border: 'none' }}
          >
            Saltar
          </button>
        )}

        {/* Zona superior */}
        {renderUpper()}

        {/* Contenido inferior */}
        <div className={`flex flex-col px-8 pb-8 pt-4 ${guideStep === 1 ? 'shrink-0' : ''}`} style={{ flex: guideStep === 1 ? undefined : 1 }}>
          {/* Dots */}
          <div className="flex justify-center mb-4" style={{ gap: 6 }}>
            {[0, 1].map((i) => (
              <div
                key={i}
                style={{
                  height: 6,
                  borderRadius: 3,
                  transition: 'width 0.3s, background 0.3s',
                  width: i === guideStep ? 20 : 6,
                  background: i === guideStep ? '#5a4a7a' : '#6a5a8a',
                }}
              />
            ))}
          </div>

          {meta.title && (
            <h2
              className="font-lora text-center mb-3"
              style={{ fontSize: 22, fontWeight: 700, color: '#1e1530', lineHeight: 1.3 }}
            >
              {meta.title}
            </h2>
          )}

          {meta.body && (
            <p
              className="font-lato text-center mb-6"
              style={{ fontSize: 15, color: '#6a5e7a', lineHeight: 1.6 }}
            >
              {meta.body}
            </p>
          )}

          <button
            onClick={() => isLastGuide ? handleStartJourney() : setGuideStep(s => s + 1)}
            className="w-full font-lato active:scale-[0.98] transition-transform mt-auto"
            style={{ padding: '14px 0', borderRadius: 50, background: '#f0845a', color: '#ffffff', fontSize: 15, fontWeight: 700, border: 'none' }}
          >
            {meta.btnLabel}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 gradient-dashboard grain-overlay liquid-light">
      <div className="relative z-10 w-full max-w-sm">
        {/* Brand */}
        <div className="mb-12 flex flex-col items-center gap-2">
          <h1 className="font-lora text-4xl font-bold text-on-gradient tracking-tight">KYROS</h1>
          <p className="text-on-gradient-muted text-center text-sm font-lato">Descubre tu esencia numerológica</p>
        </div>

        {/* Inputs — floating, no card box */}
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-on-gradient-muted font-lato">
              Tu nombre
            </label>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setErrors(prev => ({ ...prev, name: undefined })); }}
              placeholder="Ingresa tu nombre completo"
              maxLength={100}
              className={`w-full rounded-2xl border bg-white/30 backdrop-blur-sm px-5 py-4 text-sm text-on-gradient placeholder:text-on-gradient-muted/60 outline-none transition-all focus:bg-white/50 focus:ring-2 focus:ring-white/40 font-lato ${errors.name ? 'border-destructive' : 'border-white/30'}`}
            />
            {errors.name && <p className="mt-1.5 text-xs text-destructive font-lato">{errors.name}</p>}
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-on-gradient-muted font-lato">
              Fecha de nacimiento
            </label>
            <input
              type="text"
              value={birthDate}
              onChange={e => { formatBirthInput(e.target.value); setErrors(prev => ({ ...prev, birthDate: undefined })); }}
              placeholder="DD/MM/AAAA"
              className={`w-full rounded-2xl border bg-white/30 backdrop-blur-sm px-5 py-4 text-sm text-on-gradient placeholder:text-on-gradient-muted/60 outline-none transition-all focus:bg-white/50 focus:ring-2 focus:ring-white/40 font-lato ${errors.birthDate ? 'border-destructive' : 'border-white/30'}`}
            />
            {errors.birthDate && <p className="mt-1.5 text-xs text-destructive font-lato">{errors.birthDate}</p>}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full rounded-2xl gradient-warm py-4 text-sm font-bold text-primary-foreground shadow-glow transition-transform active:scale-[0.98] font-lato mt-2"
          >
            Conocer mis números
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-on-gradient-muted/70 font-lato">
          Tus datos permanecen privados en tu dispositivo
        </p>
      </div>
    </div>
  );
}
