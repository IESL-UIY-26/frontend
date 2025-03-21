
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Menu, X } from 'lucide-react';

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
        <a href="#" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-uiy-blue flex items-center justify-center">
            <span className="text-white font-bold">UIY</span>
          </div>
          <span className={cn(
            "font-display text-xl font-semibold transition-colors",
            scrolled ? "text-uiy-dark" : "text-uiy-blue"
          )}>
            UIY 2025
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
                scrolled ? "text-uiy-dark" : "text-uiy-dark"
              )}
            >
              {item.name}
            </a>
          ))}
          <a href="#apply" className="btn-primary">Apply Now</a>
        </div>
        
        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-uiy-dark focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      <div className={cn(
        "fixed inset-0 z-40 bg-white transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col h-full pt-20 px-6">
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
