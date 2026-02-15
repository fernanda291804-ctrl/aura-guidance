import { useLocation, useNavigate } from 'react-router-dom';
import { Hash, User, Sparkles, BookOpen, Bookmark } from 'lucide-react';

const NAV_ITEMS = [
  { icon: Hash, label: 'Números', path: '/dashboard' },
  { icon: User, label: 'Perfil', path: '/profile' },
  { icon: Sparkles, label: 'MENTOR', path: '/mentor', center: true },
  { icon: BookOpen, label: 'Aprender', path: '/learn' },
  { icon: Bookmark, label: 'Guardado', path: '/saved' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border">
      <div className="mx-auto flex max-w-md items-end justify-around px-2 pb-2 pt-1">
        {NAV_ITEMS.map(item => {
          const active = location.pathname === item.path;
          if (item.center) {
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className="relative -mt-5 flex flex-col items-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full gradient-warm shadow-glow animate-pulse-glow">
                  <item.icon className="h-6 w-6 text-foreground" />
                </div>
                <span className="mt-1 text-[10px] font-bold tracking-wider text-primary">
                  {item.label}
                </span>
              </button>
            );
          }
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-0.5 py-2 px-3 transition-colors"
            >
              <item.icon
                className={`h-5 w-5 transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`}
              />
              <span className={`text-[10px] ${active ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
