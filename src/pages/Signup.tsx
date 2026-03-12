import React from 'react';
import { Link } from 'react-router-dom';
import { SignupForm } from '@/features/Auth/components/SignupForm';

const Signup: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-uiy-darkblue via-uiy-blue to-uiy-accent px-4 py-10">
    <div className="w-full max-w-md">
      <div className="flex justify-center mb-8">
        <Link to="/">
          <img src="/images/logo-light.png" alt="UIY 2026" className="h-16 w-auto" />
        </Link>
      </div>
      <SignupForm />
    </div>
  </div>
);

export default Signup;
