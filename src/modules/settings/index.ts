'use client';

export { SettingsPanel } from './components/SettingsPanel';
export { applyLanguage, applyTheme, getPreferences, savePreferences } from './services/settings.service';
export type { ThemePreference, UserPreferences } from './types';
