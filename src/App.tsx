import { useState } from 'react'
import { X, Rocket, Key, ArrowRight, Lock } from 'lucide-react'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/features/Auth/context/AuthContext'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import Launch from './pages/Launch'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AuthCallback from './pages/AuthCallback'
import CompleteProfile from './pages/CompleteProfile'
import AdminDashboard from './pages/AdminDashboard'
import CreateTeam from './pages/CreateTeam'
import MyTeam from './pages/MyTeam'
import Projects from './pages/Projects'
import Sessions from './pages/Sessions'
import MyProfile from './pages/MyProfile'
import SessionTemp from './pages/SessionTemp'
import { AdminGuard } from '@/features/Auth/components/AdminGuard'
import { UserGuard } from '@/features/Auth/components/UserGuard'
import { TeamStatusProvider } from '@/features/Teams/context/TeamStatusContext'

const queryClient = new QueryClient()

const App = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [error, setError] = useState('');
  const REQUIRED_KEY = 'admin'; // You can change this key

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyInput === REQUIRED_KEY) {
      setIsUnlocked(true);
      setError('');
    } else {
      setError('Wrong key access denied');
    }
  };

  return (
    <>
      {!isUnlocked && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col p-8 backdrop-blur-xl">
            <button className="absolute top-5 right-5 text-slate-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
            
            <div className="flex flex-col items-center mt-2">
              <div className="relative mb-6">
                {/* Decorative sparks */}
                <div className="absolute -inset-4 bg-blue-500/20 blur-xl rounded-full"></div>
                <Rocket className="text-blue-400 relative z-10" size={56} strokeWidth={1.5} />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-1">
                UIY <span className="text-blue-400">2026</span>
              </h2>
              <h3 className="text-2xl font-bold text-white tracking-widest mb-4">
                GOING LIVE!
              </h3>
              
              <p className="text-slate-400 text-sm text-center mb-8 px-2">
                Enter the launch key to access<br/>the official website.
              </p>
              
              <form onSubmit={handleUnlock} className="w-full flex flex-col gap-4">
                <div className="relative">
                  <input 
                    type="password" 
                    value={keyInput} 
                    onChange={e => {
                      setKeyInput(e.target.value);
                      setError('');
                    }} 
                    placeholder="Enter Launch Key"
                    className={`w-full bg-slate-950/50 border ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500'} text-white px-4 py-3.5 rounded-xl focus:outline-none focus:ring-1 transition-all placeholder:text-slate-600 text-sm`}
                    autoFocus
                  />
                  <Key className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                </div>
                
                {error && (
                  <div className="text-red-400 text-sm text-center -mt-1 mb-1">
                    {error}
                  </div>
                )}
                
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3.5 rounded-xl flex items-center justify-center transition-all group shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_20px_rgba(37,99,235,0.5)]">
                  LAUNCH SITE <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                </button>
              </form>
              
              <div className="flex items-center text-slate-500 text-xs mt-6">
                <Lock size={12} className="mr-1.5" />
                Authorized access only
              </div>
            </div>
          </div>
        </div>
      )}
      <div className={!isUnlocked ? "blur-md pointer-events-none select-none h-screen overflow-hidden" : ""}>
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
              <Route
                path="/admin"
                element={
                  <AdminGuard>
                    <AdminDashboard />
                  </AdminGuard>
                }
              />
              <Route
                path="/create-team"
                element={
                  <UserGuard>
                    <CreateTeam />
                  </UserGuard>
                }
              />
              <Route
                path="/my-team"
                element={
                  <UserGuard>
                    <MyTeam />
                  </UserGuard>
                }
              />
              <Route path="/my-profile" element={<MyProfile />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/sessions" element={<SessionTemp />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TeamStatusProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
      </div>
    </>
  )
}

export default App
