import React from 'react';
import { Link } from 'react-router-dom';
import { LoginForm } from '@/features/Auth/components/LoginForm';

const Login: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-uiy-darkblue via-uiy-blue to-uiy-accent px-4">
    <div className="w-full max-w-md">
      <div className="flex justify-center mb-8">
        <Link to="/">
          <img src="/images/logo-light.png" alt="UIY 2026" className="h-16 w-auto" />
        </Link>
      </div>
      <LoginForm />
    </div>
  </div>
);

export default Login;
