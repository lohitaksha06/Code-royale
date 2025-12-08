'use client';

import { ReactNode, useEffect, useMemo, useState } from "react";
import { HomeNav } from "../home/home-nav";

const sidebarLinks = [
  {
    id: "daily-quest",
    title: "Daily Quest",
    subtitle: "Tackle today\u2019s featured challenge and earn bonus XP.",
  },
  {
    id: "leaderboard",
    title: "Leaderboard",
    subtitle: "See who\u2019s dominating the arena this week.",
  },
  {
    id: "streak",
    title: "Your Streak",
    subtitle: "Keep the momentum \u2013 don\u2019t break your practice chain.",
  },
  {
    id: "workshop",
    title: "Tactics Workshop",
    subtitle: "Replay curated patterns to sharpen fundamentals.",
  },
];

type PracticeScaffoldProps = {
  children: ReactNode;
};

type PracticeSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function PracticeScaffold({ children }: PracticeScaffoldProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const syncSidebar = () => setIsSidebarOpen(mediaQuery.matches);

    syncSidebar();

    const addListener = mediaQuery.addEventListener?.bind(mediaQuery);
    const removeListener = mediaQuery.removeEventListener?.bind(mediaQuery);

    if (addListener) {
      addListener("change", syncSidebar);
    } else {
      mediaQuery.addListener?.(syncSidebar);
    }

    return () => {
      if (removeListener) {
        removeListener("change", syncSidebar);
      } else {
        mediaQuery.removeListener?.(syncSidebar);
      }
    };
  }, []);

  const paddingClass = useMemo(() => (isSidebarOpen ? "lg:pl-72" : "lg:pl-28"), [isSidebarOpen]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#040a16] via-[#041225] to-[#050a17] text-sky-50">
      <HomeNav onMenuToggle={() => setIsSidebarOpen((current) => !current)} />
      <PracticeSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <main
        className={`relative z-40 flex min-h-screen w-full flex-col transition-[padding-left] duration-300 ease-out ${paddingClass}`}
      >
        <div className="flex w-full flex-1 flex-col gap-8 px-5 pb-16 pt-32 sm:px-8 lg:px-16">
          {children}
        </div>
      </main>
    </div>
  );
}

function PracticeSidebar({ isOpen, onClose }: PracticeSidebarProps) {
  return (
    <aside
      className={`fixed top-24 z-40 flex h-[calc(100vh-6rem)] w-72 flex-col gap-6 border-r border-sky-500/10 bg-[#060b15]/95 p-6 shadow-[0_0_45px_rgba(15,118,211,0.35)] backdrop-blur-xl transition-transform duration-300 ease-out lg:top-28 lg:h-[calc(100vh-7rem)] ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:-translate-x-56"
      }`}
    >
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-sky-400/70">
        <span>Practice Hub</span>
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="rounded-full border border-sky-500/20 px-2 py-1 text-[10px] text-sky-100/80 transition hover:border-sky-400/50 lg:hidden"
        >
          Close
        </button>
      </div>
      <nav className="flex flex-1 flex-col gap-4 overflow-y-auto">
        {sidebarLinks.map((link) => (
          <button
            key={link.id}
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-sky-500/15 bg-slate-950/60 p-4 text-left transition hover:border-sky-400/40 hover:bg-slate-900/70"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-200">{link.title}</p>
            <p className="mt-2 text-xs text-sky-100/70">{link.subtitle}</p>
          </button>
        ))}
      </nav>
      <div className="rounded-2xl border border-sky-500/15 bg-slate-950/70 p-4 text-xs text-sky-200/80">
        <p className="font-semibold uppercase tracking-[0.3em] text-sky-300/80">Quick Tip</p>
        <p className="mt-3 leading-relaxed text-sky-100/70">
          Warming up daily keeps pattern recognition sharp. Start with a short timer and increase the challenge as you gain confidence.
        </p>
      </div>
    </aside>
  );
}
