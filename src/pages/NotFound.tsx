
import React from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
          <span className="text-red-500 text-3xl font-bold">404</span>
        </div>
        
        <h1 className="text-3xl font-display font-bold mb-4">Page Not Found</h1>
        
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for: {location.pathname}
        </p>
        
        <a 
          href="/" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-uiy-blue text-white rounded-md font-medium transition-all hover:bg-uiy-darkblue"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
