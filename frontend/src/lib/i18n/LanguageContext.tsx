"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Locale } from './config';
import { getTranslation, replaceVariables } from './config';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, variables?: Record<string, string>) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'preferred_locale';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ar');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Load saved locale from localStorage
    const saved = localStorage.getItem(STORAGE_KEY) as Locale;
    if (saved && ['ar', 'en', 'fr'].includes(saved)) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    if (isClient) {
      localStorage.setItem(STORAGE_KEY, newLocale);
      // Update document direction
      document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = newLocale;
    }
  }, [isClient]);

  const t = useCallback((key: string, variables?: Record<string, string>) => {
    const translation = getTranslation(locale, key);
    return variables ? replaceVariables(translation, variables) : translation;
  }, [locale]);

  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    if (isClient) {
      document.documentElement.dir = dir;
      document.documentElement.lang = locale;
    }
  }, [locale, dir, isClient]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Hook for translation only
export function useTranslation() {
  const { t, locale } = useLanguage();
  return { t, locale };
}
