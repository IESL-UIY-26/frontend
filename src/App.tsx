import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/features/Auth/context/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Launch from "./pages/Launch";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthCallback from "./pages/AuthCallback";
import CompleteProfile from "./pages/CompleteProfile";
import AdminDashboard from "./pages/AdminDashboard";
import CreateTeam from './pages/CreateTeam';
import MyTeam from './pages/MyTeam';
import Projects from './pages/Projects';
import Sessions from './pages/Sessions';
import MyProfile from './pages/MyProfile';
import { AdminGuard } from "@/features/Auth/components/AdminGuard";
import { UserGuard } from "@/features/Auth/components/UserGuard";
import { TeamStatusProvider } from '@/features/Teams/context/TeamStatusContext';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <TeamStatusProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/launch" element={<Launch />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/complete-profile" element={<CompleteProfile />} />
              <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
              <Route path="/create-team" element={<UserGuard><CreateTeam /></UserGuard>} />
              <Route path="/my-team" element={<UserGuard><MyTeam /></UserGuard>} />
              <Route path="/my-profile" element={<MyProfile />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/sessions" element={<Sessions />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TeamStatusProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
