import React from 'react'
import Navbar from '@/components/Navbar'
import { ArrowRight, Calendar, MapPin } from 'lucide-react'

const SessionTemp = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-28 pb-16 px-4">
        <div className="max-w-md">
          <div className="rounded-xl overflow-hidden shadow-lg bg-white">
            {/* Flyer Image Section */}
            <div className="w-full bg-slate-900">
              <img
                src="/images/flyer.jpeg"
                alt="Inventor Chronicles 2.0 flyer"
                className="w-full h-auto object-contain"
              />
            </div>

            {/* Content Section */}
            <div className="p-4 space-y-3">
              <div className="text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-uiy-blue mb-1">
                  Inventor Chronicles 2.0
                </p>
                <h1 className="text-lg font-bold text-gray-900 leading-tight">
                  Innovation with Purpose: Building Solutions That Society Needs
                </h1>
                <p className="mt-1.5 text-xs text-gray-600">
                  We are honored to feature Sanjaya Elvitigala, CEO of
                  eLearning.lk and a distinguished expert in LMS, AI & SaaS
                  solutions.
                </p>
              </div>

              <div className="flex items-center justify-center gap-4 pt-1 text-xs text-gray-700">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-uiy-blue" />
                  <span className="font-semibold text-gray-900">
                    24th April
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="font-semibold text-gray-900">7:00 PM</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-uiy-blue" />
                  <span className="font-semibold text-gray-900">Via Zoom</span>
                </div>
              </div>

              <div className="pt-1 text-center">
                <a
                  href="https://forms.gle/KvZtcTUcjGbK1pDb9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-uiy-blue px-4 py-1.5 text-xs font-semibold text-white shadow-md transition hover:bg-uiy-darkblue"
                >
                  Register now
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default SessionTemp
