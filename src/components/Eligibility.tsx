
import React from 'react';
import { Check, University } from 'lucide-react';

const universities = [
  "University of Peradeniya",
  "University of Moratuwa",
  "University of Ruhuna",
  "South Eastern University of Sri Lanka",
  "University of Jayawardhanapura",
  "University of Jaffna",
  "Open University of Sri Lanka"
];

const Eligibility = () => {
  return (
    <section id="eligibility" className="py-24 bg-gradient-blue">
      <div className="section-container">
        <div className="max-w-3xl mx-auto text-center mb-16 reveal-animation">
          <p className="text-sm font-semibold text-uiy-blue uppercase tracking-wider mb-3">Who Can Participate</p>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Eligibility Criteria</h2>
          <p className="text-lg text-gray-600">
            The UIY competition is exclusively open to engineering students from specific universities in Sri Lanka,
            providing them with a platform to showcase their innovative solutions.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="reveal-animation">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="inline-flex items-center gap-2 mb-6">
                <University className="w-6 h-6 text-uiy-blue" />
                <h3 className="text-2xl font-semibold">Eligible Universities</h3>
              </div>
              
              <ul className="space-y-4">
                {universities.map((university, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-uiy-blue/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-uiy-blue" />
                    </div>
                    <span className="text-gray-700">{university}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-8 bg-white rounded-xl p-8 shadow-lg reveal-animation" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-2xl font-semibold mb-4">Group Consistency</h3>
              <p className="text-gray-600 mb-4">
                UIY inventors can participate in group projects with a maximum of 6 members per group.
              </p>
              <p className="flex items-center gap-2 text-uiy-blue">
                <Check className="w-5 h-5" />
                <span className="font-medium">Maximum 6 members per team</span>
              </p>
            </div>
          </div>
          
          <div className="reveal-animation" style={{ animationDelay: '0.3s' }}>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-semibold mb-6">Application Requirements</h3>
              
              <div className="space-y-6">
                <div>
                  <p className="font-medium text-gray-800 mb-2">1. Registration Status</p>
                  <p className="text-gray-600">
                    Students must be registered undergraduates at one of the eligible universities and hold IESL student membership
                    (to be obtained by July 2025).
                  </p>
                </div>
                
                <div>
                  <p className="font-medium text-gray-800 mb-2">2. Application Submission</p>
                  <p className="text-gray-600">
                    Applications must be submitted through the IESL-UIY website (https://uiy.iesl.lk) by July 31, 2025.
                  </p>
                </div>
                
                <div>
                  <p className="font-medium text-gray-800 mb-2">3. Required Documents</p>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-uiy-blue flex-shrink-0 mt-0.5" />
                      <span>Completed application form</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-uiy-blue flex-shrink-0 mt-0.5" />
                      <span>Project proposal (maximum 3 pages)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-uiy-blue flex-shrink-0 mt-0.5" />
                      <span>Declaration letter from the head of department</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Eligibility;
