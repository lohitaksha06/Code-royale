"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PracticeScaffold } from "../practice/practice-scaffold";

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

type ModeCategory = "ranked" | "non-ranked";
type TrophyImpact = "High Trophy Impact" | "Low Trophy Impact" | "No Trophy Impact";
type MatchmakingState = "idle" | "configuring" | "searching" | "match_found" | "error";

type ModeDefinition = {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  details?: string[];
  enabled: boolean;
  accent: string;
  impact: TrophyImpact;
  category: ModeCategory;
  limited?: boolean;
};

type ModeConfigPreset = {
  timers: string[];
  languages: string[];
  playerOptions: string[];
  note?: string;
};

type ModeConfigSelection = {
  timer: string;
  language: string;
  players: string;
};

const RANKED_MODES: ModeDefinition[] = [
  {
    id: "ranked",
    title: "Ranked 1v1 Battle",
    subtitle: "Competitive matchmaking",
    details: ["Head-to-head ladder play", "Balanced by trophy rating", "Win streak bonuses"],
    badge: "Earn / lose trophies",
    enabled: true,
    accent: "from-emerald-500/80 to-sky-500/40",
    impact: "High Trophy Impact",
    category: "ranked",
  },
  {
    id: "unranked",
    title: "Unranked 1v1",
    subtitle: "Just for fun sparring",
    details: ["No ladder pressure", "Great for warm ups", "Match with similar skill"],
    badge: "No trophy change",
    enabled: true,
    accent: "from-sky-400/60 to-indigo-500/40",
    impact: "No Trophy Impact",
    category: "ranked",
  },
  {
    id: "friend",
    title: "Play with Friend",
    subtitle: "Queue up together",
    details: ["Private lobby code", "Spectate others", "Share practice strats"],
    badge: "Invite a friend",
    enabled: true,
    accent: "from-violet-500/70 to-purple-600/40",
    impact: "No Trophy Impact",
    category: "ranked",
  },
  {
    id: "battle-royale",
    title: "4 Player Battle",
    subtitle: "Free-for-all chaos",
    details: ["Race to solve", "Sabotage power-ups", "Seasonal events"],
    badge: "Coming soon",
    enabled: false,
    accent: "",
    impact: "High Trophy Impact",
    category: "ranked",
  },
  {
    id: "bots",
    title: "Battle vs Bots",
    subtitle: "Sharpen your tactics",
    details: ["Adaptive AI rivals", "Practice combos", "Perfect for learning"],
    badge: "Coming soon",
    enabled: false,
    accent: "",
    impact: "Low Trophy Impact",
    category: "ranked",
  },
];

const NON_RANKED_MODES: ModeDefinition[] = [
  {
    id: "rapid-fire",
    title: "Rapid Fire",
    subtitle: "Solve fast. Chain streaks. Climb casually.",
    details: [
      "Multiple micro rounds with tiny prompts",
      "Minimal trophy swing, streak multipliers",
      "Leaderboards reward consistency and speed",
    ],
    badge: "Low Trophy Impact",
    enabled: true,
    accent: "from-cyan-500/70 to-sky-500/30",
    impact: "Low Trophy Impact",
    category: "non-ranked",
  },
  {
    id: "ffa",
    title: "Free-For-All",
    subtitle: "Outcode everyone. No teams. No mercy.",
    details: [
      "3–6 players battle on the same prompt",
      "Live leaderboard updates with every test",
      "Light trophy rewards, heavy bragging rights",
    ],
    badge: "Low Trophy Impact",
    enabled: true,
    accent: "from-rose-500/70 to-orange-500/40",
    impact: "Low Trophy Impact",
    category: "non-ranked",
  },
  {
    id: "duos",
    title: "2v2 Team Battle",
    subtitle: "Win together or fall together.",
    details: [
      "Shared score, independent submits",
      "Coordinate hints and division of labor",
      "Momentum bonuses for synced solves",
    ],
    badge: "Low Trophy Impact",
    enabled: true,
    accent: "from-indigo-500/70 to-blue-500/35",
    impact: "Low Trophy Impact",
    category: "non-ranked",
  },
  {
    id: "events",
    title: "Experimental / Event Mode",
    subtitle: "Rules change. Skill adapts.",
    details: [
      "Rotating rule sets: short timers, language locks, random difficulty",
      "Limited-time rewards and cosmetics",
      "Perfect playground for creative problem solving",
    ],
    badge: "Limited-time",
    enabled: true,
    accent: "from-fuchsia-500/70 to-purple-500/40",
    impact: "No Trophy Impact",
    category: "non-ranked",
    limited: true,
  },
];

const DEFAULT_CONFIG_PRESET: ModeConfigPreset = {
  timers: ["5 minutes", "8 minutes", "12 minutes"],
  languages: ["Auto assign", "JavaScript", "Python", "C++", "Java"],
  playerOptions: ["Auto match", "Invite friends"],
};

const MODE_CONFIG_PRESETS: Record<string, ModeConfigPreset> = {
  "rapid-fire": {
    timers: ["3 minutes", "5 minutes", "7 minutes"],
    languages: ["Auto assign", "JavaScript", "Python", "Rust"],
    playerOptions: ["Solo queue", "Party queue"],
    note: "Shortest problems, accelerated scoring windows.",
  },
  ffa: {
    timers: ["6 minutes", "8 minutes", "10 minutes"],
    languages: ["Any language", "JavaScript", "Python", "C++"],
    playerOptions: ["3 players", "4 players", "5 players", "6 players"],
    note: "Leaderboard rank updates in real time.",
  },
  duos: {
    timers: ["8 minutes", "10 minutes", "12 minutes"],
    languages: ["Any language", "JavaScript", "Python", "Java"],
    playerOptions: ["Auto team match", "Queue with partner"],
    note: "Team bonus for synchronized solves.",
  },
  events: {
    timers: ["Randomized", "4 minutes", "6 minutes"],
    languages: ["Mode decides", "JavaScript", "Python"],
    playerOptions: ["Event lobby", "Invite-only"],
    note: "Rule set rotates weekly. Expect surprises.",
  },
};

export default function GameModesPage() {
  const router = useRouter();
  const [state, setState] = useState<MatchmakingState>("idle");
  const [selectedMode, setSelectedMode] = useState<ModeDefinition | null>(null);
  const [configSelection, setConfigSelection] = useState<ModeConfigSelection | null>(null);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [timerRef, setTimerRef] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (state !== "searching") {
      return undefined;
    }

    const handle = setTimeout(() => {
      setMatchId("demo-match");
      setState("match_found");
    }, 3200);

    setTimerRef(handle);

    return () => {
      clearTimeout(handle);
    };
  }, [state]);

  const resetQueue = () => {
    if (timerRef) {
      clearTimeout(timerRef);
      setTimerRef(null);
    }
    setMatchId(null);
    setConfigSelection(null);
    setSelectedMode(null);
    setState("idle");
  };

  const handleRankedClick = (mode: ModeDefinition) => {
    setSelectedMode(mode);
    setConfigSelection(null);
    setMatchId(null);
    setState("searching");
  };

  const handleNonRankedClick = (mode: ModeDefinition) => {
    setSelectedMode(mode);
    setConfigSelection(null);
    setState("configuring");
  };

  const handleEnterMatch = () => {
    if (matchId) {
      router.push(`/match/${matchId}`);
    }
  };

  const rankedCards = RANKED_MODES.map((mode) => ({
    mode,
    onClick:
      mode.enabled && (mode.id === "ranked" || mode.id === "unranked")
        ? () => handleRankedClick(mode)
        : undefined,
  }));

  const nonRankedCards = NON_RANKED_MODES.map((mode) => ({
    mode,
    onClick: mode.enabled ? () => handleNonRankedClick(mode) : undefined,
  }));

  const activeMode = selectedMode ?? RANKED_MODES[0];

  return (
    <PracticeScaffold>
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-6 pt-8 sm:px-10 lg:px-16">
        <header className="flex flex-col justify-between gap-6 rounded-3xl border border-sky-500/20 bg-gradient-to-br from-[#061532] via-[#051029] to-[#020710] p-8 shadow-[0_0_60px_rgba(14,165,233,0.28)] sm:flex-row sm:items-center sm:gap-8">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-sky-400/80">Command Center</p>
            <h1 className="text-4xl font-semibold leading-tight text-sky-50 sm:text-5xl">
              Choose your battle mode
            </h1>
            <p className="max-w-xl text-sm text-sky-100/70">
              Squad up, duel a rival, or warm up with friends. Ranked battles award trophies, while event modes let you experiment without wrecking your ladder standing.
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
          <div className="flex flex-col gap-16">
            <section className="space-y-6">
              <header className="space-y-2">
                <h2 className="text-xl font-semibold uppercase tracking-[0.35em] text-sky-300/80">
                  Ranked & Core Modes
                </h2>
                <p className="text-sm text-sky-100/70">
                  Climb the ladder, invite friends, or queue up for legacy formats. These affect your season standing.
                </p>
              </header>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {rankedCards.map(({ mode, onClick }) => (
                  <ModeCard key={mode.id} mode={mode} onClick={onClick} />
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <header className="space-y-3">
                <h2 className="text-xl font-semibold uppercase tracking-[0.35em] text-fuchsia-300/80">
                  Non-Ranked Match Types
                </h2>
                <p className="max-w-2xl text-sm text-sky-100/75">
                  Skill-focused formats with reduced or zero trophy impact. Perfect for warming up, experimenting, or casual competition.
                </p>
              </header>
              <div className="grid gap-6 md:grid-cols-2">
                {nonRankedCards.map(({ mode, onClick }) => (
                  <ModeCard key={mode.id} mode={mode} onClick={onClick} playful />
                ))}
              </div>
            </section>
          </div>
        )}

        {state === "configuring" && selectedMode && (
          <ModeConfigPanel
            mode={selectedMode}
            preset={MODE_CONFIG_PRESETS[selectedMode.id] ?? DEFAULT_CONFIG_PRESET}
            onBack={resetQueue}
            onStart={(selection) => {
              setConfigSelection(selection);
              setMatchId(null);
              setState("searching");
            }}
          />
        )}

        {state === "searching" && (
          <MatchmakingPanel
            mode={activeMode}
            config={configSelection}
            onCancel={resetQueue}
          />
        )}

        {state === "match_found" && (
          <MatchFoundPanel
            mode={activeMode}
            config={configSelection}
            onEnter={handleEnterMatch}
            onStay={resetQueue}
          />
        )}
      </div>
    </PracticeScaffold>
  );
}

type ModeCardProps = {
  mode: ModeDefinition;
  onClick?: () => void;
  playful?: boolean;
};

function ModeCard({ mode, onClick, playful = false }: ModeCardProps) {
  const { title, subtitle, badge, details, enabled, accent, impact } = mode;
  const baseClasses = "group relative flex h-full flex-col justify-between gap-6 rounded-3xl border px-6 py-8 transition";
  const enabledClasses = enabled
    ? `border-sky-500/25 bg-gradient-to-br ${accent} hover:-translate-y-1 hover:shadow-[0_0_45px_rgba(56,189,248,0.25)] hover:border-sky-300/60`
    : "border-slate-700/60 bg-slate-900/60 text-slate-400";

  const impactStyles = playful
    ? "border-fuchsia-300/60 bg-fuchsia-400/10 text-fuchsia-100"
    : "border-emerald-300/60 bg-emerald-400/10 text-emerald-200";

  const playNowStyles = playful
    ? "border-fuchsia-400/60 bg-fuchsia-500/15 text-fuchsia-100 group-hover:border-fuchsia-200 group-hover:bg-fuchsia-500/30 group-hover:text-fuchsia-50"
    : "border-sky-400/60 bg-sky-500/15 text-sky-100 group-hover:border-sky-200 group-hover:bg-sky-500/30 group-hover:text-sky-50";

  const content = (
    <div className="flex h-full flex-col gap-6">
      <div className="space-y-3">
        <h3 className="text-2xl font-semibold text-sky-50">{title}</h3>
        <p className="text-sm text-sky-100/70">{subtitle}</p>
      </div>
      {details && (
        <ul className="space-y-2 text-xs text-sky-100/60">
          {details.slice(0, 3).map((detail) => (
            <li key={detail} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-300/70" />
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-auto flex flex-wrap items-center gap-3">
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-1 text-[11px] uppercase tracking-[0.35em] ${impactStyles}`}
        >
          {impact}
        </span>
        {badge && (
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-sky-200/80">
            {badge}
          </span>
        )}
      </div>
      {enabled && (
        <span
          className={`mt-4 inline-flex w-max items-center gap-2 rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] shadow-[0_0_24px_rgba(56,189,248,0.3)] transition ${playNowStyles}`}
        >
          Play Now
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="m8 5 8 7-8 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
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
    return <div className={`${baseClasses} ${enabledClasses}`}>{content}</div>;
  }

  if (!onClick) {
    return <div className={`${baseClasses} ${enabledClasses}`}>{content}</div>;
  }

  return (
    <button type="button" onClick={onClick} className={`${baseClasses} ${enabledClasses}`}>
      {content}
    </button>
  );
}

type ModeConfigPanelProps = {
  mode: ModeDefinition;
  preset: ModeConfigPreset;
  onBack: () => void;
  onStart: (selection: ModeConfigSelection) => void;
};

function ModeConfigPanel({ mode, preset, onBack, onStart }: ModeConfigPanelProps) {
  const [timer, setTimer] = useState<string>(preset.timers[0] ?? DEFAULT_CONFIG_PRESET.timers[0]);
  const [language, setLanguage] = useState<string>(preset.languages[0] ?? DEFAULT_CONFIG_PRESET.languages[0]);
  const [players, setPlayers] = useState<string>(preset.playerOptions[0] ?? DEFAULT_CONFIG_PRESET.playerOptions[0]);

  const gradient = `bg-gradient-to-br ${mode.accent || "from-slate-900/80 to-slate-900/40"}`;

  return (
    <section className={`flex flex-col gap-10 rounded-3xl border border-sky-500/25 ${gradient} p-10 shadow-[0_0_55px_rgba(99,102,241,0.28)] lg:flex-row`}>
      <div className="flex flex-1 flex-col gap-6">
        <button
          type="button"
          onClick={onBack}
          className="w-max rounded-full border border-sky-500/40 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-sky-100/80 transition hover:border-sky-200 hover:bg-sky-500/20"
        >
          Back to modes
        </button>
        <div className="space-y-4">
          <h2 className="text-4xl font-semibold text-sky-50">{mode.title}</h2>
          <p className="text-sm text-sky-100/75">{mode.subtitle}</p>
          {mode.details && (
            <ul className="space-y-2 text-sm text-sky-100/70">
              {mode.details.map((detail) => (
                <li key={detail} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-sky-300" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-fuchsia-300/60 bg-fuchsia-400/20 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-fuchsia-50">
            {mode.impact}
          </span>
          {mode.limited && (
            <span className="rounded-full border border-amber-300/50 bg-amber-400/10 px-3 py-1 text-[10px] uppercase tracking-[0.4em] text-amber-100">
              Limited-time
            </span>
          )}
          {preset.note && <span className="text-xs text-sky-100/65">{preset.note}</span>}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-6 rounded-2xl border border-sky-500/25 bg-[#050b1c]/70 p-8">
        <h3 className="text-lg font-semibold text-sky-50">Match setup</h3>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="flex flex-col gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-sky-400/70">
            Timer preset
            <select
              value={timer}
              onChange={(event) => setTimer(event.target.value)}
              className="rounded-2xl border border-sky-500/30 bg-[#040a16] px-4 py-3 text-sm font-medium text-sky-100 focus:border-sky-300 focus:outline-none"
            >
              {(preset.timers.length ? preset.timers : DEFAULT_CONFIG_PRESET.timers).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-sky-400/70">
            Preferred language
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="rounded-2xl border border-sky-500/30 bg-[#040a16] px-4 py-3 text-sm font-medium text-sky-100 focus:border-sky-300 focus:outline-none"
            >
              {(preset.languages.length ? preset.languages : DEFAULT_CONFIG_PRESET.languages).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-sky-400/70">
            Players / queue
            <select
              value={players}
              onChange={(event) => setPlayers(event.target.value)}
              className="rounded-2xl border border-sky-500/30 bg-[#040a16] px-4 py-3 text-sm font-medium text-sky-100 focus:border-sky-300 focus:outline-none"
            >
              {(preset.playerOptions.length ? preset.playerOptions : DEFAULT_CONFIG_PRESET.playerOptions).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button
          type="button"
          onClick={() => onStart({ timer, language, players })}
          className="mt-4 w-full rounded-full border border-fuchsia-400/70 bg-fuchsia-500/20 px-10 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-fuchsia-50 shadow-[0_0_40px_rgba(217,70,239,0.35)] transition hover:border-fuchsia-200 hover:bg-fuchsia-500/35"
        >
          Start matchmaking
        </button>
      </div>
    </section>
  );
}

type MatchmakingPanelProps = {
  mode: ModeDefinition;
  config: ModeConfigSelection | null;
  onCancel: () => void;
};

function MatchmakingPanel({ mode, config, onCancel }: MatchmakingPanelProps) {
  const labelColor = mode.category === "non-ranked" ? "text-fuchsia-300/80" : "text-sky-300/80";
  const gradient =
    mode.category === "non-ranked"
      ? "from-fuchsia-500/20 via-[#0a0d2c] to-[#030611]"
      : "from-sky-500/20 via-[#051028] to-[#020813]";

  return (
    <section className={`relative flex flex-1 flex-col items-center justify-center gap-10 rounded-3xl border border-sky-500/25 bg-gradient-to-br ${gradient} p-12 text-center shadow-[0_0_55px_rgba(56,189,248,0.28)]`}>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.25),_transparent_60%)]" />
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full bg-sky-400/20" />
          <div className="absolute inset-3 animate-pulse rounded-full bg-sky-400/10" />
          <div className="relative flex h-full w-full items-center justify-center rounded-full border border-sky-400/70 bg-sky-500/20 text-sky-100 shadow-[0_0_30px_rgba(56,189,248,0.35)]">
            {trophyIcon}
          </div>
        </div>
        <div className="space-y-2">
          <p className={`text-sm uppercase tracking-[0.45em] ${labelColor}`}>{mode.title}</p>
          <h2 className="text-3xl font-semibold text-sky-50">Finding opponent…</h2>
          <p className="text-sm text-sky-100/70">Estimated wait time · 00:30</p>
          <p className="text-xs uppercase tracking-[0.35em] text-sky-200/70">{mode.impact}</p>
        </div>
        {config && (
          <div className="mt-2 flex flex-wrap justify-center gap-4 text-xs uppercase tracking-[0.25em] text-sky-200/80">
            <span>Timer · {config.timer}</span>
            <span>Queue · {config.players}</span>
            <span>Language · {config.language}</span>
          </div>
        )}
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
  mode: ModeDefinition;
  config: ModeConfigSelection | null;
  onEnter: () => void;
  onStay: () => void;
};

function MatchFoundPanel({ mode, config, onEnter, onStay }: MatchFoundPanelProps) {
  const accentBorder = mode.category === "non-ranked" ? "border-fuchsia-400/40" : "border-emerald-400/40";
  const accentGlow = mode.category === "non-ranked" ? "shadow-[0_0_60px_rgba(217,70,239,0.4)]" : "shadow-[0_0_60px_rgba(16,185,129,0.35)]";
  const gradientClass =
    mode.category === "non-ranked"
      ? "bg-gradient-to-br from-fuchsia-500/12 via-[#2a0a2f] to-[#090510]"
      : "bg-gradient-to-br from-emerald-500/15 via-[#04131b] to-[#01080c]";
  const radialOverlay =
    mode.category === "non-ranked"
      ? "bg-[radial-gradient(circle_at_top,_rgba(217,70,239,0.38),_transparent_55%)]"
      : "bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.35),_transparent_55%)]";
  const headlineAccent = mode.category === "non-ranked" ? "text-fuchsia-300/80" : "text-emerald-300/80";
  const statAccent = mode.category === "non-ranked" ? "text-fuchsia-200/70" : "text-emerald-200/70";
  const titleColor = mode.category === "non-ranked" ? "text-fuchsia-100" : "text-emerald-100";
  const bodyColor = mode.category === "non-ranked" ? "text-fuchsia-100/70" : "text-emerald-100/70";
  const primaryButton =
    mode.category === "non-ranked"
      ? "rounded-full border border-fuchsia-300/80 bg-fuchsia-400/20 px-10 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-fuchsia-50 transition hover:border-fuchsia-200 hover:bg-fuchsia-400/35"
      : "rounded-full border border-emerald-300/80 bg-emerald-400/20 px-10 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-emerald-50 transition hover:border-emerald-200 hover:bg-emerald-400/35";
  const secondaryButton =
    mode.category === "non-ranked"
      ? "rounded-full border border-fuchsia-300/40 px-10 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-fuchsia-100 transition hover:border-fuchsia-200/60 hover:bg-fuchsia-300/10"
      : "rounded-full border border-emerald-300/40 px-10 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-emerald-100 transition hover:border-emerald-200/60 hover:bg-emerald-300/10";

  return (
    <section className={`relative flex flex-1 flex-col items-center justify-center gap-10 overflow-hidden rounded-3xl ${accentBorder} ${gradientClass} p-12 text-center ${accentGlow}`}>
      <div className={`absolute inset-0 -z-10 ${radialOverlay}`} />
      <div className="space-y-3">
        <p className={`text-xs font-semibold uppercase tracking-[0.45em] ${headlineAccent}`}>Opponent found</p>
        <h2 className={`text-4xl font-semibold ${titleColor}`}>{mode.title}</h2>
        <p className={`max-w-lg text-sm ${bodyColor}`}>
          This is a demo preview. Once realtime matchmaking is connected, you’ll dive straight into the Code Royale arena from here.
        </p>
        <p className={`text-xs uppercase tracking-[0.35em] ${statAccent}`}>{mode.impact}</p>
        {config && (
          <div className={`flex flex-wrap justify-center gap-4 text-xs uppercase tracking-[0.25em] ${statAccent}`}>
            <span>Timer · {config.timer}</span>
            <span>Queue · {config.players}</span>
            <span>Language · {config.language}</span>
          </div>
        )}
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        <button type="button" onClick={onEnter} className={primaryButton}>
          Enter match (demo)
        </button>
        <button type="button" onClick={onStay} className={secondaryButton}>
          Back to modes
        </button>
      </div>
    </section>
  );
}
