import { SettingsPanel } from '@/modules/settings';

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-4xl font-semibold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Profile, language, appearance, and offline synchronization.
        </p>
      </div>
      <SettingsPanel />
    </div>
  );
}
