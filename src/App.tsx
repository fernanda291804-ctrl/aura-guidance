import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Mentor from "./pages/Mentor";
import Profile from "./pages/Profile";
import Learn from "./pages/Learn";
import LearnDetail from "./pages/LearnDetail";
import Saved from "./pages/Saved";
import NumberDetail from "./pages/NumberDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/mentor" element={<Mentor />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/learn/:num" element={<LearnDetail />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/number/:type" element={<NumberDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
