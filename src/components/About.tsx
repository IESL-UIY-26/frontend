
import React, { useEffect } from 'react';
import { Award, LightbulbIcon, Book, Globe } from 'lucide-react';

const featuresData = [
  {
    icon: <Award className="w-8 h-8 text-uiy-blue" />,
    title: "National Recognition",
    description: "UIY is a nationally recognized event for top engineering students across Sri Lanka."
  },
  {
    icon: <LightbulbIcon className="w-8 h-8 text-uiy-blue" />,
    title: "Innovation Legacy",
    description: "Building upon the 40+ year legacy of the Junior Inventor of the Year competition."
  },
  {
    icon: <Book className="w-8 h-8 text-uiy-blue" />,
    title: "Research Excellence",
    description: "Strong emphasis on research and engineering excellence for practical solutions."
  },
  {
    icon: <Globe className="w-8 h-8 text-uiy-blue" />,
    title: "Industry Connections",
    description: "Connect with industry experts and academic leaders to refine your innovations."
  }
];

const About = () => {
  useEffect(() => {
    // Animation for revealing elements on scroll
    const revealElements = document.querySelectorAll('.reveal-animation');
    
    const revealOnScroll = () => {
      for (let i = 0; i < revealElements.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = revealElements[i].getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
          revealElements[i].classList.add('is-visible');
        }
      }
    };
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Check on initial load
    
    return () => window.removeEventListener('scroll', revealOnScroll);
  }, []);

  return (
    <section id="about" className="py-24 bg-white">
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-16 reveal-animation">
          <p className="text-sm font-semibold text-uiy-blue uppercase tracking-wider mb-3">About the Competition</p>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Shaping the Next Generation of Engineers</h2>
          <p className="text-lg text-gray-600">
            The UIY competition is a prestigious event organized by the Institution of Engineers Sri Lanka (IESL),
            encouraging engineering students to use their creativity and technical skills to develop innovative
            solutions for real-world problems.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {featuresData.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 card-hover reveal-animation"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 mb-6 rounded-full bg-blue-50 flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-24 grid md:grid-cols-2 gap-12 items-center reveal-animation">
          <div>
            <p className="text-sm font-semibold text-uiy-blue uppercase tracking-wider mb-3">UIY 2026 Theme</p>
            <h3 className="text-3xl font-display font-bold mb-6">Digital Transformation, Human-Machine Interaction, and Entrepreneurship</h3>
            <p className="text-gray-600 mb-6">
              UIY 2026's major focus areas include digital transformation, human-machine interaction, and entrepreneurship, 
              but participants are encouraged to explore beyond these themes and develop next-generation engineering solutions 
              that address real-world challenges.
            </p>
            <a href="#apply" className="btn-primary inline-flex">Learn More About the Theme</a>
          </div>
          
          <div className="relative reveal-animation" style={{ animationDelay: '0.2s' }}>
            <div className="rounded-xl overflow-hidden shadow-xl">
              <img 
                src="/images/uiy-event.jpg" 
                alt="Engineering students collaborating" 
                className="w-full h-auto object-cover" 
              />
            </div>
            <div className="absolute -bottom-8 -left-8 glassmorphism rounded-lg p-4 max-w-xs">
              <p className="font-medium text-uiy-blue">
                "UIY continues to inspire the next generation of engineers with a platform to showcase their innovative solutions."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
