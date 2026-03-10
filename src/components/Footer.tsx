
import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="contact" className="bg-white border-t border-gray-100">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src='/images/logo-light.png' alt="UIY 2026" className="w-auto h-16" />
              <span className="font-display text-xl font-semibold">UIY 2026</span>
            </div>
            
            <p className="text-gray-600 mb-6 max-w-md">
              The Undergraduate Inventor of the Year competition, organized by the Institution of Engineers Sri Lanka (IESL),
              recognizes and inspires engineering undergraduates across Sri Lanka.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-uiy-blue flex-shrink-0 mt-0.5" />
                <p className="text-gray-600">120/15, Wijerama Mawatha, Colombo 07, Sri Lanka</p>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-uiy-blue flex-shrink-0" />
                <p className="text-gray-600">+94 11 2698426</p>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-uiy-blue flex-shrink-0" />
                <p className="text-gray-600">uiy@iesl.lk</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#home" className="text-gray-600 hover:text-uiy-blue transition-colors">Home</a></li>
              <li><a href="#about" className="text-gray-600 hover:text-uiy-blue transition-colors">About</a></li>
              <li><a href="#eligibility" className="text-gray-600 hover:text-uiy-blue transition-colors">Eligibility</a></li>
              <li><a href="#process" className="text-gray-600 hover:text-uiy-blue transition-colors">Process</a></li>
              <li><a href="#awards" className="text-gray-600 hover:text-uiy-blue transition-colors">Awards</a></li>
              <li><a href="#apply" className="text-gray-600 hover:text-uiy-blue transition-colors">Apply Now</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><a href="https://iesl.lk" className="text-gray-600 hover:text-uiy-blue transition-colors">IESL Website</a></li>
              <li><a href="#" className="text-gray-600 hover:text-uiy-blue transition-colors hidden">Past Winners</a></li>
              <li><a href="#" className="text-gray-600 hover:text-uiy-blue transition-colors hidden">Competition Rules</a></li>
              <li><a href="#" className="text-gray-600 hover:text-uiy-blue transition-colors hidden">Contact Support</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">© 2026 Institution of Engineers Sri Lanka. All rights reserved.</p>
          
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-uiy-blue transition-colors hidden">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-uiy-blue transition-colors hidden">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
