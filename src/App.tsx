import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/context/AppContext";
import AppLayout from "./components/AppLayout";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Mentor from "./pages/Mentor";
import Profile from "./pages/Profile";
import Learn from "./pages/Learn";
import LearnDetail from "./pages/LearnDetail";
import Saved from "./pages/Saved";
import NumberDetail from "./pages/NumberDetail";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Routes that require authentication
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { session, authLoading } = useApp();
  if (authLoading) return null;
  if (!session) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

// Redirect authenticated users away from auth page
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { session, authLoading } = useApp();
  if (authLoading) return null;
  if (session) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/" element={<PrivateRoute><Onboarding /></PrivateRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><AppLayout><Dashboard /></AppLayout></PrivateRoute>} />
      <Route path="/mentor" element={<PrivateRoute><AppLayout><Mentor /></AppLayout></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><AppLayout><Profile /></AppLayout></PrivateRoute>} />
      <Route path="/learn" element={<PrivateRoute><AppLayout><Learn /></AppLayout></PrivateRoute>} />
      <Route path="/learn/:num" element={<PrivateRoute><AppLayout><LearnDetail /></AppLayout></PrivateRoute>} />
      <Route path="/saved" element={<PrivateRoute><AppLayout><Saved /></AppLayout></PrivateRoute>} />
      <Route path="/number/:type" element={<PrivateRoute><AppLayout><NumberDetail /></AppLayout></PrivateRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
