"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "../../components/app-shell";
import { setTheme as setGlobalTheme } from "../../components/theme-sync";
import { supabase } from "../../lib/supabase-browser";

const themeOptions = [
  {
    id: "neon-blue",
    name: "Neon Blue",
    description: "Signature Code Royale glow",
    color: "bg-sky-500",
  },
  {
    id: "ember-red",
    name: "Ember Red",
    description: "High-contrast red accent",
    color: "bg-red-500",
  },
  {
    id: "hazard-orange",
    name: "Hazard Orange",
    description: "Warm orange glow",
    color: "bg-orange-500",
  },
];

export default function SettingsPage() {
  const [spectateEnabled, setSpectateEnabled] = useState(true);
  const [theme, setTheme] = useState("neon-blue");

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState("");
  const [tagline, setTagline] = useState("");

  const spectateLabel = useMemo(
    () => (spectateEnabled ? "Friends can spectate your matches" : "Spectate disabled"),
    [spectateEnabled],
  );

  useEffect(() => {
    try {
      const savedSpectate = localStorage.getItem("cr_settings_spectate_enabled");
      if (savedSpectate !== null) setSpectateEnabled(savedSpectate === "true");

      const savedTheme = localStorage.getItem("cr_settings_theme");
      if (savedTheme) setTheme(savedTheme);

      const savedTagline = localStorage.getItem("cr_settings_tagline");
      if (savedTagline !== null) setTagline(savedTagline);
    } catch {
      // ignore localStorage errors
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      setLoadingProfile(true);
      setError(null);
      setSuccess(null);

      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (!mounted) return;

      if (authError || !authData.user?.id) {
        setError(authError?.message ?? "You must be signed in to edit settings.");
        setLoadingProfile(false);
        return;
      }

      const { data: userRow, error: profileError } = await supabase
        .from("users")
        .select("username")
        .eq("id", authData.user.id)
        .maybeSingle();

      if (!mounted) return;

      if (profileError) {
        setError(profileError.message);
        setLoadingProfile(false);
        return;
      }

      setDisplayName(userRow?.username ?? "");
      setLoadingProfile(false);
    };

    void loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    setGlobalTheme(newTheme);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      localStorage.setItem("cr_settings_spectate_enabled", String(spectateEnabled));
      localStorage.setItem("cr_settings_theme", theme);
      localStorage.setItem("cr_settings_tagline", tagline);
      setGlobalTheme(theme);
    } catch {
      // ignore localStorage errors
    }

    const nextName = displayName.trim();

    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user?.id) {
      setError(authError?.message ?? "You must be signed in to save changes.");
      setSaving(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({ username: nextName.length ? nextName : null })
      .eq("id", authData.user.id);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    setSuccess("Settings saved successfully.");
    setSaving(false);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl p-6">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--cr-fg)]">Settings</h1>
          <p className="mt-1 text-sm text-[var(--cr-fg-muted)]">
            Manage your account preferences and appearance.
          </p>
        </header>

        <div className="space-y-6">
          {/* Profile Section */}
          <section className="rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] p-6">
            <h2 className="mb-4 text-lg font-semibold text-[var(--cr-fg)]">Profile</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(var(--cr-accent-rgb),0.2)] text-lg font-bold text-[rgb(var(--cr-accent-rgb))]">
                  CR
                </div>
                <div>
                  <label className="block text-sm text-[var(--cr-fg-muted)]">Profile photo</label>
                  <button className="mt-1 rounded-md border border-[var(--cr-border)] bg-[var(--cr-bg)] px-3 py-1.5 text-sm text-[var(--cr-fg)] transition-colors hover:bg-[var(--cr-bg-tertiary)]">
                    Upload new
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--cr-fg)]">
                  Display Name
                </label>
                <input
                  type="text"
                  placeholder={loadingProfile ? "Loading…" : "Enter your name"}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={loadingProfile || saving}
                  className="w-full rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg)] px-4 py-2.5 text-sm text-[var(--cr-fg)] placeholder:text-[var(--cr-fg-muted)] focus:border-[rgba(var(--cr-accent-rgb),0.5)] focus:outline-none disabled:opacity-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--cr-fg)]">
                  Tagline
                </label>
                <textarea
                  rows={3}
                  placeholder="A short description about yourself"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  disabled={saving}
                  className="w-full resize-none rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg)] px-4 py-2.5 text-sm text-[var(--cr-fg)] placeholder:text-[var(--cr-fg-muted)] focus:border-[rgba(var(--cr-accent-rgb),0.5)] focus:outline-none disabled:opacity-50"
                />
              </div>
            </div>
          </section>

          {/* Theme Section */}
          <section className="rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] p-6">
            <h2 className="mb-4 text-lg font-semibold text-[var(--cr-fg)]">Theme</h2>
            <p className="mb-4 text-sm text-[var(--cr-fg-muted)]">
              Choose your preferred color theme. Changes apply immediately.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {themeOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleThemeChange(option.id)}
                  disabled={saving}
                  className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-all ${
                    theme === option.id
                      ? "border-[rgb(var(--cr-accent-rgb))] bg-[rgba(var(--cr-accent-rgb),0.1)]"
                      : "border-[var(--cr-border)] hover:border-[var(--cr-fg-muted)]"
                  }`}
                >
                  <span className={`h-8 w-8 rounded-full ${option.color}`} />
                  <div>
                    <span className="block text-sm font-medium text-[var(--cr-fg)]">
                      {option.name}
                    </span>
                    <span className="text-xs text-[var(--cr-fg-muted)]">{option.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Privacy Section */}
          <section className="rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] p-6">
            <h2 className="mb-4 text-lg font-semibold text-[var(--cr-fg)]">Privacy</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--cr-fg)]">Match Spectating</p>
                <p className="text-xs text-[var(--cr-fg-muted)]">{spectateLabel}</p>
              </div>
              <button
                onClick={() => setSpectateEnabled(!spectateEnabled)}
                disabled={saving}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  spectateEnabled ? "bg-[rgb(var(--cr-accent-rgb))]" : "bg-[var(--cr-bg-tertiary)]"
                }`}
              >
                <span
                  className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                    spectateEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </section>

          {/* Security Section */}
          <section className="rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] p-6">
            <h2 className="mb-4 text-lg font-semibold text-[var(--cr-fg)]">Security</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--cr-fg)]">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg)] px-4 py-2.5 text-sm text-[var(--cr-fg)] focus:border-[rgba(var(--cr-accent-rgb),0.5)] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--cr-fg)]">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg)] px-4 py-2.5 text-sm text-[var(--cr-fg)] focus:border-[rgba(var(--cr-accent-rgb),0.5)] focus:outline-none"
                />
              </div>
              <button className="rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg)] px-4 py-2 text-sm font-medium text-[var(--cr-fg)] transition-colors hover:bg-[var(--cr-bg-tertiary)]">
                Update Password
              </button>
            </div>
          </section>

          {/* Messages */}
          {(error || success) && (
            <div
              className={`rounded-lg border p-4 text-sm ${
                error
                  ? "border-red-500/30 bg-red-500/10 text-red-400"
                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              }`}
            >
              {error ?? success}
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving || loadingProfile}
              className="rounded-lg bg-[rgb(var(--cr-accent-rgb))] px-6 py-2.5 text-sm font-semibold text-[var(--cr-bg)] transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
