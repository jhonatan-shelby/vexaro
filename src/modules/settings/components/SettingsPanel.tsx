'use client';

import { useEffect, useState } from 'react';
import { Languages, Moon, RefreshCw, Save, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/config';
import { getSyncSummary, replayPendingOperations } from '@/modules/sync';
import { getPreferences, savePreferences } from '../services/settings.service';
import type { ThemePreference, UserPreferences } from '../types';

export function SettingsPanel() {
  const t = useTranslations('settings');
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getPreferences().then(setPreferences);
    getSyncSummary().then((summary) => setPendingCount(summary.pendingCount));
  }, []);

  if (!preferences) {
    return <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">Loading settings...</div>;
  }

  const updatePreference = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    setPreferences((current) => current ? { ...current, [key]: value } : current);
    setSaved(false);
  };

  const handleSave = async () => {
    await savePreferences(preferences);
    setSaved(true);
  };

  const handleReplay = async () => {
    const summary = await replayPendingOperations();
    setPendingCount(summary.pendingCount);
  };

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_360px]">
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{t('profile')}</p>
        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <label className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{t('displayName')}</span>
            <input
              value={preferences.display_name}
              onChange={(event) => updatePreference('display_name', event.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{t('email')}</span>
            <input
              value={preferences.email}
              disabled
              className="h-10 w-full rounded-lg border border-input bg-surface-variant/40 px-3 text-sm text-muted-foreground"
            />
          </label>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">{t('language')}</p>
            <div className="inline-flex rounded-lg bg-surface-variant/50 p-1">
              {(['en', 'es'] as Locale[]).map((language) => (
                <button
                  type="button"
                  key={language}
                  onClick={() => updatePreference('language', language)}
                  className={`inline-flex h-9 items-center gap-2 rounded-md px-4 text-sm font-semibold transition-colors ${preferences.language === language ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <Languages className="h-4 w-4" />
                  {language.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">{t('theme')}</p>
            <div className="inline-flex rounded-lg bg-surface-variant/50 p-1">
              {(['light', 'dark'] as ThemePreference[]).map((theme) => (
                <button
                  type="button"
                  key={theme}
                  onClick={() => updatePreference('theme', theme)}
                  className={`inline-flex h-9 items-center gap-2 rounded-md px-4 text-sm font-semibold transition-colors ${preferences.theme === theme ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {theme === 'light' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {t(theme)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="mt-8 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-container"
        >
          <Save className="h-4 w-4" />
          {t('save')}
        </button>
        {saved && <span className="ml-3 text-sm font-semibold text-secondary">{t('saved')}</span>}
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm xl:col-span-1">
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Notifications & WhatsApp</p>
        
        <div className="mt-5 space-y-4">
          <label className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Enable WhatsApp Alerts</span>
            <input 
              type="checkbox"
              checked={preferences.whatsapp_enabled ?? false}
              onChange={(e) => updatePreference('whatsapp_enabled', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
          </label>
          
          {preferences.whatsapp_enabled && (
            <>
              <label className="space-y-2 block">
                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">WhatsApp Number</span>
                <input
                  type="tel"
                  placeholder="+1234567890"
                  value={preferences.whatsapp_number ?? ''}
                  onChange={(event) => updatePreference('whatsapp_number', event.target.value)}
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </label>

              <label className="space-y-2 block">
                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Daily Summary Time</span>
                <input
                  type="time"
                  value={preferences.daily_summary_time ? preferences.daily_summary_time.slice(0, 5) : '20:00'}
                  onChange={(event) => updatePreference('daily_summary_time', event.target.value + ':00')}
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </label>

              <label className="space-y-2 block">
                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Timezone</span>
                <select
                  value={preferences.timezone ?? 'America/Lima'}
                  onChange={(event) => updatePreference('timezone', event.target.value)}
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="America/Lima">America/Lima (PET)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="Europe/Madrid">Europe/Madrid (CET)</option>
                  <option value="UTC">UTC</option>
                </select>
              </label>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="mt-6 w-full inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-container"
        >
          <Save className="h-4 w-4" />
          {t('save')}
        </button>
      </section>

      <aside className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{t('sync')}</p>
        <div className="mt-5 rounded-2xl bg-surface-variant/40 p-4">
          <p className="text-sm text-muted-foreground">{t('pending')}</p>
          <p className="mt-2 font-mono text-4xl font-bold text-foreground">{pendingCount}</p>
        </div>
        <button
          type="button"
          onClick={handleReplay}
          className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:bg-surface-variant"
        >
          <RefreshCw className="h-4 w-4" />
          {t('replay')}
        </button>
      </aside>
    </div>
  );
}
