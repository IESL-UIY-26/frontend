
import React from 'react';
import { ArrowRight, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTeamStatus } from '@/features/Teams/context/TeamStatusContext';
import { useAuth } from '@/features/Auth/hooks/use-auth';
import { UserRole } from '@/features/Auth/enums/auth.enums';

const Hero = () => {
  const { myTeam } = useTeamStatus();
  const { user, dbUser } = useAuth();
  const isAdmin = dbUser?.role === UserRole.ADMIN;

  return (
    <section id="home" className="min-h-screen relative flex items-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-hero-pattern bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-r from-uiy-dark/90 to-uiy-dark/70"></div>
      </div>
      
      {/* Glass elements decoration */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 rounded-full bg-uiy-blue/20 backdrop-blur-3xl"></div>
      <div className="absolute bottom-1/4 right-10 w-80 h-80 rounded-full bg-uiy-blue/10 backdrop-blur-3xl"></div>
      
      {/* Content */}
      <div className="container mx-auto px-6 z-10 max-w-5xl">
        <div className="py-20 md:py-0 flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-2 animate-fade-in">
            <img 
              src="/images/logo-light.png" 
              alt="UIY Logo"
              className="h-20 sm:h-24 md:h-28 object-contain hidden"
            />
            <div className="inline-block backdrop-blur-sm bg-white/10 py-2 px-4 rounded-full">
              <p className="text-sm font-medium text-white">IESL UIY 2026 Competition</p>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-tight animate-fade-in">
            Undergraduate <br />
            <span className="text-uiy-accent">Inventor</span> of the Year
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl animate-fade-in">
            Fostering innovation among Sri Lanka's engineering students for the next generation of technological advancement.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4 animate-fade-in">
            <a href="#about" className="btn-primary flex items-center justify-center gap-2 group">
              Learn More
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            {user && (
              isAdmin ? (
                <Link to="/admin" className="btn-outline bg-transparent text-white border-white hover:bg-white hover:text-uiy-dark flex items-center justify-center whitespace-nowrap">
                  Admin Dashboard
                </Link>
              ) : myTeam ? (
                <Link to="/my-team" className="btn-outline bg-transparent text-white border-white hover:bg-white hover:text-uiy-dark flex items-center justify-center gap-2 whitespace-nowrap">
                  <Users className="w-4 h-4" />
                  My Team
                </Link>
              ) : (
                <a href="#apply" className="btn-outline bg-transparent text-white border-white hover:bg-white hover:text-uiy-dark flex items-center justify-center whitespace-nowrap">
                  Apply Now
                </a>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
