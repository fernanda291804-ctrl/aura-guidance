import { useState } from 'react';
import { useApp, calculateNumbers } from '@/context/AppContext';
import { Navigate } from 'react-router-dom';
import { User, Calendar, Hash, Pencil, Loader2, ChevronDown, ChevronUp, Sparkles, CloudLightning, Compass } from 'lucide-react';
import { NUMBER_DESCRIPTIONS, NUMBER_PROFILES } from '@/data/numberMeanings';
import { NumberSection } from '@/components/NumberSection';
import { supabase } from '@/lib/supabase';

export default function Profile() {
  const { user, setUser, authUser } = useApp();
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [birthInput, setBirthInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  if (!user) return <Navigate to="/" replace />;

  const numberList = [
    { label: 'Alma', key: 'soul', value: user.numbers.soul },
    { label: 'Personalidad', key: 'personality', value: user.numbers.personality },
    { label: 'Don', key: 'gift', value: user.numbers.gift },
    { label: 'Vida Pasada', key: 'pastLife', value: user.numbers.pastLife },
    { label: 'Camino', key: 'path', value: user.numbers.path },
  ];

  const openEdit = () => {
    setNameInput(user.name);
    setBirthInput(user.birthDate);
    setError('');
    setEditing(true);
  };

  const formatBirthInput = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 8);
    let formatted = '';
    for (let i = 0; i < digits.length; i++) {
      if (i === 2 || i === 4) formatted += '/';
      formatted += digits[i];
    }
    setBirthInput(formatted);
  };

  const handleSave = async () => {
    if (!nameInput.trim()) {
      setError('Por favor, ingresa tu nombre');
      return;
    }
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthInput)) {
      setError('Usa el formato DD/MM/AAAA');
      return;
    }
    const [d, m, y] = birthInput.split('/').map(Number);
    const date = new Date(y, m - 1, d);
    const currentYear = new Date().getFullYear();
    if (
      m < 1 || m > 12 ||
      d < 1 ||
      y < 1900 || y > currentYear ||
      date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d
    ) {
      setError('Ingresa una fecha de nacimiento válida');
      return;
    }

    setSaving(true);
    setError('');

    const numbers = calculateNumbers(nameInput, birthInput);
    const updatedProfile = { name: nameInput.trim(), birthDate: birthInput, numbers };

    if (authUser) {
      const parts = birthInput.split('/');
      const isoDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      const { error: dbError } = await supabase.from('profiles').upsert({
        id: authUser.id,
        name: updatedProfile.name,
        birth_date: isoDate,
        soul: numbers.soul,
        personality: numbers.personality,
        past_life: numbers.pastLife,
        gift: numbers.gift,
        path: numbers.path,
      });
      if (dbError) {
        setError('No se pudo guardar. Intenta de nuevo.');
        setSaving(false);
        return;
      }
    }

    setUser(updatedProfile);
    setSaving(false);
    setEditing(false);
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8 gradient-dashboard grain-overlay">
      <div className="px-6 pb-6 pt-12">
        {editing ? (
          <div className="space-y-3">
            <h1 className="font-lora text-2xl font-bold text-on-gradient">Editar perfil</h1>
            <p className="text-sm text-on-gradient-muted font-lato">Actualiza tu nombre o fecha de nacimiento</p>
            <div className="pt-2">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-on-gradient-muted font-lato">
                Tu nombre
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                maxLength={100}
                className="w-full rounded-2xl border border-white/30 bg-white/30 backdrop-blur-sm px-4 py-3 text-sm text-on-gradient placeholder:text-on-gradient-muted/60 outline-none focus:bg-white/50 focus:ring-2 focus:ring-white/40 font-lato"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-on-gradient-muted font-lato">
                Fecha de nacimiento
              </label>
              <input
                type="text"
                value={birthInput}
                onChange={e => formatBirthInput(e.target.value)}
                placeholder="DD/MM/AAAA"
                className="w-full rounded-2xl border border-white/30 bg-white/30 backdrop-blur-sm px-4 py-3 text-sm text-on-gradient placeholder:text-on-gradient-muted/60 outline-none focus:bg-white/50 focus:ring-2 focus:ring-white/40 font-lato"
              />
            </div>
            {error && <p className="text-xs text-destructive font-lato">{error}</p>}
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl gradient-warm py-3 text-sm font-bold text-primary-foreground shadow-glow transition-transform active:scale-[0.98] font-lato disabled:opacity-60"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Guardar'}
              </button>
              <button
                onClick={() => setEditing(false)}
                disabled={saving}
                className="flex-1 rounded-2xl border border-white/40 bg-white/20 py-3 text-sm font-semibold text-on-gradient backdrop-blur-sm transition-transform active:scale-[0.98] font-lato disabled:opacity-60"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/40 backdrop-blur-sm border border-white/50 shadow-card">
              <User className="h-8 w-8 text-on-gradient" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-lora text-2xl font-bold text-on-gradient truncate">{user.name}</h1>
              <div className="mt-0.5 flex items-center gap-1.5 text-sm text-on-gradient-muted font-lato">
                <Calendar className="h-3.5 w-3.5 shrink-0" /> {user.birthDate}
              </div>
            </div>
            <button
              onClick={openEdit}
              aria-label="Editar perfil"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/30 bg-white/20 backdrop-blur-sm transition-transform active:scale-[0.98]"
            >
              <Pencil className="h-4 w-4 text-on-gradient" />
            </button>
          </div>
        )}
      </div>

      <div className="px-6 mt-4">
        <h2 className="mb-3 flex items-center gap-2 font-lora text-base font-semibold text-on-gradient">
          <Hash className="h-4 w-4 text-on-gradient-muted" /> Tus números
        </h2>
        <div className="space-y-3">
          {numberList.map(n => {
            const profile = NUMBER_PROFILES[n.value];
            const isExpanded = expandedKey === n.key;
            return (
              <div key={n.label} className="rounded-xl bg-white/90 backdrop-blur-md border border-white/50 shadow-soft overflow-hidden">
                <button
                  className="flex w-full items-center gap-4 p-4 text-left"
                  onClick={() => setExpandedKey(isExpanded ? null : n.key)}
                  aria-expanded={isExpanded}
                  aria-controls={`number-detail-${n.key}`}
                  aria-label={`${isExpanded ? 'Cerrar' : 'Ver'} detalles de ${n.label}`}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-secondary font-lora text-lg font-bold text-secondary-foreground">
                    {n.value}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-heading font-lato">{n.label}</p>
                    <p className="text-[11px] text-muted-foreground font-lato">{NUMBER_DESCRIPTIONS[n.key]}</p>
                    {profile && <p className="text-xs font-medium text-accent font-lato mt-0.5">{profile.title}</p>}
                  </div>
                  {isExpanded
                    ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                    : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  }
                </button>

                {isExpanded && profile && (
                  <div id={`number-detail-${n.key}`} role="region" aria-label={`Detalles de ${n.label}`} className="px-4 pb-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-semibold text-muted-foreground font-lato">{profile.subtitles}</span>
                      <span className="rounded-full bg-secondary/30 px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground font-lato">{profile.energyType}</span>
                    </div>

                    <p className="text-xs text-foreground/80 font-lato leading-relaxed">{profile.esencia}</p>

                    <NumberSection
                      title="Tu Luz"
                      icon={<Sparkles className="h-3 w-3 text-amber-500" />}
                      text={profile.luz}
                    />
                    <NumberSection
                      title="Tu Reto"
                      icon={<CloudLightning className="h-3 w-3 text-violet-500" />}
                      text={profile.sombra}
                    />
                    <NumberSection
                      title="Tu Misión"
                      icon={<Compass className="h-3 w-3 text-sky-500" />}
                      text={profile.mision}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
