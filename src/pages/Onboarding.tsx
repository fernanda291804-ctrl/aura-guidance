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
      <div className="flex min-h-screen flex-col items-center justify-center px-6 bg-white">
        <div className="h-48 w-48 rounded-full animate-shimmer" style={{ background: 'linear-gradient(270deg, hsl(16 100% 66% / 0.5), hsl(248 54% 58% / 0.4), hsl(16 100% 66% / 0.5))', backgroundSize: '400% 100%' }} />
        <p className="mt-8 font-lora text-xl text-foreground animate-pulse">
          Calculando tus números...
        </p>
        <p className="mt-2 text-sm text-muted-foreground font-lato">Alineando energías cósmicas</p>
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

          <div className="rounded-2xl bg-white/90 backdrop-blur-md p-4 shadow-card border border-white/50 mb-5">
            <PentagonChart numbers={computedUser.numbers} />
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3 rounded-xl bg-white/90 backdrop-blur-md p-4 border border-white/50 shadow-soft">
              <div className="mt-0.5 h-4 w-4 shrink-0 rounded-full" style={{ background: 'linear-gradient(135deg, hsl(225 60% 82%), hsl(207 50% 68%))' }} />
              <div>
                <p className="text-sm font-semibold text-heading font-lato">Números en azul — Tu esencia</p>
                <p className="text-xs text-muted-foreground font-lato mt-0.5">
                  La energía positiva predomina en estos números. Representan tus fortalezas naturales y dones innatos.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-white/90 backdrop-blur-md p-4 border border-white/50 shadow-soft">
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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 gradient-dashboard grain-overlay">
      <div className="relative z-10 w-full max-w-sm">
        <div className="mb-10 flex flex-col items-center gap-3">
          <h1 className="font-lora text-3xl font-bold text-on-gradient">KYROS</h1>
          <p className="text-on-gradient-muted text-center text-sm font-lato">Descubre tu esencia numerológica</p>
        </div>

        <div className="rounded-2xl bg-white/90 backdrop-blur-md p-6 shadow-card border border-white/50 space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-heading font-lato">Tu nombre</label>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setErrors(prev => ({ ...prev, name: undefined })); }}
              placeholder="Ingresa tu nombre completo"
              maxLength={100}
              className={`w-full rounded-xl border bg-white/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:ring-2 focus:ring-primary/50 font-lato ${errors.name ? 'border-destructive' : 'border-border'}`}
            />
            {errors.name && <p className="mt-1 text-xs text-destructive font-lato">{errors.name}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-heading font-lato">Fecha de nacimiento</label>
            <input
              type="text"
              value={birthDate}
              onChange={e => { formatBirthInput(e.target.value); setErrors(prev => ({ ...prev, birthDate: undefined })); }}
              placeholder="DD/MM/AAAA"
              className={`w-full rounded-xl border bg-white/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:ring-2 focus:ring-primary/50 font-lato ${errors.birthDate ? 'border-destructive' : 'border-border'}`}
            />
            {errors.birthDate && <p className="mt-1 text-xs text-destructive font-lato">{errors.birthDate}</p>}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full rounded-xl gradient-warm py-3.5 text-sm font-bold text-primary-foreground shadow-glow transition-transform active:scale-[0.98] font-lato"
          >
            Conocer mis números
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-on-gradient-muted/80 font-lato">
          Tus datos permanecen privados en tu dispositivo
        </p>
      </div>
    </div>
  );
}
