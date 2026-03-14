import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Menu, X, User, Users } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/features/Auth/hooks/use-auth';
import { UserRole } from '@/features/Auth/enums/auth.enums';
import { useTeamStatus } from '@/features/Teams/context/TeamStatusContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const navItems = [
  { name: 'Home', to: '/#home' },
  { name: 'About', to: '/#about' },
  { name: 'Eligibility', to: '/#eligibility' },
  { name: 'Awards', to: '/#awards' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  
  const { user, dbUser, loading: authLoading, signOut } = useAuth();
  const { myTeam } = useTeamStatus();
  const location = useLocation();
  const isAdmin = dbUser?.role === UserRole.ADMIN;

  useEffect(() => {
    const handleNavigationStyles = () => {
      const isLandingPage = location.pathname === '/';
      const isScrolled = window.scrollY > 50;

      if (!isLandingPage || isScrolled) {
        setIsDark(true);
      } else {
        setIsDark(false);
      }
    };

    handleNavigationStyles();
    window.addEventListener('scroll', handleNavigationStyles);
    return () => window.removeEventListener('scroll', handleNavigationStyles);
  }, [location.pathname]);

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace('#', '');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }, [location.hash]);


  return (
    <>
      {/* 1. MAIN NAVBAR */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6",
        isDark
          ? "bg-white/90 backdrop-blur-md shadow-md py-3"
          : "bg-white/90 backdrop-blur-md shadow-md py-3 md:bg-transparent md:backdrop-blur-none md:shadow-none md:py-4"
      )}>
        <div className="w-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src='/images/logo-light.png' alt="UIY 2026" className="w-auto h-16" />
            <span className={cn(
              "font-display text-xl font-semibold transition-colors",
              isDark ? "text-uiy-dark" : "text-uiy-dark md:text-white"
            )}>
              UIY 2026
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 ml-auto justify-end">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                className={cn(
                  "text-sm font-medium transition-all duration-300 hover:text-uiy-blue relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-uiy-blue after:transition-all after:duration-300 hover:after:w-full",
                  isDark ? "text-uiy-dark" : "text-white"
                )}
              >
                {item.name}
              </Link>
            ))}

            <Link
              to="/projects"
              className={cn(
                "text-sm font-medium transition-all duration-300 hover:text-uiy-blue relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-uiy-blue after:transition-all after:duration-300 hover:after:w-full",
                isDark ? "text-uiy-dark" : "text-white"
              )}
            >
              Projects
            </Link>

            <Link
              to="/sessions"
              className={cn(
                "text-sm font-medium transition-all duration-300 hover:text-uiy-blue relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-uiy-blue after:transition-all after:duration-300 hover:after:w-full",
                isDark ? "text-uiy-dark" : "text-white"
              )}
            >
              Sessions
            </Link>

            {user && !authLoading && (
              isAdmin ? (
                <Link to="/admin" className="btn-primary whitespace-nowrap">Admin Dashboard</Link>
              ) : myTeam ? (
                <Link to="/my-team" className="btn-primary inline-flex items-center justify-center gap-2 whitespace-nowrap">
                  My Team
                </Link>
              ) : (
                <Link to="/#apply" className="btn-primary whitespace-nowrap">Apply Now</Link>
              )
            )}

            {user ? (
              <div className="flex items-center">
                <Link to="/my-profile" className="flex items-center gap-2 focus:outline-none" aria-label="My Profile">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-uiy-blue text-white text-xs">
                      {user.email?.[0].toUpperCase() ?? <User size={14} />}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-uiy-blue",
                    isDark ? "text-uiy-dark" : "text-white"
                  )}
                >
                  Sign In
                </Link>
                <Link to="/signup" className="btn-primary text-sm">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            className="md:hidden focus:outline-none text-uiy-dark"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* 2. MOBILE MENU DROPDOWN OVERLAY */}
      <div className={cn(
        "fixed inset-0 z-[60] bg-white transform transition-transform duration-300 ease-in-out flex md:hidden",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="relative flex flex-col h-full w-full pt-20 px-6">
          <button
            className="absolute top-6 right-6 text-uiy-dark focus:outline-none"
            onClick={() => setIsOpen(false)}
          >
            <X size={24} />
          </button>

          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className={cn(
                "py-4 text-lg font-medium text-uiy-dark border-b border-gray-100 hover:text-uiy-blue transition-colors"
              )}
            >
              {item.name}
            </Link>
          ))}

          <Link
            to="/projects"
            onClick={() => setIsOpen(false)}
            className="py-4 text-lg font-medium text-uiy-dark border-b border-gray-100 hover:text-uiy-blue transition-colors"
          >
            Projects
          </Link>

          <Link
            to="/sessions"
            onClick={() => setIsOpen(false)}
            className="py-4 text-lg font-medium text-uiy-dark border-b border-gray-100 hover:text-uiy-blue transition-colors"
          >
            Sessions
          </Link>

          {user ? (
            <>
              <Link
                to="/my-profile"
                className="py-4 text-lg font-medium text-uiy-dark border-b border-gray-100 hover:text-uiy-blue transition-colors"
                onClick={() => setIsOpen(false)}
              >
                 Profile
              </Link>
              
            </>
          ) : (
            <div className="mt-6 border-t pt-6 flex flex-col gap-3">
              <Link
                to="/login"
                className="text-center py-3 text-lg font-medium text-uiy-blue border border-uiy-blue rounded-lg hover:bg-uiy-blue hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="btn-primary text-center"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}

          {user && !authLoading && (
            isAdmin ? (
              <Link
                to="/admin"
                className="btn-primary mt-8 text-center whitespace-nowrap"
                onClick={() => setIsOpen(false)}
              >
                Admin Dashboard
              </Link>
            ) : myTeam ? (
              <Link
                to="/my-team"
                className="btn-primary mt-8 text-center inline-flex items-center justify-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <Users className="w-4 h-4" />
                My Team
              </Link>
            ) : (
              <Link to="/#apply" className="btn-primary mt-8 text-center whitespace-nowrap" onClick={() => setIsOpen(false)}>
                Apply Now
              </Link>
            )
          )}

          {user && (
            <Button
                variant="ghost"
                className="py-4 mt-4 text-lg font-medium text-uiy-dark border-b border-gray-100 hover:text-uiy-blue transition-colors"
                onClick={() => void signOut()}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
          )}

          
        </div>
      </div>
    </>
  );
};

export default Navbar;