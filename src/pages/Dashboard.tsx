import { useApp } from '@/context/AppContext';
import { Navigate } from 'react-router-dom';
import PentagonChart from '@/components/PentagonChart';
import BottomNav from '@/components/BottomNav';
import { Clock, Inbox } from 'lucide-react';

export default function Dashboard() {
  const { user, consultations } = useApp();
  if (!user) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-background pb-24 liquid-light grain-overlay">
      {/* Header */}
      <div className="gradient-aura px-6 pb-6 pt-12">
        <h1 className="font-lora text-2xl font-bold text-heading">
          Hello, {user.name.split(' ')[0]}!
        </h1>
        <p className="mt-1 text-sm text-body">Your numerological map awaits</p>
      </div>

      {/* Pentagon */}
      <div className="px-6 -mt-2">
        <div className="glass rounded-2xl p-4 shadow-card">
          <h2 className="mb-2 text-center font-lora text-lg font-semibold text-heading">Your Numbers</h2>
          <PentagonChart numbers={user.numbers} />
        </div>
      </div>

      {/* Recent Consultations */}
      <div className="mt-6 px-6">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-4 w-4 text-primary" />
          <h3 className="font-lora text-base font-semibold text-heading">Recent Consultations</h3>
        </div>

        {consultations.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center shadow-soft">
            <Inbox className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <p className="mt-3 text-sm text-muted-foreground">No consultations yet</p>
            <p className="text-xs text-muted-foreground/70">Tap the Mentor button to begin your journey</p>
          </div>
        ) : (
          <div className="space-y-3">
            {consultations.slice(0, 3).map(c => (
              <div key={c.id} className="glass rounded-xl p-4 shadow-soft">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold capitalize text-secondary-foreground">
                    {c.scenario}
                  </span>
                  <span className="text-xs text-muted-foreground">{c.date}</span>
                </div>
                <p className="mt-2 text-sm text-body line-clamp-2">{c.insight.advice}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
