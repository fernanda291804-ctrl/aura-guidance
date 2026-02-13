import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Navigate, useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import { Briefcase, MapPin, Heart, ArrowLeft, Check, Bookmark } from 'lucide-react';

type Scenario = 'work' | 'relocation' | 'relationship';
type Step = 'select' | 'loading' | 'insight';

const SCENARIOS = [
  { id: 'work' as Scenario, icon: Briefcase, title: 'Work', desc: 'Career & professional path' },
  { id: 'relocation' as Scenario, icon: MapPin, title: 'Relocation', desc: 'Moving & new beginnings' },
  { id: 'relationship' as Scenario, icon: Heart, title: 'Relationship', desc: 'Love & connections' },
];

const INSIGHTS: Record<Scenario, { reason: string; advice: string; actions: string[] }> = {
  work: {
    reason: 'Your Path number reveals a cycle of professional transformation. The energy of this period favors bold moves and aligning your career with your deeper purpose.',
    advice: 'Trust your intuition in professional decisions. Your Soul number suggests you thrive when your work reflects your inner values. Seek roles that honor both ambition and authenticity.',
    actions: [
      'Update your professional profile to reflect your true skills',
      'Reach out to a mentor or guide in your desired field',
      'Set three concrete career goals for the next 90 days',
      'Practice a morning intention ritual before work',
    ],
  },
  relocation: {
    reason: 'Your numerological chart indicates a strong pull toward new environments. Your Gift number suggests that geographical change can unlock dormant potential.',
    advice: 'Consider locations that resonate with your life path vibration. Places near water or natural landscapes may amplify your creative and spiritual energy during this transit.',
    actions: [
      'Research cities whose energy matches your Path number',
      'Visit potential locations during a personally auspicious month',
      'Create a vision board for your ideal living environment',
      'Connect with communities that share your values',
    ],
  },
  relationship: {
    reason: 'Your Soul and Personality numbers reveal a period of deep emotional growth. Relationships mirror your inner state, and this cycle calls for authentic connection.',
    advice: 'Open yourself to vulnerability. Your past life number hints at karmic lessons around trust. Embrace partnerships that encourage mutual growth rather than comfort alone.',
    actions: [
      'Practice active listening in your closest relationships',
      'Write a letter of gratitude to someone meaningful',
      'Set healthy boundaries that honor your energy',
      'Explore couples activities that align with shared values',
    ],
  },
};

export default function Mentor() {
  const { user, addConsultation } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('select');
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [saved, setSaved] = useState(false);

  if (!user) return <Navigate to="/" replace />;

  const handleSelect = (s: Scenario) => {
    setScenario(s);
    setStep('loading');
    setTimeout(() => setStep('insight'), 2500);
  };

  const handleSave = () => {
    if (!scenario) return;
    addConsultation({
      id: Date.now().toString(),
      scenario,
      date: new Date().toLocaleDateString(),
      insight: INSIGHTS[scenario],
    });
    setSaved(true);
    setTimeout(() => navigate('/dashboard'), 1500);
  };

  if (step === 'loading') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 grain-overlay">
        <div className="h-64 w-64 rounded-full animate-shimmer" style={{ background: 'linear-gradient(270deg, hsl(25 95% 74% / 0.5), hsl(280 60% 70% / 0.4), hsl(25 95% 74% / 0.5))', backgroundSize: '400% 100%' }} />
        <p className="mt-8 font-lora text-lg text-heading animate-pulse">
          Synchronizing with your Path number...
        </p>
        <p className="mt-2 text-sm text-body">Aligning cosmic energies</p>
      </div>
    );
  }

  if (step === 'insight' && scenario) {
    const insight = INSIGHTS[scenario];
    return (
      <div className="min-h-screen bg-background pb-24 liquid-light grain-overlay">
        <div className="gradient-aura px-6 pb-6 pt-12">
          <button onClick={() => { setStep('select'); setSaved(false); }} className="mb-4 flex items-center gap-1 text-sm text-body">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <h1 className="font-lora text-2xl font-bold text-heading capitalize">{scenario} Insight</h1>
        </div>

        <div className="space-y-4 px-6 mt-4">
          {/* Reason */}
          <div className="glass rounded-2xl p-5 shadow-soft">
            <h3 className="mb-2 font-lora text-sm font-bold uppercase tracking-wider text-primary">Context</h3>
            <p className="text-sm leading-relaxed text-body">{insight.reason}</p>
          </div>

          {/* Advice */}
          <div className="glass rounded-2xl p-5 shadow-soft border-l-4 border-primary">
            <h3 className="mb-2 font-lora text-sm font-bold uppercase tracking-wider text-primary">Wisdom</h3>
            <p className="text-sm leading-relaxed text-body">{insight.advice}</p>
          </div>

          {/* Actions */}
          <div className="glass rounded-2xl p-5 shadow-soft">
            <h3 className="mb-3 font-lora text-sm font-bold uppercase tracking-wider text-primary">Actions</h3>
            <ul className="space-y-2.5">
              {insight.actions.map((a, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-body">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Save */}
          {saved ? (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-success/15 py-3.5 text-sm font-semibold text-success">
              <Check className="h-4 w-4" /> Saved to your journal
            </div>
          ) : (
            <button
              onClick={handleSave}
              className="flex w-full items-center justify-center gap-2 rounded-xl gradient-warm py-3.5 text-sm font-bold text-foreground shadow-glow transition-transform active:scale-[0.98]"
            >
              <Bookmark className="h-4 w-4" /> Save to my journal
            </button>
          )}
        </div>

        <BottomNav />
      </div>
    );
  }

  // Selector
  return (
    <div className="min-h-screen bg-background pb-24 liquid-light grain-overlay">
      <div className="gradient-aura px-6 pb-6 pt-12">
        <h1 className="font-lora text-2xl font-bold text-heading">Mentor</h1>
        <p className="mt-1 text-sm text-body">Choose an area of guidance</p>
      </div>

      <div className="space-y-4 px-6 mt-6">
        {SCENARIOS.map(s => (
          <button
            key={s.id}
            onClick={() => handleSelect(s.id)}
            className="glass flex w-full items-center gap-4 rounded-2xl p-5 shadow-soft text-left transition-transform active:scale-[0.98] hover:shadow-card"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary">
              <s.icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-lora text-base font-semibold text-heading">{s.title}</h3>
              <p className="text-xs text-body">{s.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
