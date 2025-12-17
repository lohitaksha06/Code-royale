"use client";

import { useMemo, useState } from "react";
import { HomeNav } from "../home/home-nav";
import { NeonButton } from "../../components/neon-button";

const themeOptions = [
  {
    id: "neon-blue",
    name: "Neon Blue",
    description: "Signature Code Royale glow. Futuristic blues with cyan highlights.",
    swatch: "bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700",
  },
];

export default function SettingsPage() {
  const [spectateEnabled, setSpectateEnabled] = useState(true);
  const [theme, setTheme] = useState("neon-blue");

  const spectateLabel = useMemo(
    () => (spectateEnabled ? "Friends can spectate" : "Spectate disabled"),
    [spectateEnabled],
  );

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#030915] text-sky-100">
      <HomeNav />
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-6 pb-20 pt-28 sm:px-10 lg:px-12">
        <header className="rounded-3xl border border-sky-500/20 bg-gradient-to-br from-[#071629] via-[#041021] to-[#020610] p-8 shadow-[0_0_60px_rgba(56,189,248,0.2)]">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-sky-400/80">Pilot Controls</p>
          <h1 className="mt-4 text-4xl font-semibold text-sky-50 sm:text-5xl">Account & appearance</h1>
          <p className="mt-3 max-w-2xl text-sm text-sky-100/70">
            Tune your avatar, update credentials, and decide how friends interact with your arena sessions. Theme selections will power future color variants across the HUD.
          </p>
        </header>

        <section className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-6 rounded-3xl border border-sky-500/20 bg-[#040b18]/80 p-8 shadow-[0_0_45px_rgba(56,189,248,0.14)]">
            <h2 className="text-lg font-semibold text-sky-50">Identity loadout</h2>
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-sky-500/30 bg-slate-950/80 text-sm font-semibold uppercase tracking-[0.35em] text-sky-200 shadow-[0_0_30px_rgba(56,189,248,0.25)]">
                  CR
                </div>
                <div className="flex flex-col gap-2 text-sm text-sky-100/70">
                  <span className="text-xs uppercase tracking-[0.35em] text-sky-400/70">Profile photo</span>
                  <label className="w-max cursor-pointer rounded-full border border-sky-500/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-sky-100 transition hover:border-sky-300 hover:bg-sky-500/20">
                    Upload new
                    <input type="file" className="sr-only" accept="image/*" />
                  </label>
                  <span className="text-[11px] text-sky-400/60">PNG or JPG · 2 MB max.</span>
                </div>
              </div>

              <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-sky-400/70">
                Display name
                <input
                  type="text"
                  placeholder="NeonAce"
                  className="rounded-2xl border border-sky-500/25 bg-[#050d1a] px-4 py-3 text-sm text-sky-100 focus:border-sky-300 focus:outline-none"
                />
              </label>

              <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-sky-400/70">
                Arena tagline
                <textarea
                  rows={4}
                  placeholder="Drop a short description so rivals know what they’re up against."
                  className="resize-none rounded-2xl border border-sky-500/25 bg-[#050d1a] px-4 py-3 text-sm text-sky-100 focus:border-sky-300 focus:outline-none"
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-6 rounded-3xl border border-sky-500/20 bg-[#040b18]/80 p-8 shadow-[0_0_45px_rgba(56,189,248,0.14)]">
            <h2 className="text-lg font-semibold text-sky-50">Security weave</h2>
            <p className="text-sm text-sky-100/70">
              Changing your password logs you out of other devices and reissues a fresh Firebase session token.
            </p>
            <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-sky-400/70">
              Current password
              <input
                type="password"
                placeholder="••••••••"
                className="rounded-2xl border border-sky-500/25 bg-[#050d1a] px-4 py-3 text-sm text-sky-100 focus:border-sky-300 focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-sky-400/70">
              New password
              <input
                type="password"
                placeholder="Enter new secret"
                className="rounded-2xl border border-sky-500/25 bg-[#050d1a] px-4 py-3 text-sm text-sky-100 focus:border-sky-300 focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-sky-400/70">
              Confirm password
              <input
                type="password"
                placeholder="Repeat new secret"
                className="rounded-2xl border border-sky-500/25 bg-[#050d1a] px-4 py-3 text-sm text-sky-100 focus:border-sky-300 focus:outline-none"
              />
            </label>
            <NeonButton className="mt-2 w-full justify-center">
              Update password
            </NeonButton>
          </div>
        </section>

        <section className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-6 rounded-3xl border border-sky-500/20 bg-[#040b18]/80 p-8 shadow-[0_0_45px_rgba(56,189,248,0.14)]">
            <h2 className="text-lg font-semibold text-sky-50">Match visibility</h2>
            <p className="text-sm text-sky-100/70">
              Control whether friends can drop into your active games. Toggle stays local until real-time permissions wire up.
            </p>
            <div>
              <button
                type="button"
                onClick={() => setSpectateEnabled((previous) => !previous)}
                className={`relative inline-flex h-10 w-20 items-center rounded-full border transition ${
                  spectateEnabled
                    ? "border-emerald-400 bg-emerald-500/30"
                    : "border-slate-600 bg-slate-800"
                }`}
                aria-pressed={spectateEnabled}
              >
                <span
                  className={`absolute left-1 top-1 h-8 w-8 rounded-full bg-slate-950 transition-transform ${
                    spectateEnabled ? "translate-x-10" : "translate-x-0"
                  }`}
                />
              </button>
              <p className="mt-3 text-xs uppercase tracking-[0.35em] text-sky-400/70">{spectateLabel}</p>
            </div>
          </div>

          <div className="flex flex-col gap-6 rounded-3xl border border-sky-500/20 bg-[#040b18]/80 p-8 shadow-[0_0_45px_rgba(56,189,248,0.14)]">
            <h2 className="text-lg font-semibold text-sky-50">Theme matrix</h2>
            <p className="text-sm text-sky-100/70">
              Personalize HUD colors. More palettes unlock as the platform expands.
            </p>
            <div className="grid gap-4">
              {themeOptions.map((option) => (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-center justify-between gap-4 rounded-2xl border px-4 py-4 transition ${
                    theme === option.id
                      ? "border-sky-300 bg-sky-500/20 shadow-[0_0_30px_rgba(56,189,248,0.25)]"
                      : "border-sky-500/20 bg-[#050d1a] hover:border-sky-300/60"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`h-12 w-12 rounded-full ${option.swatch} shadow-[0_0_24px_rgba(56,189,248,0.4)]`} />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-sky-100">{option.name}</span>
                      <span className="text-xs text-sky-100/70">{option.description}</span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="theme"
                    value={option.id}
                    checked={theme === option.id}
                    onChange={() => setTheme(option.id)}
                    className="h-4 w-4 accent-sky-400"
                  />
                </label>
              ))}
            </div>
          </div>
        </section>

        <div className="flex flex-wrap justify-end gap-4">
          <NeonButton className="px-8 py-3 uppercase tracking-[0.35em]">
            Save changes
          </NeonButton>
        </div>
      </div>
    </div>
  );
}
