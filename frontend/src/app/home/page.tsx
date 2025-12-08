import { GlowCard } from "../../components/glow-card";
import { NeonLink } from "../../components/neon-button";
import { HomeNav } from "./home-nav";
import Image from "next/image";

const battleModes = [
  {
    title: "Battle Against Bots",
    description:
      "Solo queue against adaptive AI rivals tuned for practice or calibration before you challenge humans.",
    details: [
      "Bots scale difficulty from casual to ranked intensity.",
      "Analyze replay packets to refine your strategy.",
    ],
  },
  {
    title: "1v1 Duels",
    description:
      "Head-to-head clashes where speed and accuracy crown the champion. Choose your preferred timer before entering the arena.",
    details: [
      "Timer presets: 5 min, 10 min, 15 min.",
      "Rapid Fire mode tallies correct solves across multiple problems.",
    ],
  },
  {
    title: "4-Player Brawls",
    description:
      "1v1v1v1 chaos built for squads or rivals. Coordinate, sabotage, or sprint toward glory.",
    details: [
      "Supports custom playlists of problems.",
      "Spectator stream hooks coming soon.",
    ],
  },
];

const matchTypes = [
  {
    name: "Rapid Fire",
    summary:
      "Solve as many prompts as possible before the timer expires. Leaderboards rank streaks and accuracy.",
  },
  {
    name: "Hardcore Sprint",
    summary:
      "Each player receives one hard challenge. First to pass all test cases claims the victory badge.",
  },
  {
    name: "Timed Ladder",
    summary:
      "Queue for structured sessions where timers decrease each round, forcing faster iterations.",
  },
];

const timers = ["5 minutes", "10 minutes", "15 minutes"];

const featurePanels = [
  {
    id: "profile",
    title: "Pilot Profile",
    description:
      "Monitor your rating, streaks, and unlockable cosmetics from one command center. Export share cards straight to social feeds.",
    accent: "cyan" as const,
    linkLabel: "View Profile",
    href: "/auth/login",
  },
  {
    id: "leaderboards",
    title: "Leaderboards",
    description:
      "Browse divisions, scout rivals, and chase seasonal trophies with transparent scoring updates.",
    accent: "blue" as const,
    linkLabel: "View Rankings",
    href: "/auth/login",
  },
  {
    id: "practice",
    title: "Practice Arena",
    description:
      "Warm up with curated drills that adapt to your weak spots and track daily improvement streaks.",
    accent: "purple" as const,
    linkLabel: "Start Warmup",
    href: "/auth/signup",
  },
  {
    id: "notifications",
    title: "Event Pulse",
    description:
      "Get alerts for tournament invites, balance updates, and featured matches you should not miss.",
    accent: "cyan" as const,
    linkLabel: "Update Preferences",
    href: "/auth/login",
  },
];

export default function HomePage() {
  return (
    <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-16 px-6 pb-16 pt-36">
      <HomeNav />

      <section className="rounded-[40px] border border-sky-500/20 bg-gradient-to-br from-slate-950/85 via-slate-950/65 to-slate-900/55 p-12 text-center shadow-[0_0_70px_rgba(56,189,248,0.2)]">
        <span className="text-xs font-semibold uppercase tracking-[0.45em] text-sky-400/80">
          Enter the arena
        </span>
        <h1 className="mt-6 text-4xl font-semibold text-sky-50 sm:text-5xl md:text-6xl">
          Real-time coding battles. Neon-lit glory.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-sky-100/70 sm:text-base">
          Challenge rivals in lightning-fast PvP, dominate seasonal tournaments, and broadcast your highlight reels. Code Royale powers every match with real-time judge feedback.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <NeonLink href="/auth/signup" className="px-8 py-3">
            Start Battle
          </NeonLink>
              <NeonLink
                href="/auth/login"
                className="border-sky-500/30 bg-transparent text-sky-200 hover:border-sky-400 hover:bg-sky-500/10"
              >
            Watch Live Matches
          </NeonLink>
        </div>
      </section>

      <section className="grid gap-8 rounded-[36px] border border-sky-500/20 bg-slate-950/80 p-8 shadow-[0_0_55px_rgba(56,189,248,0.18)] backdrop-blur-xl md:grid-cols-[1.15fr_1fr] md:p-12">
        <div className="flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <span className="text-xs font-semibold uppercase tracking-[0.4em] text-sky-400/70">
              Live Bracket Preview
            </span>
            <h2 className="text-3xl font-semibold text-sky-50">
              Neon clash from the caster booth
            </h2>
            <p className="text-sm text-sky-100/70">
              Every match streams with split-screen analytics. Spectators follow keystrokes, judge
              verdicts, and streak multipliers second by second.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-sky-300">
            <span className="rounded-full border border-sky-500/30 px-3 py-1 uppercase tracking-[0.35em]">
              60 FPS HUD
            </span>
            <span className="rounded-full border border-sky-500/30 px-3 py-1 uppercase tracking-[0.35em]">
              Judge Timeline
            </span>
            <span className="rounded-full border border-sky-500/30 px-3 py-1 uppercase tracking-[0.35em]">
              Real-time Code Feed
            </span>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-[28px] border border-sky-500/25 bg-slate-900/80 shadow-[0_0_60px_rgba(56,189,248,0.25)]">
          <Image
            src="/images/bluebracket.jpg"
            alt="Futuristic code battle interface"
            width={960}
            height={640}
            className="h-full w-full object-cover object-center opacity-90"
            priority
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-950/30 via-sky-500/10 to-transparent" />
        </div>
      </section>

      <section
        id="game-modes"
        className="rounded-[40px] border border-sky-500/20 bg-slate-950/70 p-10 shadow-[0_0_55px_rgba(56,189,248,0.14)] backdrop-blur-xl sm:p-14"
      >
        <div className="flex flex-col gap-6 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-400/70">
            Select your arena
          </span>
          <h1 className="text-3xl font-semibold text-sky-50 md:text-5xl">
            Choose how you want to battle today
          </h1>
          <p className="mx-auto max-w-3xl text-sm text-sky-100/70 md:text-base">
            Queue instantly with bots, duel a rival, or invite up to four players for multi-way chaos. Modes share the same polished judge pipeline so you can focus on winning the code war.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {timers.map((timer) => (
            <div
              key={timer}
              className="rounded-3xl border border-sky-500/20 bg-slate-900/60 px-6 py-8 text-center shadow-[0_0_35px_rgba(56,189,248,0.1)]"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-sky-400/60">
                Timer Preset
              </p>
              <p className="mt-4 text-2xl font-semibold text-sky-100">{timer}</p>
              <p className="mt-2 text-sm text-sky-100/60">
                Configure before matchmaking to tailor the pressure curve.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="tournaments" className="grid gap-8 md:grid-cols-3">
        {battleModes.map((mode, index) => (
          <GlowCard key={mode.title} title={mode.title} description={mode.description} accent={index === 2 ? "purple" : index === 1 ? "blue" : "cyan"}>
            <ul className="mt-4 space-y-3 text-sm text-sky-100/70">
              {mode.details.map((detail) => (
                <li key={detail} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.5)]" />
                  {detail}
                </li>
              ))}
            </ul>
          </GlowCard>
        ))}
      </section>

      <section
        id="matchmaking"
        className="grid gap-6 rounded-[32px] border border-sky-500/20 bg-slate-950/70 p-10 shadow-[0_0_55px_rgba(56,189,248,0.12)] backdrop-blur-xl md:grid-cols-2 md:gap-10 md:p-14"
      >
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-semibold text-sky-50">Match Types</h2>
          <p className="text-sm text-sky-100/70">
            Pick the competition format that matches your energy level. Each mode shares the same real-time scoreboard and judge sandbox, keeping the focus on pure skill.
          </p>
          <div className="space-y-4">
            {matchTypes.map((type) => (
              <div
                key={type.name}
                className="rounded-2xl border border-sky-500/20 bg-slate-900/70 p-5 text-sm text-sky-100/70"
              >
                <h3 className="text-base font-semibold text-sky-100">{type.name}</h3>
                <p className="mt-2">{type.summary}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-between gap-6 rounded-3xl border border-sky-500/20 bg-slate-900/70 p-8 shadow-[0_0_50px_rgba(56,189,248,0.1)]">
          <div className="space-y-3 text-sm text-sky-100/70">
            <p>
              <strong className="text-sky-200">Quick Launch</strong> connects you to the recommended queue based on your recent history. Customize timers and mode on the next screen.
            </p>
            <p>
              <strong className="text-sky-200">Custom Lobby</strong> lets you invite friends or bots, tweak question pools, and set victory conditions like fastest solve or most points.
            </p>
          </div>
          <div className="grid gap-3">
            <NeonLink href="/auth/login">Quick Launch</NeonLink>
            <NeonLink
              href="/auth/signup"
              className="border-sky-500/30 bg-transparent text-sky-200 hover:border-sky-400 hover:bg-sky-500/10"
            >
              Create Custom Lobby
            </NeonLink>
          </div>
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-2">
        {featurePanels.map((panel) => (
          <div key={panel.id} id={panel.id} className="h-full">
            <GlowCard
              title={panel.title}
              description={panel.description}
              accent={panel.accent}
            >
              <div className="mt-4 flex flex-wrap gap-3">
                <NeonLink
                  href={panel.href}
                  className="text-xs uppercase tracking-[0.35em]"
                >
                  {panel.linkLabel}
                </NeonLink>
              </div>
            </GlowCard>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-[36px] border border-sky-500/20 bg-slate-950/85 shadow-[0_0_55px_rgba(56,189,248,0.18)]">
        <div className="grid gap-0 md:grid-cols-[1.35fr_1fr]">
          <div className="relative order-2 h-72 w-full md:order-1 md:h-full">
            <Image
              src="/images/bluecode.jpg"
              alt="Close-up code editor with neon syntax"
              fill
              className="object-cover object-center opacity-90"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-slate-950/70 via-slate-950/30 to-transparent" />
          </div>
          <div className="order-1 flex flex-col justify-center gap-4 p-10 md:order-2">
            <span className="text-xs font-semibold uppercase tracking-[0.4em] text-sky-400/70">
              Analyst Desk Feed
            </span>
            <h2 className="text-3xl font-semibold text-sky-50">
              Decode every micro-adjustment live
            </h2>
            <p className="text-sm text-sky-100/70">
              Pull up telemetry overlays while you prep for your queue. Observe keystroke cadence,
              fallback snippets, and time-to-pass metrics to reverse engineer elite strategies.
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-sky-300">
              <span className="rounded-full border border-sky-500/30 px-3 py-1 uppercase tracking-[0.35em]">
                Strategy Vault
              </span>
              <span className="rounded-full border border-sky-500/30 px-3 py-1 uppercase tracking-[0.35em]">
                Ghost Replays
              </span>
              <span className="rounded-full border border-sky-500/30 px-3 py-1 uppercase tracking-[0.35em]">
                Overlay API
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const BellIcon = () => (
  <svg
    aria-hidden
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
  >
    <path d="M15.5 17h-7c-1.1 0-2-.9-2-2v-3a5.5 5.5 0 0 1 11 0v3c0 1.1-.9 2-2 2Z" />
    <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
  </svg>
);

const GearIcon = () => (
  <svg
    aria-hidden
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09c0 .66.39 1.25 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06c-.46.46-.6 1.15-.33 1.82.26.67.86 1.16 1.51 1.2H21a2 2 0 1 1 0 4h-.09c-.66 0-1.25.39-1.51 1Z" />
  </svg>
);
