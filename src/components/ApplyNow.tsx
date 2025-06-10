import React from 'react';
import { Calendar, File, ArrowRight, Download } from 'lucide-react';

const ApplyNow = () => {
  return (
    <section id="apply" className="py-24 bg-uiy-gray">
      <div className="section-container">
        <div className="max-w-3xl mx-auto text-center mb-16 reveal-animation">
          <p className="text-sm font-semibold text-uiy-blue uppercase tracking-wider mb-3">Get Started</p>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Ready to Apply?</h2>
          <p className="text-lg text-gray-600">
            Follow these steps to start your journey in the UIY 2025 competition and showcase your innovative engineering solution.
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden reveal-animation">
          <div className="grid md:grid-cols-2">
            <div className="p-8 md:p-12">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h3 className="text-2xl font-bold">Application Checklist</h3>
                <div className="flex flex-wrap gap-2">
                  <a 
                    href="https://uiy.iesl.lk/documents/UIY_Genaral_Instruction_2025_New.pdf" 
                    className="inline-flex items-center gap-1 px-3 py-2 text-xs bg-uiy-blue text-white rounded-md hover:bg-uiy-darkblue transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="w-3 h-3" />
                    General Instructions
                  </a>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-uiy-blue">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Verify Your Eligibility</h4>
                    <p className="text-gray-600">Confirm you're an engineering registered undergraduate at one of the eligible universities.</p>
                  </div>
                </div>
{/*                 
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-uiy-blue">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Obtain IESL Membership</h4>
                    <p className="text-gray-600">Ensure you have student membership with IESL (required by July 2025).</p>
                  </div>
                </div>
                 */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-uiy-blue">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Prepare Your Documents</h4>
                    <p className="text-gray-600">Create your application, brief project report, and get the declaration letter.</p>
                    <div className="mt-2 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <File className="w-4 h-4 text-uiy-blue" />
                        <span>Application form</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <File className="w-4 h-4 text-uiy-blue" />
                        <span>Brief Project Report (max 3 pages)</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <File className="w-4 h-4 text-uiy-blue" />
                        <span>Declaration letter from department head</span>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium text-gray-700">Download required documents:</p>
                      <div className="flex flex-wrap gap-2">
                        <a 
                          href="https://uiy.iesl.lk/documents/uiy-reoport-temp.doc" 
                          className="inline-flex items-center gap-1 px-3 py-2 text-xs bg-uiy-blue text-white rounded-md hover:bg-uiy-darkblue transition-colors"
                        >
                          <Download className="w-3 h-3" />
                          UIY Report Template
                        </a>
                        <a 
                          href="https://uiy.iesl.lk/documents/Declaration_Letter.docx" 
                          className="inline-flex items-center gap-1 px-3 py-2 text-xs bg-uiy-blue text-white rounded-md hover:bg-uiy-darkblue transition-colors"
                        >
                          <Download className="w-3 h-3" />
                          Declaration Letter
                        </a>
                      </div>
                    </div>

                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-uiy-blue">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Submit Your Application</h4>
                    <p className="text-gray-600">Submit all documents via the UIY website before July 31, 2025.</p>
                    <div className="mt-3 flex items-center gap-2 text-sm font-medium text-uiy-blue">
                      <Calendar className="w-4 h-4" />
                      <span>Deadline: July 31, 2025</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <a href="https://docs.google.com/forms/d/1L7owY2QViIQ3s4P4RmIn1JHLe8yrbAlYXsKD2f07PwM/edit" className="mt-8 btn-primary inline-flex items-center gap-2 group">
                Start Your Application 
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
            
            <div className="bg-gradient-blue p-8 md:p-12 flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-6">Important Dates</h3>
              
              <div className="space-y-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-sm">
                  <div className="text-sm font-medium text-uiy-blue mb-1 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>July 31, 2025</span>
                  </div>
                  <p className="font-medium">Application Deadline</p>
                  <p className="text-sm text-gray-600 mt-1">Last day to submit your complete application package</p>
                </div>
                
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-sm">
                  <div className="text-sm font-medium text-uiy-blue mb-1 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>August-September 2025</span>
                  </div>
                  <p className="font-medium">Preliminary Competition</p>
                  <p className="text-sm text-gray-600 mt-1">Submission of video, brochure, and Q&A session</p>
                </div>
                
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-sm">
                  <div className="text-sm font-medium text-uiy-blue mb-1 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>October 2025</span>
                  </div>
                  <p className="font-medium">Final Competition & Awards</p>
                  <p className="text-sm text-gray-600 mt-1">Physical event with prototype demonstrations</p>
                </div>
              </div>
              
              <div className="mt-8 bg-white/20 backdrop-blur-sm rounded-lg p-5 border border-white/30">
                <p className="text-sm text-uiy-darkblue font-medium">
                  "The journey of innovation begins with a single application. Take the first step today towards 
                  recognition and bringing your engineering solution to life."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApplyNow;
