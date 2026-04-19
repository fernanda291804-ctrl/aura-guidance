import { useLocation, useNavigate } from 'react-router-dom';
import { Home, User, Sparkles, BookOpen, Bookmark } from 'lucide-react';

const NAV_ITEMS = [
  { icon: Home, label: 'Inicio', path: '/dashboard' },
  { icon: User, label: 'Perfil', path: '/profile' },
  { icon: Sparkles, label: 'KYROS', path: '/mentor', highlight: true },
  { icon: BookOpen, label: 'Aprender', path: '/learn' },
  { icon: Bookmark, label: 'Guardado', path: '/saved' },
];

export default function SideNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-full w-60 flex-col bg-white/95 backdrop-blur-xl border-r border-white/60 shadow-[4px_0_20px_rgba(0,0,0,0.06)] z-50">
      {/* Brand */}
      <div className="px-6 pt-8 pb-6 border-b border-border/20">
        <h1 className="font-lora text-2xl font-bold text-heading tracking-tight">KYROS</h1>
        <p className="text-xs text-muted-foreground font-lato mt-0.5">Tu mentor de numerología</p>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(item => {
          const active = location.pathname === item.path;
          if (item.highlight) {
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl gradient-warm shadow-glow transition-transform active:scale-[0.98] my-2"
              >
                <item.icon className="h-5 w-5 text-primary-foreground" />
                <span className="text-sm font-bold text-primary-foreground font-lato">{item.label}</span>
              </button>
            );
          }
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                active
                  ? 'bg-primary/10 text-accent'
                  : 'text-muted-foreground hover:bg-secondary/10 hover:text-foreground'
              }`}
            >
              <item.icon className={`h-5 w-5 shrink-0 ${active ? 'text-accent' : ''}`} />
              <span className={`text-sm font-lato ${active ? 'font-semibold text-accent' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
