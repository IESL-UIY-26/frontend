import React, { createContext, useContext } from 'react';

interface SiteStatus {
  isRegOver: boolean;
}

const SiteStatusContext = createContext<SiteStatus>({ isRegOver: false });

export const SiteStatusProvider = ({ 
  children, 
  isRegOver 
}: { 
  children: React.ReactNode, 
  isRegOver: boolean 
}) => {
  return (
    <SiteStatusContext.Provider value={{ isRegOver }}>
      {children}
    </SiteStatusContext.Provider>
  );
};

export const useSiteStatus = () => useContext(SiteStatusContext);
