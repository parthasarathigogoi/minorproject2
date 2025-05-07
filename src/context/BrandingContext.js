import React, { createContext, useState, useContext, useEffect } from 'react';

// Create context
const BrandingContext = createContext();

// Default branding values
const defaultBranding = {
  institutionName: 'DigiClass',
  logo: null,
};

// Provider component
export const BrandingProvider = ({ children }) => {
  const [branding, setBranding] = useState(() => {
    // Try to get saved branding from localStorage
    const savedBranding = localStorage.getItem('digiclass_branding');
    return savedBranding ? JSON.parse(savedBranding) : defaultBranding;
  });
  
  // Update local storage when branding changes
  useEffect(() => {
    localStorage.setItem('digiclass_branding', JSON.stringify(branding));
  }, [branding]);
  
  // Function to update branding
  const updateBranding = (newBranding) => {
    setBranding(prev => ({
      ...prev,
      ...newBranding
    }));
  };
  
  return (
    <BrandingContext.Provider value={{ branding, updateBranding }}>
      {children}
    </BrandingContext.Provider>
  );
};

// Custom hook to use the branding context
export const useBranding = () => useContext(BrandingContext);

export default BrandingContext; 