import en from '../../messages/en.json';
import es from '../../messages/es.json';

export const locales = ['en', 'es'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const messages: Record<Locale, typeof en> = {
  en,
  es,
};

export function normalizeLocale(locale?: string): Locale {
  return locale === 'es' ? 'es' : defaultLocale;
}
