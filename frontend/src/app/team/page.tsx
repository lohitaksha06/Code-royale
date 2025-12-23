"use client";

import { PracticeScaffold } from "../practice/practice-scaffold";

export default function TeamPage() {
  return (
    <PracticeScaffold defaultSidebarOpen>
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 pt-8 sm:px-10 lg:px-16">
        <header className="rounded-3xl border border-sky-500/20 bg-gradient-to-br from-[#071629] via-[#041021] to-[#020610] p-8 shadow-[0_0_60px_rgba(56,189,248,0.2)]">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-sky-400/80">Clubs & Teams</p>
          <h1 className="mt-4 text-4xl font-semibold text-sky-50 sm:text-5xl">Join club/team</h1>
          <p className="mt-3 max-w-2xl text-sm text-sky-100/70">
            Team features are not wired yet. This page is the placeholder entry point for joining or creating a team.
          </p>
        </header>

        <section className="rounded-3xl border border-sky-500/20 bg-[#040b18]/80 p-8 text-sm text-sky-100/70 shadow-[0_0_45px_rgba(56,189,248,0.14)]">
          Add team browsing / invitations here once the Supabase tables are ready.
        </section>
      </div>
    </PracticeScaffold>
  );
}
