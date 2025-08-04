'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext({
  language: 'es-ES',
  setLanguage: (lang: string) => {},
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState(() => {
    // Load the language from local storage or default to 'en-US'
    if (typeof window !== 'undefined') {
      return localStorage.getItem('language') || 'en-US';
    }
    return 'es-ES';
  });

  useEffect(() => {
    // Save the language to local storage whenever it changes
    localStorage.setItem('language', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);