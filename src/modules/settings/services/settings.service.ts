import { normalizeLocale, type Locale } from '@/i18n/config';
import { supabase } from '@/lib/supabase/client';
import { enqueueOperation, getCurrentUserId, offlineDB } from '@/modules/sync';
import type { ThemePreference, UserPreferences } from '../types';

const languageCookie = 'vexaro_locale';
const themeCookie = 'vexaro_theme';

function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=31536000; SameSite=Lax`;
}

export function applyTheme(theme: ThemePreference) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.classList.toggle('light', theme === 'light');
  window.localStorage.setItem(themeCookie, theme);
  writeCookie(themeCookie, theme);
}

export function applyLanguage(language: Locale) {
  window.localStorage.setItem(languageCookie, language);
  writeCookie(languageCookie, language);
}

export async function getPreferences(): Promise<UserPreferences> {
  const userId = await getCurrentUserId();
  const cached = await offlineDB.profiles.get(userId);
  if (cached) {
    return cached;
  }

  const { data } = await supabase.auth.getUser();
  const timestamp = new Date().toISOString();
  
  // We need to fetch from Supabase to get the actual profile values if not cached
  let profile = { whatsapp_number: '', whatsapp_enabled: false, timezone: 'America/Lima', daily_summary_time: '20:00:00' };
  if (data.user) {
    const { data: dbProfile } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (dbProfile) profile = { ...profile, ...dbProfile };
  }

  const preferences: UserPreferences = {
    id: userId,
    display_name: data.user?.user_metadata.name ?? '',
    email: data.user?.email ?? '',
    language: normalizeLocale(window.localStorage.getItem(languageCookie) ?? undefined),
    theme: window.localStorage.getItem(themeCookie) === 'dark' ? 'dark' : 'light',
    whatsapp_number: profile.whatsapp_number,
    whatsapp_enabled: profile.whatsapp_enabled,
    timezone: profile.timezone,
    daily_summary_time: profile.daily_summary_time,
    updated_at: timestamp,
  };

  await offlineDB.profiles.put(preferences);
  return preferences;
}

export async function savePreferences(preferences: UserPreferences): Promise<void> {
  const updated: UserPreferences = {
    ...preferences,
    language: normalizeLocale(preferences.language),
    updated_at: new Date().toISOString(),
  };

  await offlineDB.profiles.put(updated);
  applyLanguage(updated.language);
  applyTheme(updated.theme);
  await enqueueOperation('profiles', 'update', updated.id, {
    id: updated.id,
    display_name: updated.display_name,
    language: updated.language,
    theme: updated.theme,
    whatsapp_number: updated.whatsapp_number,
    whatsapp_enabled: updated.whatsapp_enabled,
    timezone: updated.timezone,
    daily_summary_time: updated.daily_summary_time,
    updated_at: updated.updated_at,
  });
}
