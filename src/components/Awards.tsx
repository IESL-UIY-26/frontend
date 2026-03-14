
import React from 'react';
import { Award, Users, Globe, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/Auth/hooks/use-auth';
import { UserRole } from '@/features/Auth/enums/auth.enums';

const Awards = () => {
  const { dbUser } = useAuth();
  const isAdmin = dbUser?.role === UserRole.ADMIN;

  return (
    <section id="awards" className="py-24 bg-uiy-dark text-white">
      <div className="section-container">
        <div className="max-w-3xl mx-auto text-center mb-16 reveal-animation">
          <p className="text-sm font-semibold text-uiy-accent uppercase tracking-wider mb-3">Recognition & Rewards</p>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Awards & Benefits</h2>
          <p className="text-lg text-gray-300">
            The UIY Competition connects undergraduate inventions with industry demands, offering recognition,
            financial rewards, and invaluable networking opportunities.
          </p>
        </div>
        
        {/* Award Prizes */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          
          {/* Second Place */}
          <div className="bg-gradient-to-br from-white/10 to-transparent backdrop-blur-sm p-8 rounded-xl border border-white/10 reveal-animation" style={{ animationDelay: '0.2s' }}>
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 rounded-full bg-blue-400/20">
                <Award className="w-8 h-8 text-blue-400" />
              </div>
              <span className="text-5xl font-bold text-blue-400">2nd</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">Second Place</h3>
            <p className="text-gray-300 mb-4">Recognition for exceptional innovation</p>
            <div className="text-3xl font-bold text-blue-400 mb-2">LKR 125,000</div>
            <p className="text-sm text-gray-400">Plus certificate and island-wide recognition</p>
          </div>

          {/* First Place */}
          <div className="bg-gradient-to-br from-white/10 to-transparent backdrop-blur-sm p-8 rounded-xl border border-white/10 reveal-animation" style={{ animationDelay: '0.3s' }}>
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 rounded-full bg-orange-400/20">
                <Award className="w-8 h-8 text-orange-400" />
              </div>
              <span className="text-5xl font-bold text-orange-400">1st</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">First Place</h3>
            <p className="text-gray-300 mb-4">Recognition for outstanding innovation excellence</p>
            <div className="text-3xl font-bold text-orange-400 mb-2">LKR 150,000</div>
            <p className="text-sm text-gray-400">Plus certificate and island-wide recognition</p>
          </div>

          {/* Third Place */}
          <div className="bg-gradient-to-br from-white/10 to-transparent backdrop-blur-sm p-8 rounded-xl border border-white/10 reveal-animation" style={{ animationDelay: '0.1s' }}>
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 rounded-full bg-uiy-accent/20">
                <Award className="w-8 h-8 text-uiy-accent" />
              </div>
              <span className="text-5xl font-bold text-uiy-accent">3rd</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">Third Place</h3>
            <p className="text-gray-300 mb-4">Recognition for remarkable innovation</p>
            <div className="text-3xl font-bold text-uiy-accent mb-2">LKR 100,000</div>
            <p className="text-sm text-gray-400">Plus certificate and island-wide recognition</p>
          </div>
  
        </div>
        
        {/* Benefits */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12 reveal-animation">
          <h3 className="text-2xl md:text-3xl font-display font-bold mb-8 text-center">Additional Benefits</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-uiy-blue/20 flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-uiy-blue" />
              </div>
              <h4 className="text-xl font-bold mb-3">Industry Connections</h4>
              <p className="text-gray-300">
                Connect with industry experts who can provide guidance and potential partnerships for your innovation.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-uiy-blue/20 flex items-center justify-center mb-4">
                <Globe className="w-8 h-8 text-uiy-blue" />
              </div>
              <h4 className="text-xl font-bold mb-3">International Exposure</h4>
              <p className="text-gray-300">
                Opportunities for showcasing your innovation at international forums and competitions.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-uiy-blue/20 flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-uiy-blue" />
              </div>
              <h4 className="text-xl font-bold mb-3">Mentorship Programs</h4>
              <p className="text-gray-300">
                Access to mentorship programs and workshops to further develop your innovation and entrepreneurial skills.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              By participating in the UIY competition, you're one step closer to turning your innovative idea into a 
              practical, marketable product that contributes to technological and industrial growth.
            </p>
            {isAdmin ? (
              <Link to="/admin" className="mt-8 inline-block btn-primary">Admin Dashboard</Link>
            ) : (
              <a href="#apply" className="mt-8 inline-block btn-primary">Apply Now</a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Awards;
