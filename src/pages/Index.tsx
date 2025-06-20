
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Eligibility from '@/components/Eligibility';
import Process from '@/components/Process';
import Awards from '@/components/Awards';
import Gallery from '@/components/Gallery';
import FAQ from '@/components/FAQ';
import ApplyNow from '@/components/ApplyNow';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';



const Index = () => {
  useEffect(() => {
    // Initialize intersection observer for animations
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-animation');
    revealElements.forEach((element) => observer.observe(element));

    return () => {
      revealElements.forEach((element) => observer.unobserve(element));
    };
  }, []);

  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <Hero />
      <About />
      <Eligibility />
      <Process />
      <Awards />
      <Gallery />
      <FAQ />
      <ApplyNow />
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
