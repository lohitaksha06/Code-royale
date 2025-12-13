"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const trophyIcon = (
  <svg
    aria-hidden
    viewBox="0 0 24 24"
    className="h-6 w-6 text-amber-300 drop-shadow-[0_0_18px_rgba(251,191,36,0.55)]"
  >
    <path
      fill="currentColor"
      d="M19 4h-1V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v1H5a1 1 0 0 0-1 1v2a4 4 0 0 0 3 3.87A6 6 0 0 0 11 14.9V17H8a1 1 0 0 0 0 2h8a1 1 0 1 0 0-2h-3v-2.1a6 6 0 0 0 4-3.99 4 4 0 0 0 3-3.87V5a1 1 0 0 0-1-1Zm-1 3a2 2 0 0 1-2 2 1 1 0 0 0-.94.66A4 4 0 0 1 12 12a4 4 0 0 1-3.06-2.34A1 1 0 0 0 8 9a2 2 0 0 1-2-2V6h2a1 1 0 0 0 1-1V4h6v1a1 1 0 0 0 1 1h2Z"
    />
  </svg>
);

type MatchmakingState = "idle" | "searching" | "match_found" | "error";

type ModeCard = {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  enabled: boolean;
  accent: string;
  onClick?: () => void;
};

const MODE_CARDS: Omit<ModeCard, "onClick">[] = [
  {
    id: "ranked",
    title: "Ranked 1v1 Battle",
    subtitle: "Competitive matchmaking",
    badge: "Earn / lose trophies",
    enabled: true,
    accent: "from-emerald-500/80 to-sky-500/40",
  },
  {
    id: "unranked",
    title: "Unranked 1v1",
    subtitle: "Just for fun",
    badge: "No trophy change",
    enabled: true,
    accent: "from-sky-400/60 to-indigo-500/40",
  },
  {
    id: "friend",
    title: "Play with Friend",
    subtitle: "Queue together",
    badge: "Invite a friend",
    enabled: true,
    accent: "from-violet-500/70 to-purple-600/40",
  },
  {
    id: "battle-royale",
    title: "4 Player Battle",
    subtitle: "Free-for-all chaos",
    badge: "Coming soon",
    enabled: false,
    accent: "",
  },
  {
    id: "bots",
    title: "Battle vs Bots",
    subtitle: "Sharpen your tactics",
    badge: "Coming soon",
    enabled: false,
    accent: "",
  },
];

export default function GameModesPage() {
  const router = useRouter();
  const [state, setState] = useState<MatchmakingState>("idle");
  const [matchId, setMatchId] = useState<string | null>(null);
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (state !== "searching") {
      return undefined;
    }

    const handle = setTimeout(() => {
      setMatchId("demo-match");
      setState("match_found");
    }, 3200);

    setTimer(handle);

    return () => {
      clearTimeout(handle);
    };
  }, [state]);

  const handleCancel = () => {
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
    setMatchId(null);
    setState("idle");
  };

  const handleEnterMatch = () => {
    if (matchId) {
      router.push(`/match/${matchId}`);
    }
  };

  const cards: ModeCard[] = MODE_CARDS.map((card) => ({
    ...card,
    onClick:
      card.id === "ranked" && card.enabled
        ? () => {
            setMatchId(null);
            setState("searching");
          }
        : undefined,
  }));

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#030915] pb-20 text-sky-100">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-6 pt-16 sm:px-10 lg:px-16">
        <header className="flex flex-col justify-between gap-6 rounded-3xl border border-sky-500/20 bg-gradient-to-br from-[#061532] via-[#051029] to-[#020710] p-8 shadow-[0_0_60px_rgba(14,165,233,0.28)] sm:flex-row sm:items-center sm:gap-8">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-sky-400/80">Command Center</p>
            <h1 className="text-4xl font-semibold leading-tight text-sky-50 sm:text-5xl">
              Choose your battle mode
            </h1>
            <p className="max-w-xl text-sm text-sky-100/70">
              Squad up, duel a rival, or warm up with friends. Ranked battles award trophies that move you up the Code Royale leagues.
            </p>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-amber-400/40 bg-amber-400/10 px-6 py-4 text-amber-200 shadow-[0_0_30px_rgba(251,191,36,0.3)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-400/20">
              {trophyIcon}
            </div>
            <div>
              <div className="flex items-baseline gap-2 text-3xl font-semibold tracking-tight text-amber-100">
                <span>1,240</span>
                <span className="text-sm font-medium uppercase tracking-[0.35em] text-amber-200/70">Trophies</span>
              </div>
              <p className="text-xs uppercase tracking-[0.35em] text-amber-200/80">Rank · Gold League</p>
            </div>
          </div>
        </header>

        {state === "idle" && (
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => (
              <ModeCard key={card.id} {...card} />
            ))}
          </section>
        )}

        {state === "searching" && (
          <MatchmakingPanel onCancel={handleCancel} />
        )}

        {state === "match_found" && (
          <MatchFoundPanel onEnter={handleEnterMatch} onStay={handleCancel} />
        )}
      </div>
    </div>
  );
}

type ModeCardProps = ModeCard;

function ModeCard({ title, subtitle, badge, enabled, accent, onClick }: ModeCardProps) {
  const baseClasses = "relative flex h-full flex-col justify-between gap-8 rounded-3xl border px-6 py-8 transition";
  const enabledClasses = enabled
    ? "border-sky-500/25 bg-gradient-to-br " + accent + " hover:-translate-y-1 hover:shadow-[0_0_45px_rgba(56,189,248,0.25)] hover:border-sky-300/60"
    : "border-slate-700/60 bg-slate-900/60 text-slate-400";

  const content = (
    <div className="flex h-full flex-col gap-6">
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-sky-50">{title}</h2>
        <p className="text-sm text-sky-100/70">{subtitle}</p>
      </div>
      {badge && (
        <span
          className={`inline-flex w-max items-center gap-2 rounded-full border px-4 py-1 text-xs uppercase tracking-[0.35em] ${
            enabled ? "border-emerald-300/60 bg-emerald-400/10 text-emerald-200" : "border-slate-500/60 bg-slate-700/30 text-slate-300"
          }`}
        >
          {badge}
        </span>
      )}
      {!enabled && (
        <div className="absolute right-6 top-6 flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-slate-300">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
            <path d="M7 10V7a5 5 0 0 1 10 0v3h1.5a1.5 1.5 0 0 1 1.5 1.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-7.5A1.5 1.5 0 0 1 5.5 10H7Zm2-3a3 3 0 1 1 6 0v3H9Z" />
          </svg>
          Locked
        </div>
      )}
    </div>
  );

  if (!enabled) {
    return (
      <div className={`${baseClasses} ${enabledClasses}`}>{content}</div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseClasses} ${enabledClasses}`}
    >
      {content}
    </button>
  );
}

type MatchmakingPanelProps = {
  onCancel: () => void;
};

function MatchmakingPanel({ onCancel }: MatchmakingPanelProps) {
  return (
    <section className="relative flex flex-1 flex-col items-center justify-center gap-10 rounded-3xl border border-sky-500/25 bg-gradient-to-br from-sky-500/15 via-[#051028] to-[#020813] p-12 text-center shadow-[0_0_55px_rgba(56,189,248,0.28)]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.35),_transparent_55%)]" />
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full bg-sky-400/20" />
          <div className="absolute inset-3 animate-pulse rounded-full bg-sky-400/10" />
          <div className="relative flex h-full w-full items-center justify-center rounded-full border border-sky-400/70 bg-sky-500/20 text-sky-100 shadow-[0_0_30px_rgba(56,189,248,0.35)]">
            {trophyIcon}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.45em] text-sky-300/80">Ranked 1v1</p>
          <h2 className="text-3xl font-semibold text-sky-50">Finding opponent…</h2>
          <p className="text-sm text-sky-100/70">Estimated wait time · 00:30</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onCancel}
        className="rounded-full border border-sky-400/60 px-10 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-sky-100 transition hover:border-sky-200 hover:bg-sky-500/40"
      >
        Cancel search
      </button>
    </section>
  );
}

type MatchFoundPanelProps = {
  onEnter: () => void;
  onStay: () => void;
};

function MatchFoundPanel({ onEnter, onStay }: MatchFoundPanelProps) {
  return (
    <section className="relative flex flex-1 flex-col items-center justify-center gap-10 overflow-hidden rounded-3xl border border-emerald-400/40 bg-gradient-to-br from-emerald-500/15 via-[#04131b] to-[#01080c] p-12 text-center shadow-[0_0_60px_rgba(16,185,129,0.35)]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.45),_transparent_55%)]" />
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.45em] text-emerald-300/80">
          Opponent found
        </p>
        <h2 className="text-4xl font-semibold text-emerald-100">Ready to deploy</h2>
        <p className="max-w-lg text-sm text-emerald-100/70">
          This is a demo preview. When realtime matchmaking goes live you’ll be auto-transported into the Code Royale arena here.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        <button
          type="button"
          onClick={onEnter}
          className="rounded-full border border-emerald-300/80 bg-emerald-400/20 px-10 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-emerald-50 shadow-[0_0_35px_rgba(16,185,129,0.4)] transition hover:border-emerald-200 hover:bg-emerald-400/35"
        >
          Enter match (demo)
        </button>
        <button
          type="button"
          onClick={onStay}
          className="rounded-full border border-emerald-300/40 px-10 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-emerald-100 transition hover:border-emerald-200/60 hover:bg-emerald-300/10"
        >
          Back to modes
        </button>
      </div>
    </section>
  );
}
