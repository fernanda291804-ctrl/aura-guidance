import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Mode = 'login' | 'register';

const INVITE_CODE = import.meta.env.VITE_INVITE_CODE as string | undefined;

export default function Auth() {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteInput, setInviteInput] = useState('');
  const [inviteVerified, setInviteVerified] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerifyInvite = () => {
    if (!INVITE_CODE || inviteInput.trim() === INVITE_CODE) {
      setInviteVerified(true);
      setError('');
    } else {
      setError('Código de acceso incorrecto.');
    }
  };

  const handleModeSwitch = (m: Mode) => {
    setMode(m);
    setError('');
    if (m === 'login') setInviteVerified(false);
  };

  const handleSubmit = async () => {
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        navigate('/');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', data.user.id)
          .single();
        navigate(profile ? '/dashboard' : '/');
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 gradient-dashboard grain-overlay liquid-light">
      <div className="relative z-10 w-full max-w-sm">
        {/* Brand */}
        <div className="mb-10 flex flex-col items-center gap-2">
          <div className="h-16 w-16 rounded-full bg-white/25 backdrop-blur-sm border border-white/40 flex items-center justify-center mb-2">
            <Sparkles className="h-7 w-7 text-on-gradient" />
          </div>
          <h1 className="font-lora text-4xl font-bold text-on-gradient tracking-tight">KYROS</h1>
          <p className="text-on-gradient-muted text-center text-sm font-lato">Tu mentor de numerología</p>
        </div>

        {/* Tabs */}
        <div className="flex rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 p-1 mb-6">
          <button
            onClick={() => handleModeSwitch('login')}
            className={`flex-1 rounded-xl py-2.5 text-sm font-semibold font-lato transition-all ${mode === 'login' ? 'bg-white/80 text-heading shadow-sm' : 'text-on-gradient-muted'}`}
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => handleModeSwitch('register')}
            className={`flex-1 rounded-xl py-2.5 text-sm font-semibold font-lato transition-all ${mode === 'register' ? 'bg-white/80 text-heading shadow-sm' : 'text-on-gradient-muted'}`}
          >
            Registrarse
          </button>
        </div>

        {/* Register: invite code gate */}
        {mode === 'register' && !inviteVerified ? (
          <div className="space-y-4">
            <div className="rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 p-5 text-center">
              <Lock className="mx-auto h-8 w-8 text-on-gradient-muted mb-3" />
              <p className="text-sm text-on-gradient font-lato font-semibold mb-1">Acceso por invitación</p>
              <p className="text-xs text-on-gradient-muted font-lato">Ingresa tu código de acceso para crear una cuenta.</p>
            </div>
            <input
              type="text"
              value={inviteInput}
              onChange={e => setInviteInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleVerifyInvite()}
              placeholder="Código de acceso"
              className="w-full rounded-2xl border border-white/30 bg-white/30 backdrop-blur-sm px-5 py-4 text-sm text-on-gradient placeholder:text-on-gradient-muted/60 outline-none transition-all focus:bg-white/50 focus:ring-2 focus:ring-white/40 font-lato"
            />
            {error && <p className="text-xs text-destructive font-lato text-center">{error}</p>}
            <button
              onClick={handleVerifyInvite}
              className="w-full rounded-2xl gradient-warm py-4 text-sm font-bold text-primary-foreground shadow-glow transition-transform active:scale-[0.98] font-lato"
            >
              Verificar código
            </button>
          </div>
        ) : (
          /* Login form or register form after code verified */
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-on-gradient-muted font-lato">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full rounded-2xl border border-white/30 bg-white/30 backdrop-blur-sm px-5 py-4 text-sm text-on-gradient placeholder:text-on-gradient-muted/60 outline-none transition-all focus:bg-white/50 focus:ring-2 focus:ring-white/40 font-lato"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-on-gradient-muted font-lato">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="Mínimo 6 caracteres"
                className="w-full rounded-2xl border border-white/30 bg-white/30 backdrop-blur-sm px-5 py-4 text-sm text-on-gradient placeholder:text-on-gradient-muted/60 outline-none transition-all focus:bg-white/50 focus:ring-2 focus:ring-white/40 font-lato"
              />
            </div>

            {error && (
              <p className="text-xs text-destructive font-lato text-center">{error}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-2xl gradient-warm py-4 text-sm font-bold text-primary-foreground shadow-glow transition-transform active:scale-[0.98] font-lato mt-2 disabled:opacity-60"
            >
              {loading ? 'Cargando...' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
