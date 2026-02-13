import { useApp } from '@/context/AppContext';
import { Navigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import { BookOpen } from 'lucide-react';

const LESSONS = [
  { title: 'What is Pythagorean Numerology?', preview: 'An ancient system that maps letters and dates to numbers revealing your life blueprint.' },
  { title: 'The Soul Number', preview: 'Derived from the vowels in your name, it reveals your inner desires and motivations.' },
  { title: 'The Path Number', preview: 'Calculated from your full birth date, it shows your life direction and purpose.' },
  { title: 'The Personality Number', preview: 'From the consonants in your name — how the world perceives you.' },
  { title: 'Master Numbers 11 & 22', preview: 'Special vibrations that carry amplified energy and spiritual significance.' },
];

export default function Learn() {
  const { user } = useApp();
  if (!user) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-background pb-24 liquid-light grain-overlay">
      <div className="gradient-aura px-6 pb-6 pt-12">
        <h1 className="font-lora text-2xl font-bold text-heading">Learn</h1>
        <p className="mt-1 text-sm text-body">Deepen your numerological knowledge</p>
      </div>

      <div className="space-y-3 px-6 mt-4">
        {LESSONS.map((l, i) => (
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
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
