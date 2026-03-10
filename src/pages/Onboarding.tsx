import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Briefcase, Home, Heart } from 'lucide-react';
import { useApp, calculateNumbers, UserProfile } from '@/context/AppContext';
import PentagonChart from '@/components/PentagonChart';

type Phase = 'form' | 'loading' | 'explain' | 'guide';

export default function Onboarding() {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [errors, setErrors] = useState<{ name?: string; birthDate?: string }>({});
  const [phase, setPhase] = useState<Phase>('form');
  const [computedUser, setComputedUser] = useState<UserProfile | null>(null);
  const { setUser } = useApp();
  const navigate = useNavigate();

  const validate = () => {
    const errs: typeof errors = {};
    if (!name.trim()) errs.name = 'Por favor, ingresa tu nombre';
    if (!birthDate.trim()) {
      errs.birthDate = 'Por favor, ingresa tu fecha de nacimiento';
    } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
      errs.birthDate = 'Usa el formato DD/MM/AAAA';
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

  const handleContinue = () => {
    if (computedUser) {
      setUser(computedUser);
      setPhase('guide');
    }
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

          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3 rounded-2xl bg-white/20 backdrop-blur-sm p-4 border border-white/30">
              <div className="mt-0.5 h-4 w-4 shrink-0 rounded-full" style={{ background: 'linear-gradient(135deg, hsl(225 60% 82%), hsl(207 50% 68%))' }} />
              <div>
                <p className="text-sm font-semibold text-on-gradient font-lato">Números en azul — Tu esencia</p>
                <p className="text-xs text-on-gradient-muted font-lato mt-0.5">
                  La energía positiva predomina en estos números. Representan tus fortalezas naturales y dones innatos.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl bg-white/20 backdrop-blur-sm p-4 border border-white/30">
              <div className="mt-0.5 h-4 w-4 shrink-0 rounded-full" style={{ background: 'linear-gradient(135deg, hsl(248 60% 82%), hsl(248 50% 68%))' }} />
              <div>
                <p className="text-sm font-semibold text-heading font-lato">Números en morado — Tu reto</p>
                <p className="text-xs text-muted-foreground font-lato mt-0.5">
                  Predomina la energía negativa. Son tu desafío: vienes a aprender a vibrar en lo positivo de estos números.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleContinue}
            className="w-full rounded-xl gradient-warm py-3.5 text-sm font-bold text-primary-foreground shadow-glow transition-transform active:scale-[0.98] font-lato"
          >
            Explorar mi mapa
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'guide') {
    const territories = [
      {
        icon: Briefcase,
        title: 'Trabajo',
        color: 'hsl(var(--secondary))',
        text: 'Para tus grandes decisiones como cambiar de empleo o emprender, yo utilizaré tu Número de Camino. Es mi forma de asegurar que tu evolución profesional resuene con tu misión de vida.',
      },
      {
        icon: Home,
        title: 'Mudanza',
        color: 'hsl(var(--primary))',
        text: 'Ya sea un cambio de casa o de país, yo te daré consejos basados en tu Número de Camino. Te ayudaré a sintonizar con tu nuevo entorno para que el movimiento sea fluido.',
      },
      {
        icon: Heart,
        title: 'Relaciones',
        color: 'hsl(var(--pink))',
        text: 'Aquí la dinámica cambia. Para darte soluciones lógicas y profundas sobre tus vínculos, te pediré la fecha de nacimiento de la otra persona. Así, yo podré analizar su compatibilidad y frecuencia juntos.',
      },
    ];

    return (
      <div className="min-h-screen px-6 py-10 overflow-y-auto animate-fade-in gradient-dashboard grain-overlay">
        <div className="relative z-10 w-full max-w-sm mx-auto">
          <h1 className="text-center font-lora text-2xl font-bold text-on-gradient mb-2">
            Mis 3 Territorios de Guía
          </h1>
          <p className="text-center text-sm text-on-gradient-muted font-lato mb-8">
            En cada conversación, yo te acompañaré de una forma única
          </p>

          <div className="space-y-4 mb-8">
            {territories.map((t) => (
              <div
                key={t.title}
                className="rounded-2xl bg-white/90 backdrop-blur-md p-5 border border-white/50 shadow-card transition-transform active:scale-[0.98]"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: t.color }}
                  >
                    <t.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h2 className="font-lora text-lg font-semibold text-foreground">
                    {t.title}
                  </h2>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground font-lato">
                  {t.text}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={handleStartJourney}
            className="w-full rounded-xl gradient-warm py-3.5 text-sm font-bold text-primary-foreground shadow-glow transition-transform active:scale-[0.98] font-lato"
          >
            Comenzar mi camino
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
          <div className="h-16 w-16 rounded-full bg-white/25 backdrop-blur-sm border border-white/40 flex items-center justify-center mb-2">
            <Sparkles className="h-7 w-7 text-on-gradient" />
          </div>
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
