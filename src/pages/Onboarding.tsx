import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useApp, calculateNumbers } from '@/context/AppContext';

export default function Onboarding() {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [errors, setErrors] = useState<{ name?: string; birthDate?: string }>({});
  const { setUser } = useApp();
  const navigate = useNavigate();

  const validate = () => {
    const errs: typeof errors = {};
    if (!name.trim()) errs.name = 'Please enter your name';
    if (!birthDate.trim()) {
      errs.birthDate = 'Please enter your date of birth';
    } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
      errs.birthDate = 'Use format DD/MM/YYYY';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const numbers = calculateNumbers(name, birthDate);
    setUser({ name: name.trim(), birthDate, numbers });
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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 gradient-mystic">
      {/* Decorative orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/40 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="mb-10 flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-warm shadow-glow">
            <Sparkles className="h-8 w-8 text-foreground" />
          </div>
          <h1 className="font-lora text-3xl font-bold text-heading">Aura Path</h1>
          <p className="text-body text-center text-sm">Discover your numerological essence</p>
        </div>

        {/* Form */}
        <div className="glass rounded-2xl p-6 shadow-card space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-heading font-lato">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setErrors(prev => ({ ...prev, name: undefined })); }}
              placeholder="Enter your full name"
              maxLength={100}
              className={`w-full rounded-xl border bg-card/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:ring-2 focus:ring-primary/50 ${errors.name ? 'border-destructive' : 'border-border'}`}
            />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-heading font-lato">Date of Birth</label>
            <input
              type="text"
              value={birthDate}
              onChange={e => { formatBirthInput(e.target.value); setErrors(prev => ({ ...prev, birthDate: undefined })); }}
              placeholder="DD/MM/YYYY"
              className={`w-full rounded-xl border bg-card/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:ring-2 focus:ring-primary/50 ${errors.birthDate ? 'border-destructive' : 'border-border'}`}
            />
            {errors.birthDate && <p className="mt-1 text-xs text-destructive">{errors.birthDate}</p>}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full rounded-xl gradient-warm py-3.5 text-sm font-bold text-foreground shadow-glow transition-transform active:scale-[0.98]"
          >
            Reveal My Numbers
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Your data stays private on your device
        </p>
      </div>
    </div>
  );
}
