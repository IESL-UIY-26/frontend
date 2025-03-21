
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { RocketIcon, SparklesIcon, StarIcon, AwardIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Launch = () => {
  const { toast } = useToast();
  const [launched, setLaunched] = useState(false);
  const [loading, setLoading] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; color: string; tx: number; ty: number }>>([]);
  const [fadeIn, setFadeIn] = useState(false);

  // Images for the grid
  const images = [
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
  ];

  useEffect(() => {
    // Start fade-in animation after a short delay
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 100);

    // Play intro sound
    const audio = new Audio();
    audio.volume = 0.3;
    
    return () => {
      clearTimeout(timer);
      audio.pause();
    };
  }, []);

  const createParticles = (x: number, y: number) => {
    const particleCount = 30;
    const newParticles = [];
    
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 100 + 50;
      const size = Math.floor(Math.random() * 5) + 2;
      const tx = Math.cos(angle) * speed;
      const ty = Math.sin(angle) * speed;
      
      // Randomly choose colors from our theme
      const colors = ['#2f64a6', '#0C4A6E', '#FFFFFF', '#4B9CD3', '#8cc8f0'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      newParticles.push({
        id: Date.now() + i,
        x, 
        y,
        size,
        color,
        tx,
        ty
      });
    }
    
    setParticles(newParticles);
    
    // Remove particles after animation
    setTimeout(() => {
      setParticles([]);
    }, 1000);
  };

  const handleLaunch = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      createParticles(x, y);
    }
    
    setLoading(true);
    
    // Play launch sound
    const audio = new Audio();
    audio.volume = 0.4;
    audio.play().catch(() => {});
    
    setTimeout(() => {
      //setLaunched(true);
      setLoading(false);

      
      toast({
        title: "Launch Successful! 🚀",
        description: "Welcome to IESL UIY 2025",
        duration: 5000,
      });
      
      // Optionally redirect after some seconds
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 text-uiy-darkblue">
      {/* Animated particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle absolute z-50"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            '--tx': `${particle.tx}px`,
            '--ty': `${particle.ty}px`,
          } as React.CSSProperties}
        />
      ))}
      
      <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Pre-launch content */}
        <AnimatePresence mode="wait">
          {!launched ? (
            <motion.div 
              key="pre-launch"
              initial={{ opacity: 0 }}
              animate={{ opacity: fadeIn ? 1 : 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex max-w-5xl flex-col items-center justify-center space-y-12 text-center"
            >
              {/* IESL Logo or Badge */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-uiy-blue to-uiy-darkblue p-0.5 shadow-lg"
              >
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
                  <StarIcon className="h-14 w-14 text-uiy-blue" />
                </div>
              </motion.div>
              
              {/* Main heading with subtle animation */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="space-y-1"
              >
                <div className="inline-flex items-center justify-center rounded-full bg-uiy-darkblue/10 px-3 py-1 text-sm font-medium text-uiy-darkblue">
                  <SparklesIcon className="mr-1 h-3.5 w-3.5" />
                  <span>Invitation Only</span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  IESL UIY <span className="text-uiy-blue">2025</span>
                </h1>
                <p className="mx-auto max-w-2xl text-lg font-medium text-slate-600">
                  Institute of Engineers Sri Lanka - Undergraduate Inventor of the Year
                </p>
              </motion.div>
              
              {/* Description with staggered animation */}
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="max-w-2xl text-slate-600"
              >
                Join us as we celebrate innovation, excellence, and the future of engineering in Sri Lanka. 
                The IESL UIY 2025 is about to launch, recognizing the brightest undergraduate inventors.
              </motion.p>
              
              {/* Launch button with elaborate animations */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mt-10"
              >
                <button
                  ref={buttonRef}
                  onClick={handleLaunch}
                  disabled={loading}
                  className="launch-btn group relative overflow-hidden rounded-full bg-gradient-to-r from-uiy-blue to-uiy-darkblue px-8 py-5 text-lg font-medium text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-uiy-blue/20 focus:outline-none focus:ring-2 focus:ring-uiy-blue/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {loading ? (
                      <>
                        <svg className="mr-2 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Launching...
                      </>
                    ) : (
                      <>
                        <RocketIcon className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                        Launch IESL UIY
                      </>
                    )}
                  </span>
                  
                  {/* Button background animation */}
                  <span className="absolute -bottom-2 left-1/2 h-10 w-10 -translate-x-1/2 scale-0 rounded-full bg-white opacity-70 transition-transform duration-300 group-hover:scale-[6]"></span>
                </button>
              </motion.div>
              
              {/* Decorative elements */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 0.7, duration: 1 }}
                className="absolute left-20 top-40 hidden h-40 w-40 animate-spin-slow opacity-10 lg:block"
              >
                <div className="h-full w-full rounded-full border-2 border-dashed border-uiy-blue"></div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="absolute right-20 bottom-40 hidden h-56 w-56 animate-spin-slow opacity-10 lg:block"
                style={{ animationDirection: 'reverse' }}
              >
                <div className="h-full w-full rounded-full border-2 border-dashed border-uiy-blue"></div>
              </motion.div>
            </motion.div>
          ) : (
            // Post-launch content
            <motion.div 
              key="post-launch"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex max-w-7xl flex-col items-center justify-center space-y-8 py-10 text-center"
            >
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="relative mb-6 flex items-center justify-center"
              >
                <div className="absolute -z-10 h-40 w-40 animate-pulse-slow rounded-full bg-uiy-blue opacity-20"></div>
                <AwardIcon className="h-20 w-20 text-uiy-blue" />
              </motion.div>
              
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl"
              >
                Welcome to <span className="text-uiy-blue">IESL UIY 2025</span>
              </motion.h1>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="max-w-3xl text-xl text-slate-600"
              >
                The platform is now live! Explore the future of engineering innovation
                and discover the brightest minds of Sri Lanka.
              </motion.p>
              
              {/* Image Grid with staggered animation */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mt-12 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3"
              >
                {images.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                    className="group aspect-video overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl"
                  >
                    <div className="relative h-full w-full overflow-hidden">
                      <img 
                        src={image} 
                        alt={`Engineering innovation ${index + 1}`} 
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="mt-8"
              >
                <button className="group rounded-full bg-uiy-blue px-8 py-4 text-lg font-medium text-white shadow-lg transition-all duration-300 hover:bg-uiy-darkblue">
                  Explore Platform
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="ml-2 inline h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Top right gradient */}
        <div className="absolute right-0 top-0 -z-10 h-[30rem] w-[30rem] -translate-y-1/4 translate-x-1/4 rounded-full bg-gradient-to-b from-uiy-blue/10 to-transparent blur-3xl"></div>
        
        {/* Bottom left gradient */}
        <div className="absolute bottom-0 left-0 -z-10 h-[40rem] w-[40rem] translate-y-1/4 -translate-x-1/4 rounded-full bg-gradient-to-t from-uiy-darkblue/10 to-transparent blur-3xl"></div>
      </div>
    </div>
  );
};


export default Launch;
