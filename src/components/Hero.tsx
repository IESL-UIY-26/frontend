
import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-up');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    if (titleRef.current) observer.observe(titleRef.current);
    if (subtitleRef.current) observer.observe(subtitleRef.current);
    if (buttonRef.current) observer.observe(buttonRef.current);

    return () => {
      if (titleRef.current) observer.unobserve(titleRef.current);
      if (subtitleRef.current) observer.unobserve(subtitleRef.current);
      if (buttonRef.current) observer.unobserve(buttonRef.current);
    };
  }, []);

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
          <div className="inline-block backdrop-blur-sm bg-white/10 py-2 px-4 rounded-full mb-2 opacity-0" ref={titleRef} style={{animationDelay: '0.2s'}}>
            <p className="text-sm font-medium text-white">IESL UIY 2025 Competition</p>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-tight opacity-0" ref={subtitleRef} style={{animationDelay: '0.4s'}}>
            Undergraduate <br />
            <span className="text-uiy-accent">Inventor</span> of the Year
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl opacity-0 animate-delay-600" ref={subtitleRef} style={{animationDelay: '0.6s'}}>
            Fostering innovation among Sri Lanka's engineering students for the next generation of technological advancement.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4 opacity-0" ref={buttonRef} style={{animationDelay: '0.8s'}}>
            <a href="#about" className="btn-primary flex items-center justify-center gap-2 group">
              Learn More
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a href="#apply" className="btn-outline bg-transparent text-white border-white hover:bg-white hover:text-uiy-dark flex items-center justify-center">
              Apply Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
