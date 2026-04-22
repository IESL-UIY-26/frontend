import React, { useState } from 'react'
import { Calendar, ArrowDown, CheckCircle } from 'lucide-react'

const timelineData = [
  {
    title: 'Application Phase',
    date: 'By August 24, 2026',
    description:
      'Submit your application, project proposal, and declaration letter through the IESL-UIY website.',
    requirements: [
      'Completed application form',
      'Project proposal (max 3 pages)',
      'Declaration letter from department head',
    ],
  },
  {
    title: 'Preliminary Competition',
    subtitle: '*Subjected to change',
    date: 'Coming Soon',
    description:
      'Selected candidates will submit additional materials and participate in a Q&A session.',
    requirements: [
      '3-minute video of the invention',
      'Brochure of the invention',
      'Q&A session',
    ],
  },
  {
    title: 'Final Competition',
    date: 'Coming Soon',
    description:
      'Physical event featuring the top innovations (max 6) with prototype demonstrations.',
    requirements: [
      'Physical prototype of the invention',
      'Brief Project Report (max 10 pages)',
      'Marketing video clip',
      'Q&A session',
    ],
  },
  {
    title: 'Awards Ceremony',
    date: 'Coming Soon',
    description:
      'Recognition of the top inventors with prizes and certificates.',
    highlight: true,
  },
]

const evaluationCriteria = [
  'Originality and creativity',
  'Social, local, and global impact',
  'Execution of the idea into a working model',
  'Feasibility for implementation or commercialization',
  'Innovation demonstration',
]

const Process = () => {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <section id="process" className="py-24 bg-white">
      <div className="section-container">
        <div className="max-w-3xl mx-auto text-center mb-16 reveal-animation">
          <p className="text-sm font-semibold text-uiy-blue uppercase tracking-wider mb-3">
            Competition Journey
          </p>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Path to UIY
          </h2>
          <p className="text-lg text-gray-600">
            From application to awards, follow the structured process to
            showcase your engineering innovation.
          </p>
        </div>

        {/* Timeline */}
        <div className="mt-20 mb-32 relative">
          {/* Timeline line */}
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-uiy-blue/30 -translate-x-1/2 md:block hidden"></div>

          {timelineData.map((item, index) => (
            <div
              key={index}
              className={`mb-20 md:mb-32 flex flex-col md:flex-row md:items-center reveal-animation ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Timeline point */}
              <div className="hidden md:block absolute left-1/2 w-6 h-6 rounded-full bg-white border-4 border-uiy-blue -translate-x-1/2"></div>

              {/* Content box */}
              <div
                className={`md:w-5/12 ${index % 2 === 0 ? 'md:text-right md:pr-16' : 'md:pl-16'}`}
              >
                <div
                  className={`bg-white p-6 rounded-xl shadow-md border-l-4 ${item.highlight ? 'border-l-uiy-accent' : 'border-l-uiy-blue'}`}
                >
                  <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{item.date}</span>
                  </div>

                  <h3
                    className={`text-xl font-bold ${item.highlight ? 'text-uiy-accent' : 'text-uiy-blue'}`}
                  >
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <p className="text-sm text-gray-500 mb-4">
                      {item.subtitle}
                    </p>
                  )}

                  <p className="text-gray-600 mb-4">{item.description}</p>

                  {item.requirements && (
                    <ul
                      className={`space-y-2 text-sm text-gray-600 ${index % 2 === 0 ? 'md:text-right' : ''}`}
                    >
                      {item.requirements.map((req, reqIdx) => (
                        <li key={reqIdx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-uiy-blue flex-shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Empty space for the other side */}
              <div className="md:w-5/12"></div>
            </div>
          ))}
        </div>

        {/* Evaluation Process */}
        <div className="bg-gray-50 rounded-2xl p-8 md:p-12 shadow-sm reveal-animation">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-display font-bold mb-8 text-center">
              Evaluation Process
            </h3>

            <div className="mb-8">
              <div className="flex flex-wrap gap-4 mb-6">
                <button
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 0 ? 'bg-uiy-blue text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => setActiveTab(0)}
                >
                  Evaluation Criteria
                </button>
                <button
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 1 ? 'bg-uiy-blue text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => setActiveTab(1)}
                >
                  Disqualification Reasons
                </button>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm min-h-[300px]">
                {activeTab === 0 ? (
                  <div className="animate-fade-in">
                    <p className="text-gray-700 mb-6">
                      Judges will evaluate projects based on the following
                      criteria:
                    </p>
                    <ul className="space-y-4">
                      {evaluationCriteria.map((criterion, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-uiy-blue/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-uiy-blue font-medium text-sm">
                              {index + 1}
                            </span>
                          </div>
                          <p className="text-gray-700">{criterion}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="animate-fade-in">
                    <p className="text-gray-700 mb-6">
                      Applications may be unsuccessful for the following
                      reasons:
                    </p>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start gap-3">
                        <span className="text-red-500">•</span>
                        <p>
                          Innovation uses dangerous or unsafe materials and
                          conditions
                        </p>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-red-500">•</span>
                        <p>
                          Innovation that can cause harm to humans and animals
                        </p>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-red-500">•</span>
                        <p>Innovation violates research ethics</p>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-red-500">•</span>
                        <p>Models of existing products and processes</p>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-red-500">•</span>
                        <p>
                          Products/models that contain/use live specimens
                          without ethical clearance
                        </p>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-red-500">•</span>
                        <p>Products/models that contain/use firearms</p>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Process
