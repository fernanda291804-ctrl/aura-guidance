import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Navigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import { BookOpen, Search } from 'lucide-react';

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

export default function Learn() {
  const { user } = useApp();
  const [search, setSearch] = useState('');

  if (!user) return <Navigate to="/" replace />;

  const filtered = LESSONS.filter(l =>
    l.title.toLowerCase().includes(search.toLowerCase()) ||
    l.preview.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-24 liquid-light grain-overlay">
      <div className="gradient-aura px-6 pb-6 pt-12">
        <h1 className="font-lora text-2xl font-bold text-heading">Aprender</h1>
        <p className="mt-1 text-sm text-body">Profundiza tu conocimiento numerológico</p>
      </div>

      {/* Search bar */}
      <div className="px-6 mt-4 mb-4">
        <div className="glass flex items-center gap-3 rounded-xl px-4 py-3 shadow-soft">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar conceptos..."
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>
      </div>

      <div className="space-y-3 px-6">
        {filtered.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center shadow-soft">
            <p className="text-sm text-muted-foreground">No se encontraron resultados</p>
          </div>
        ) : (
          filtered.map((l, i) => (
            <div key={i} className="glass rounded-2xl p-5 shadow-soft">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-lora text-sm font-semibold text-heading">{l.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-body">{l.preview}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}
