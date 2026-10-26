import { useState, useRef } from 'react'
import { X, Key, ArrowRight, Lock } from 'lucide-react'
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
import OurTeam from './pages/OurTeam'
import { AdminGuard } from '@/features/Auth/components/AdminGuard'
import { UserGuard } from '@/features/Auth/components/UserGuard'
import { TeamStatusProvider } from '@/features/Teams/context/TeamStatusContext'
import { googleSheetsAPI } from '@/features/Sessions/api/google-sheets.api'
import { useEffect } from 'react'
import { SiteStatusProvider } from '@/context/SiteStatusContext'

const queryClient = new QueryClient()
const ADMIN_PASSWORD = 'LSEi2o2&'

const AdminPasswordGate = ({ children }: { children: React.ReactNode }) => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isAuthorized, setIsAuthorized] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('uiy_admin_access') === ADMIN_PASSWORD
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('uiy_admin_access', ADMIN_PASSWORD)
      setIsAuthorized(true)
      setError('')
      return
    }

    setError('Incorrect admin password')
  }

  if (isAuthorized) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-blue-400">Restricted access</p>
          <h2 className="mt-3 text-2xl font-bold text-white">Admin authorization required</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-password" className="mb-2 block text-sm text-slate-300">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (error) setError('')
              }}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
              placeholder="Enter admin password"
              autoComplete="off"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-500"
          >
            Unlock page
          </button>
        </form>
      </div>
    </div>
  )
}

const App = () => {
  const [isUnlocked, setIsUnlocked] = useState<boolean | null>(null);
  const [isRegOver, setIsRegOver] = useState<boolean>(false);
  const [keyInput, setKeyInput] = useState('');
  const [error, setError] = useState('');
  const [isLaunching, setIsLaunching] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [flyLogo, setFlyLogo] = useState(false);
  const [logoStyle, setLogoStyle] = useState({ top: '0px', left: '0px', width: '96px', height: '96px', opacity: 0 });
  const logoRef = useRef<HTMLImageElement>(null);
  const REQUIRED_KEY = 'uiy2026'; // You can change this key
  
  useEffect(() => {
    googleSheetsAPI.checkLaunchStatus().then(status => {
      setIsUnlocked(status.is_launched);
      setIsRegOver(status.is_reg_over);
    });
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyInput === REQUIRED_KEY) {
      setIsLaunching(true);
      setError('');

      // Update Google Sheets so it stays unlocked for everyone
      googleSheetsAPI.setLaunchStatus(true).catch(console.error);

      if (logoRef.current) {
        const rect = logoRef.current.getBoundingClientRect();
        setLogoStyle({
          top: `${rect.top}px`,
          left: `${rect.left}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          opacity: 1
        });
      }

      // Show loading spinner for 1s, then trigger exit animation
      setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => setFlyLogo(true), 50);
        // Wait 800ms for exit animation to complete before unmounting
        setTimeout(() => {
          setIsUnlocked(true);
        }, 800);
      }, 1000);
    } else {
      setError('Wrong key access denied');
    }
  };

  if (isUnlocked === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      {!isUnlocked && (
        <>
          {/* Flying Logo */}
          <div
            className="fixed z-[10000] transition-all duration-700 ease-in-out pointer-events-none"
            style={{
              ...logoStyle,
              opacity: isExiting ? 1 : 0,
              top: flyLogo ? '12px' : logoStyle.top,
              left: flyLogo ? '24px' : logoStyle.left,
              width: flyLogo ? '64px' : logoStyle.width,
              height: flyLogo ? '64px' : logoStyle.height,
            }}
          >
            <img src="/favicon.ico" alt="Flying Logo" className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]" />
          </div>

          <div className={`fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 transition-all duration-500 ${isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className={`relative w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col p-8 backdrop-blur-xl transition-all duration-500 ease-in-out ${isExiting ? 'scale-110 opacity-0 blur-sm' : 'scale-100 opacity-100'}`}>
              <button className="absolute top-5 right-5 text-slate-500 hover:text-white transition-colors">
                <X size={20} />
              </button>

              <div className="flex flex-col items-center mt-2">
                <div className="relative mb-6">
                  {/* Decorative sparks */}
                  <div className={`absolute -inset-4 bg-blue-500/20 blur-xl rounded-full transition-opacity duration-300 ${isExiting ? 'opacity-0' : 'opacity-100'}`}></div>
                  <img ref={logoRef} src="/favicon.ico" alt="UIY Logo" className={`w-24 h-24 relative z-10 object-contain drop-shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-opacity duration-300 ${isExiting ? 'opacity-0' : 'opacity-100'}`} />
                </div>

                <h2 className="text-3xl font-bold text-white mb-1">
                  UIY <span className="text-blue-400">2026</span>
                </h2>
                <h3 className="text-2xl font-bold text-white tracking-widest mb-4">
                  GOING LIVE!
                </h3>

                <p className="text-slate-400 text-sm text-center mb-8 px-2">
                  Enter the launch key to access<br />the official website.
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
                      disabled={isLaunching}
                      placeholder="Enter Launch Key"
                      className={`w-full bg-slate-950/50 border ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500'} text-white px-4 py-3.5 rounded-xl focus:outline-none focus:ring-1 transition-all placeholder:text-slate-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                      autoFocus
                    />
                    <Key className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  </div>

                  {error && (
                    <div className="text-red-400 text-sm text-center -mt-1 mb-1">
                      {error}
                    </div>
                  )}

                  <button type="submit" disabled={isLaunching} className={`w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3.5 rounded-xl flex items-center justify-center transition-all group shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] disabled:bg-blue-700 disabled:cursor-not-allowed ${isLaunching ? 'scale-[0.98] opacity-90' : ''}`}>
                    {isLaunching ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        LAUNCHING...
                      </>
                    ) : (
                      <>
                        LAUNCH SITE <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                      </>
                    )}
                  </button>
                </form>

                <div className="flex items-center text-slate-500 text-xs mt-6">
                  <Lock size={12} className="mr-1.5" />
                  Authorized access only
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <div className={!isUnlocked ? "blur-md pointer-events-none select-none h-screen overflow-hidden" : ""}>
        <SiteStatusProvider isRegOver={isRegOver}>
          <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AuthProvider>
                <TeamStatusProvider>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/launch" element={<AdminPasswordGate><Launch /></AdminPasswordGate>} />
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
                    <Route path="/projects" element={<AdminPasswordGate><Projects /></AdminPasswordGate>} />
                    <Route path="/sessions" element={<Sessions />} />
                    <Route path="/our-team" element={<OurTeam />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </TeamStatusProvider>
              </AuthProvider>
            </BrowserRouter>
          </TooltipProvider>
            </QueryClientProvider>
          </SiteStatusProvider>
      </div>
    </>
  )
}

export default App
