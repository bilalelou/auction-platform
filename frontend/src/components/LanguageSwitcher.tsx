"use client";

import { useLanguage } from '@/lib/i18n/LanguageContext';
import { localeNames, type Locale } from '@/lib/i18n/config';
import { useState, useRef, useEffect } from 'react';

// Flag icons as SVG
const flagIcons: Record<Locale, JSX.Element> = {
  ar: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="6" width="20" height="4" fill="#CE1126"/>
      <rect x="2" y="10" width="20" height="4" fill="#FFFFFF"/>
      <rect x="2" y="14" width="20" height="4" fill="#000000"/>
      <path d="M10 12L6 9v6l4-3z" fill="#007A3D"/>
      <path d="M10 12l1.5-1 1.5 1-1.5 1-1.5-1z" fill="#FFFFFF"/>
    </svg>
  ),
  en: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="6" width="20" height="12" fill="#012169"/>
      <path d="M2 6h20l-10 6L2 6z" fill="#FFFFFF"/>
      <path d="M2 18h20l-10-6L2 18z" fill="#FFFFFF"/>
      <path d="M12 6v12M2 12h20" stroke="#FFFFFF" strokeWidth="1.5"/>
      <path d="M12 6v12M2 12h20" stroke="#C8102E" strokeWidth="0.8"/>
    </svg>
  ),
  fr: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="6" width="6.67" height="12" fill="#002395"/>
      <rect x="8.67" y="6" width="6.67" height="12" fill="#FFFFFF"/>
      <rect x="15.34" y="6" width="6.66" height="12" fill="#ED2939"/>
    </svg>
  ),
};

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all hover:shadow-md"
        aria-label={t('common.language')}
      >
        {flagIcons[locale]}
        <span className="font-medium hidden sm:inline">{localeNames[locale]}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden z-50 min-w-[180px] animate-fade-in">
          {Object.entries(localeNames).map(([code, name]) => (
            <button
              key={code}
              onClick={() => handleLocaleChange(code as Locale)}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 ${
                locale === code
                  ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-semibold'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {flagIcons[code as Locale]}
              <span>{name}</span>
              {locale === code && (
                <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
