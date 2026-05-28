import type { Locale } from '@/i18n/config';

export type ThemePreference = 'light' | 'dark';

export interface UserPreferences {
  id: string;
  display_name: string;
  email: string;
  language: Locale;
  theme: ThemePreference;
  whatsapp_number?: string;
  whatsapp_enabled?: boolean;
  timezone?: string;
  daily_summary_time?: string;
  updated_at: string;
}
