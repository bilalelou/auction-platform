import ar from './locales/ar.json';
import en from './locales/en.json';
import fr from './locales/fr.json';

export type Locale = 'ar' | 'en' | 'fr';

export const locales: Locale[] = ['ar', 'en', 'fr'];

export const localeNames: Record<Locale, string> = {
  ar: 'العربية',
  en: 'English',
  fr: 'Français',
};

export const translations = {
  ar,
  en,
  fr,
};

export type TranslationKey = keyof typeof ar;

export function getTranslation(locale: Locale, key: string): string {
  const keys = key.split('.');
  let value: any = translations[locale];

  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      return key;
    }
  }

  return typeof value === 'string' ? value : key;
}

export function replaceVariables(text: string, variables: Record<string, string>): string {
  let result = text;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }
  return result;
}
