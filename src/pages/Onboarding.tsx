import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useApp, calculateNumbers } from '@/context/AppContext';

export default function Onboarding() {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [errors, setErrors] = useState<{ name?: string; birthDate?: string }>({});
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    const numbers = calculateNumbers(name, birthDate);
    setTimeout(() => {
      setUser({ name: name.trim(), birthDate, numbers });
      navigate('/dashboard');
    }, 2500);
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

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 gradient-dashboard grain-overlay">
        <div className="h-48 w-48 rounded-full animate-shimmer" style={{ background: 'linear-gradient(270deg, hsl(16 100% 66% / 0.5), hsl(248 54% 58% / 0.4), hsl(16 100% 66% / 0.5))', backgroundSize: '400% 100%' }} />
        <p className="mt-8 font-lora text-xl text-on-gradient animate-pulse">
          Calculando tus números...
        </p>
        <p className="mt-2 text-sm text-on-gradient-muted font-lato">Alineando energías cósmicas</p>
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
