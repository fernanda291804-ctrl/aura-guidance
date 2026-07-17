import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';

export default function ResetPassword() {
  const { session, authLoading } = useApp();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center gradient-dashboard grain-overlay">
        <p className="text-on-gradient-muted font-lato text-sm">Cargando...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 gradient-dashboard grain-overlay liquid-light">
        <div className="relative z-10 w-full max-w-sm text-center">
          <h1 className="font-lora text-2xl font-bold text-on-gradient mb-2">Link no válido</h1>
          <p className="text-sm text-on-gradient-muted font-lato mb-6">
            Este link de recuperación ya expiró o no es válido. Pide uno nuevo desde la pantalla de inicio de sesión.
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="w-full rounded-2xl gradient-warm py-4 text-sm font-bold text-primary-foreground shadow-glow transition-transform active:scale-[0.98] font-lato"
          >
            Ir a iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 gradient-dashboard grain-overlay liquid-light">
      <div className="relative z-10 w-full max-w-sm">
        <div className="mb-10 flex flex-col items-center gap-2">
          <div className="h-16 w-16 rounded-full bg-white/25 backdrop-blur-sm border border-white/40 flex items-center justify-center mb-2">
            <Sparkles className="h-7 w-7 text-on-gradient" />
          </div>
          <h1 className="font-lora text-4xl font-bold text-on-gradient tracking-tight">KYROS</h1>
          <p className="text-on-gradient-muted text-center text-sm font-lato">Crea tu nueva contraseña</p>
        </div>

        {success ? (
          <div className="rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 p-5 text-center">
            <CheckCircle2 className="mx-auto h-8 w-8 text-on-gradient mb-3" />
            <p className="text-sm text-on-gradient font-lato font-semibold">Contraseña actualizada</p>
            <p className="text-xs text-on-gradient-muted font-lato mt-1">Te llevamos a tu cuenta...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-on-gradient-muted font-lato">
                Nueva contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full rounded-2xl border border-white/30 bg-white/30 backdrop-blur-sm px-5 py-4 text-sm text-on-gradient placeholder:text-on-gradient-muted/60 outline-none transition-all focus:bg-white/50 focus:ring-2 focus:ring-white/40 font-lato"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-on-gradient-muted font-lato">
                Confirmar contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="Repite tu contraseña"
                className="w-full rounded-2xl border border-white/30 bg-white/30 backdrop-blur-sm px-5 py-4 text-sm text-on-gradient placeholder:text-on-gradient-muted/60 outline-none transition-all focus:bg-white/50 focus:ring-2 focus:ring-white/40 font-lato"
              />
            </div>
            {error && <p className="text-xs text-destructive font-lato text-center">{error}</p>}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-2xl gradient-warm py-4 text-sm font-bold text-primary-foreground shadow-glow transition-transform active:scale-[0.98] font-lato disabled:opacity-60"
            >
              {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
