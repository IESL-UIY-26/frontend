import React from 'react';
import { Link } from 'react-router-dom';
import { SignupForm } from '@/features/Auth/components/SignupForm';

const Signup: React.FC = () => (
  <div className="bg-white p-16 shadow-lg">
    <div className="min-h-screen flex items-center rounded-xl justify-center bg-gradient-to-br from-uiy-darkblue via-uiy-blue to-uiy-accent px-4 py-10">
      <div className="w-full max-w-xl">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center rounded-md border border-white/40 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
          >
            Back to Home
          </Link>
        </div>
        <div className="flex justify-center mb-8">
          <Link to="/">
            <img src="/images/logo-light.png" alt="UIY 2026" className="h-16 w-auto" />
          </Link>
        </div>
        <SignupForm />
      </div>
    </div>
  </div>
);

export default Signup;
