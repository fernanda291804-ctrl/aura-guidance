import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Navigate, useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import { Search, ChevronRight } from 'lucide-react';
import { NUMBER_PROFILES } from '@/data/numberMeanings';

const LESSONS = [
  { title: '¿Qué es la Numerología Pitagórica?', preview: 'Un sistema ancestral que mapea fechas y letras a números revelando el plano de tu vida.' },
  { title: 'El Número del Alma', preview: 'Derivado del día de nacimiento, revela tus deseos internos y motivaciones más profundas.' },
  { title: 'El Número del Camino', preview: 'Calculado a partir de tu fecha completa de nacimiento, muestra tu dirección y propósito de vida.' },
  { title: 'El Número de Personalidad', preview: 'Proviene del mes de nacimiento — cómo el mundo te percibe y la energía que proyectas.' },
  { title: 'El Número del Don', preview: 'Extraído de los dos últimos dígitos del año, representa tus talentos naturales e innatos.' },
  { title: 'El Número de Vida Pasada', preview: 'Suma de todos los dígitos del año de nacimiento, revela lecciones kármicas de vidas anteriores.' },
  { title: 'El Número 10: La Rueda del Destino', preview: 'Un número especial que no se reduce más. Combina la fuerza del 1 con la amplificación del 0.' },
  { title: 'Cómo interpretar tu Pentagrama', preview: 'Los cinco números forman un mapa energético. Aprende a leer las conexiones entre ellos.' },
];

const NUMBER_ENTRIES = Object.entries(NUMBER_PROFILES).map(([key, p]) => ({
  number: Number(key),
  title: p.title,
  subtitles: p.subtitles,
  energyType: p.energyType,
}));

export default function Learn() {
  const { user } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  if (!user) return <Navigate to="/" replace />;

  const lowerSearch = search.toLowerCase();

  const filteredLessons = LESSONS.filter(l =>
    l.title.toLowerCase().includes(lowerSearch) ||
    l.preview.toLowerCase().includes(lowerSearch)
  );

  const filteredNumbers = NUMBER_ENTRIES.filter(n =>
    n.title.toLowerCase().includes(lowerSearch) ||
    n.subtitles.toLowerCase().includes(lowerSearch) ||
    String(n.number).includes(search)
  );

  return (
    <div className="min-h-screen pb-24 gradient-dashboard grain-overlay">
      <div className="px-6 pb-6 pt-12">
        <h1 className="font-lora text-2xl font-bold text-white">Aprender</h1>
        <p className="mt-1 text-sm text-white/80 font-lato">Profundiza tu conocimiento numerológico</p>
      </div>

      {/* Search bar */}
      <div className="px-6 mt-1 mb-4">
        <div className="flex items-center gap-3 rounded-xl bg-white/90 backdrop-blur-md px-4 py-3 border border-white/50 shadow-soft">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar conceptos o números..."
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-lato"
          />
        </div>
      </div>

      {/* Numbers section */}
      <div className="px-6 mb-6">
        <h2 className="font-lora text-base font-semibold text-white mb-3">Los 10 números</h2>
        <div className="space-y-2">
          {filteredNumbers.map(n => (
            <button
              key={n.number}
              onClick={() => navigate(`/learn/${n.number}`)}
              className="flex w-full items-center gap-4 rounded-xl bg-white/90 backdrop-blur-md p-4 border border-white/50 shadow-soft text-left transition-transform active:scale-[0.98]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary border border-secondary/50">
                <span className="font-lora text-lg font-bold text-secondary-foreground">{n.number}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-lora text-sm font-bold text-heading">{n.title}</h3>
                <p className="text-xs text-muted-foreground truncate font-lato">{n.subtitles} · {n.energyType}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Concepts section */}
      {filteredLessons.length > 0 && (
        <div className="px-6">
          <h2 className="font-lora text-base font-semibold text-white mb-3">Conceptos</h2>
          <div className="space-y-3">
            {filteredLessons.map((l, i) => (
              <div key={i} className="rounded-2xl bg-white/90 backdrop-blur-md p-5 border border-white/50 shadow-soft">
                <h3 className="font-lora text-sm font-bold text-heading">{l.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground font-lato">{l.preview}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredNumbers.length === 0 && filteredLessons.length === 0 && (
        <div className="px-6">
          <div className="rounded-2xl bg-white/20 backdrop-blur-sm p-8 text-center border border-white/20">
            <p className="text-sm text-white/70 font-lato">No se encontraron resultados</p>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
