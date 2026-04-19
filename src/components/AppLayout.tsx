import BottomNav from './BottomNav';
import SideNav from './SideNav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <SideNav />
      <div className="flex-1 min-w-0 md:ml-60">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
