import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Sparkles, CloudLightning, Compass, Heart } from 'lucide-react';
import { NUMBER_LABELS, NUMBER_DESCRIPTIONS, NUMBER_PROFILES, NUMBER_SYNTHESIS, ROLE_MEANINGS } from '@/data/numberMeanings';
import { NumberSection } from '@/components/NumberSection';

export default function NumberDetail() {
  const { type } = useParams<{ type: string }>();
  const { user } = useApp();
  const navigate = useNavigate();

  if (!user) return <Navigate to="/" replace />;
  if (!type || !(type in user.numbers)) return <Navigate to="/dashboard" replace />;

  const value = user.numbers[type as keyof typeof user.numbers];
  const label = NUMBER_LABELS[type] || type;
  const meaning = ROLE_MEANINGS[type] || '';
  const origin = NUMBER_DESCRIPTIONS[type] || '';
  const profile = NUMBER_PROFILES[value];
  const synthesis = NUMBER_SYNTHESIS[value];

  if (!profile) return <Navigate to="/dashboard" replace />;

  const displayTitle = synthesis?.titulo ?? profile.title;

  return (
    <div className="min-h-screen pb-24 md:pb-8 gradient-dashboard grain-overlay">
      <div className="px-6 pb-6 pt-12">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-4 flex items-center gap-1 text-sm text-on-gradient-muted font-lato"
          aria-label="Volver al inicio"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver
        </button>
        <h1 className="font-lora text-2xl font-bold text-on-gradient">{label}</h1>
        <p className="mt-1.5 text-sm text-on-gradient-muted font-lato">{meaning}</p>
        <p className="mt-1 text-xs font-bold leading-relaxed text-on-gradient-muted/80 font-lato">{origin}</p>

        <div className="mt-6 flex justify-center">
          <div
            className="flex h-24 w-24 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm shadow-glow animate-pulse-glow border-2 border-white/50"
            aria-label={`Número ${value}`}
          >
            <span className="font-lora text-4xl font-bold text-on-gradient">{value}</span>
          </div>
        </div>

        <p className="mt-3 text-center text-base font-semibold text-on-gradient font-lato">{displayTitle}</p>
        <p className="mt-1 text-center text-sm text-on-gradient-muted font-lato">{profile.subtitles}</p>
        <div className="mt-2 flex justify-center">
          <span className="rounded-full bg-white/30 px-3 py-0.5 text-xs font-semibold text-on-gradient font-lato">
            {profile.energyType}
          </span>
        </div>
      </div>

      <div className="mx-6">
        <div className="rounded-xl bg-white/90 backdrop-blur-md border border-white/50 shadow-soft p-5">
          {synthesis ? (
            <>
              <p className="text-sm text-foreground/80 font-lato leading-relaxed">{synthesis.intro}</p>

              <NumberSection
                title="Tu mejor versión"
                icon={<Sparkles className="h-3 w-3 text-amber-500" aria-hidden="true" />}
                text={synthesis.luz}
              />
              <NumberSection
                title="Cuando te desequilibras"
                icon={<CloudLightning className="h-3 w-3 text-violet-500" aria-hidden="true" />}
                text={synthesis.sombra}
              />
              <NumberSection
                title="En el amor y las relaciones"
                icon={<Heart className="h-3 w-3 text-rose-500" aria-hidden="true" />}
                text={synthesis.relaciones}
              />
              <NumberSection
                title="Tu gran lección de vida"
                icon={<Compass className="h-3 w-3 text-sky-500" aria-hidden="true" />}
                text={synthesis.leccion}
              />
            </>
          ) : (
            <>
              <p className="text-sm text-foreground/80 font-lato leading-relaxed">{profile.esencia}</p>

              <NumberSection
                title="Tu Luz"
                icon={<Sparkles className="h-3 w-3 text-amber-500" aria-hidden="true" />}
                text={profile.luz}
              />
              <NumberSection
                title="Tu Reto"
                icon={<CloudLightning className="h-3 w-3 text-violet-500" aria-hidden="true" />}
                text={profile.sombra}
              />
              <NumberSection
                title="Tu Misión"
                icon={<Compass className="h-3 w-3 text-sky-500" aria-hidden="true" />}
                text={profile.mision}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
