'use client';

import { useState, useEffect, useCallback } from 'react';
import en from '@/locales/en.json';
import am from '@/locales/am.json';

export type Locale = 'en' | 'am';

type TranslationKeys = typeof en;

const translations: Record<Locale, TranslationKeys> = {
  en,
  am,
};

const LOCALE_STORAGE_KEY = 'remitpay-locale';

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let value: unknown = obj;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  
  return typeof value === 'string' ? value : path;
}

function interpolate(text: string, params?: Record<string, string | number>): string {
  if (!params) return text;
  
  return text.replace(/\{(\w+)\}/g, (_, key) => {
    return params[key]?.toString() ?? `{${key}}`;
  });
}

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
    if (stored && (stored === 'en' || stored === 'am')) {
      setLocaleState(stored);
    }
    setIsLoaded(true);
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
    document.documentElement.lang = newLocale;
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const translation = getNestedValue(translations[locale] as unknown as Record<string, unknown>, key);
      return interpolate(translation, params);
    },
    [locale]
  );

  // Format number based on locale
  const formatNumber = useCallback(
    (value: number, options?: Intl.NumberFormatOptions): string => {
      return new Intl.NumberFormat(locale === 'am' ? 'am-ET' : 'en-US', options).format(value);
    },
    [locale]
  );

  // Format currency
  const formatCurrency = useCallback(
    (value: number, currency: 'USD' | 'ETB' = 'USD'): string => {
      return new Intl.NumberFormat(locale === 'am' ? 'am-ET' : 'en-US', {
        style: 'currency',
        currency: currency === 'ETB' ? 'ETB' : 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
    [locale]
  );

  // Format date
  const formatDate = useCallback(
    (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
      const d = typeof date === 'string' ? new Date(date) : date;
      return new Intl.DateTimeFormat(locale === 'am' ? 'am-ET' : 'en-US', {
        dateStyle: 'medium',
        ...options,
      }).format(d);
    },
    [locale]
  );

  // Format time
  const formatTime = useCallback(
    (date: Date | string): string => {
      const d = typeof date === 'string' ? new Date(date) : date;
      return new Intl.DateTimeFormat(locale === 'am' ? 'am-ET' : 'en-US', {
        timeStyle: 'short',
      }).format(d);
    },
    [locale]
  );

  return {
    locale,
    setLocale,
    t,
    formatNumber,
    formatCurrency,
    formatDate,
    formatTime,
    isLoaded,
    isAmharic: locale === 'am',
  };
}

// Locale context for sharing across components
import { createContext, useContext } from 'react';

export interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (value: number, currency?: 'USD' | 'ETB') => string;
  formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions) => string;
  formatTime: (date: Date | string) => string;
  isAmharic: boolean;
}

export const LocaleContext = createContext<LocaleContextValue | null>(null);

export function useLocaleContext() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocaleContext must be used within a LocaleProvider');
  }
  return context;
}
