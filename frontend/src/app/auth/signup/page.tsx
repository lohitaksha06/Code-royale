"use client";

import Link from "next/link";
import { useState } from "react";
import { NeonButton } from "../../../components/neon-button";

export default function SignupPage() {
  const [processing, setProcessing] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProcessing(true);
    setTimeout(() => setProcessing(false), 1600);
  };

  return (
    <div className="mx-auto grid max-w-4xl gap-10">
      <div className="rounded-[32px] border border-sky-500/20 bg-slate-950/70 p-8 shadow-[0_0_45px_rgba(56,189,248,0.14)] backdrop-blur-xl sm:p-12">
        <div className="flex flex-col gap-6 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-400/70">
            Initiate your dossier
          </span>
          <h1 className="text-3xl font-semibold text-sky-100 md:text-4xl">
            Recruit for the Royale ascent
          </h1>
          <p className="text-sm text-sky-100/70">
            Create your pilot profile to unlock matchmaking, telemetry analytics, and neon-flush battle arenas.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 grid gap-6 text-left">
          <div className="grid gap-2 text-sm text-sky-100/75 md:grid-cols-2 md:gap-6">
            <label className="grid gap-2">
              Display Name
              <input
                required
                placeholder="NeonAce"
                className="rounded-2xl border border-sky-500/30 bg-slate-900/80 px-4 py-3 text-sky-100 placeholder:text-sky-400/40 focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              />
            </label>
            <label className="grid gap-2">
              Email
              <input
                type="email"
                required
                placeholder="ace@coderoyale.gg"
                className="rounded-2xl border border-sky-500/30 bg-slate-900/80 px-4 py-3 text-sky-100 placeholder:text-sky-400/40 focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm text-sky-100/75">
            Password
            <input
              type="password"
              required
              placeholder="••••••••"
              className="rounded-2xl border border-sky-500/30 bg-slate-900/80 px-4 py-3 text-sky-100 placeholder:text-sky-400/40 focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
            />
          </label>

          <label className="grid gap-2 text-sm text-sky-100/75">
            Date of Birth
            <input
              type="date"
              required
              className="rounded-2xl border border-sky-500/30 bg-slate-900/80 px-4 py-3 text-sky-100 placeholder:text-sky-400/40 focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
            />
          </label>

          <div className="flex flex-col gap-3 text-xs text-sky-100/60">
            <label className="flex items-center gap-2">
              <input
                required
                type="checkbox"
                className="h-4 w-4 rounded border border-sky-500/50 bg-slate-900/80 text-sky-400 accent-sky-500"
              />
              I accept the Code Royale Protocol and Firebase usage terms.
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border border-sky-500/50 bg-slate-900/80 text-sky-400 accent-sky-500"
              />
              Beam seasonal intel to my inbox.
            </label>
          </div>

          <NeonButton type="submit" disabled={processing} className="mt-4">
            {processing ? "Calibrating loadout..." : "Deploy Account"}
          </NeonButton>
        </form>

        <div className="mt-10 rounded-2xl border border-sky-500/20 bg-slate-950/70 p-6 text-sm text-sky-100/65">
          <p>
            Already commissioned?{" "}
            <Link
              href="/auth/login"
              className="text-sky-300 underline decoration-sky-500/50 decoration-dashed underline-offset-4"
            >
              Re-enter the grid
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
