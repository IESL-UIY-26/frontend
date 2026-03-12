
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Menu, X, LogOut, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/features/Auth/hooks/use-auth';

const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Eligibility', href: '#eligibility' },
  { name: 'Process', href: '#process' },
  { name: 'Awards', href: '#awards' },
  { name: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6",
      scrolled ? "bg-white/90 backdrop-blur-md shadow-md py-3" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <img src='/images/logo-light.png' alt="UIY 2026" className="w-auto h-16" />
          <span className={cn(
            "font-display text-xl font-semibold transition-colors",
            scrolled ? "text-uiy-dark" : "text-white"
          )}>
            UIY 2026
          </span>
        </a>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <a 
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-all duration-300 hover:text-uiy-blue relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-uiy-blue after:transition-all after:duration-300 hover:after:w-full",
                scrolled ? "text-uiy-dark" : "text-white"
              )}
            >
              {item.name}
            </a>
          ))}
          <a href="#apply" className="btn-primary">Apply Now</a>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 focus:outline-none">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-uiy-blue text-white text-xs">
                      {user.email?.[0].toUpperCase() ?? <User size={14} />}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <p className="text-xs text-muted-foreground">Signed in as</p>
                  <p className="text-sm font-medium truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={() => signOut()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        {/* Mobile Menu Toggle */}
        <button 
          className={cn(
            "md:hidden focus:outline-none", 
            scrolled ? "text-uiy-dark" : "text-white"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      <div className={cn(
        "fixed inset-0 z-40 bg-white transform transition-transform duration-300 ease-in-out flex",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="relative flex flex-col h-full w-full pt-20 px-6">
          {/* Close button in absolute position */}
          <button 
            className="absolute top-6 right-6 text-uiy-dark focus:outline-none"
            onClick={() => setIsOpen(false)}
          >
            <X size={24} />
          </button>
          
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="py-4 text-lg font-medium text-uiy-dark border-b border-gray-100 hover:text-uiy-blue transition-colors"
            >
              {item.name}
            </a>
          ))}
          <a href="#apply" className="btn-primary mt-8 text-center" onClick={() => setIsOpen(false)}>Apply Now</a>

          {user && (
            <div className="mt-6 border-t pt-4">
              <p className="text-xs text-muted-foreground">Signed in as</p>
              <p className="text-sm font-medium truncate text-uiy-dark mb-3">{user.email}</p>
              <button
                className="flex items-center gap-2 text-sm text-destructive hover:opacity-80"
                onClick={() => { signOut(); setIsOpen(false); }}
              >
                <LogOut size={16} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
