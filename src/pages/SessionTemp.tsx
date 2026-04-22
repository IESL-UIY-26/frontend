import React from 'react'
import Navbar from '@/components/Navbar'
import { ArrowRight, Calendar, MapPin } from 'lucide-react'

const SessionTemp = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-28 pb-16 px-4">
        <div className="max-w-5xl mx-auto space-y-10">
          {/* Centered Header Section */}
          <section className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-uiy-blue mb-3">
              Inventor Chronicles 2.0
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-gray-900">
              Innovation with Purpose: Building Solutions That Society Needs
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base md:text-lg text-gray-600">
              We are honored to feature Sanjaya Elvitigala, CEO of eLearning.lk
              and a distinguished expert in LMS, AI & SaaS solutions.
            </p>
          </section>

          <div className="flex flex-col items-center justify-center">
            <div className="rounded-2xl overflow-hidden shadow-xl bg-white inline-block">
              <img
                src="/images/flyer.jpeg"
                alt="Inventor Chronicles 2.0 flyer"
                className="block h-auto w-auto max-w-full"
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>

            <div className="mt-8 text-center space-y-6">
              <a
                href="https://forms.gle/KvZtcTUcjGbK1pDb9"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-uiy-blue px-8 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-uiy-darkblue"
              >
                Register now
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default SessionTemp
