'use client';

import { useState, useEffect } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface SiteSettings {
  currently: {
    learning: string;
    building: string;
    last_updated?: string;
    last_updated_iso?: string;
  };
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    currently: {
      learning: '',
      building: '',
    },
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createSupabaseBrowserClient();

  // Load settings
  useEffect(() => {
    async function loadSettings() {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .eq('key', 'currently');

      if (error) {
        console.error('Error loading settings:', error);
        return;
      }

      const newSettings = { ...settings };
      data?.forEach(item => {
        if (item.key === 'currently') {
          newSettings.currently = item.value as typeof newSettings.currently;
        }
      });

      setSettings(newSettings);
      setLoading(false);
    }

    loadSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    setSaving(true);

    // Add last_updated timestamp to settings
    const currentTime = new Date().toISOString();
    const updatedSettings = {
      ...settings.currently,
      last_updated_iso: currentTime,
    };

    // Save settings
    const updates = [
      {
        key: 'currently',
        value: updatedSettings,
        updated_at: currentTime,
      },
    ];

    for (const update of updates) {
      const { error } = await supabase
        .from('site_settings')
        .upsert(update, { onConflict: 'key' });

      if (error) {
        console.error('Error saving settings:', error);
        alert('Failed to save settings');
        setSaving(false);
        return;
      }
    }

    // Update local state with the new timestamp
    setSettings({
      ...settings,
      currently: updatedSettings,
    });

    setSaving(false);
    alert('Settings saved successfully!');
  };

  if (loading) {
    return <div className="p-6">Loading settings...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-mono text-2xl">Site Settings</h1>
        <Link href="/admin" className="btn-8bit px-3 py-2 text-sm">
          Back to Dashboard
        </Link>
      </div>

      <div className="grid gap-6">
        {/* Currently Card Settings */}
        <div className="card-8bit p-6">
          <h2
            className="mb-4 text-base"
            style={{ fontFamily: 'Press Start 2P, monospace' }}
          >
            Currently Card
          </h2>

          <div className="grid gap-4">
            <div>
              <label className="font-mono text-sm">Learning</label>
              <input
                type="text"
                className="input-8bit w-full px-3 py-2"
                value={settings.currently.learning}
                onChange={e =>
                  setSettings({
                    ...settings,
                    currently: {
                      ...settings.currently,
                      learning: e.target.value,
                    },
                  })
                }
                placeholder="e.g., Rust & WebAssembly"
              />
            </div>

            <div>
              <label className="font-mono text-sm">Building</label>
              <input
                type="text"
                className="input-8bit w-full px-3 py-2"
                value={settings.currently.building}
                onChange={e =>
                  setSettings({
                    ...settings,
                    currently: {
                      ...settings.currently,
                      building: e.target.value,
                    },
                  })
                }
                placeholder="e.g., 8-bit portfolio site"
              />
            </div>

            {/* Display last update time - read only */}
            {settings.currently.last_updated_iso && (
              <div>
                <label className="font-mono text-sm text-[var(--text-muted)]">
                  Last Updated
                </label>
                <div className="mt-1 font-mono text-sm text-[var(--accent-primary)]">
                  {formatRelativeTime(settings.currently.last_updated_iso)}
                </div>
                <p className="mt-1 font-mono text-xs text-[var(--text-secondary)]">
                  This will be automatically updated when you save
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-8bit bg-[var(--accent-primary)] px-6 py-3"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
