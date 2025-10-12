import { GlowCard } from "../../components/glow-card";
import { NeonLink } from "../../components/neon-button";

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

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12">
      <section className="rounded-[40px] border border-sky-500/20 bg-slate-950/70 p-10 shadow-[0_0_55px_rgba(56,189,248,0.14)] backdrop-blur-xl sm:p-14">
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

      <section className="grid gap-8 md:grid-cols-3">
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

      <section className="grid gap-6 rounded-[32px] border border-sky-500/20 bg-slate-950/70 p-10 shadow-[0_0_55px_rgba(56,189,248,0.12)] backdrop-blur-xl md:grid-cols-2 md:gap-10 md:p-14">
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
    </div>
  );
}
