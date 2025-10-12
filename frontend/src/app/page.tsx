import { GlowCard } from "../components/glow-card";
import { NeonLink } from "../components/neon-button";

export default function Home() {
  return (
    <div className="flex flex-col gap-16">
      <section className="relative grid gap-10 rounded-[40px] border border-slate-800/70 bg-slate-900/40 p-10 shadow-[0_10px_60px_rgba(15,118,230,0.15)] backdrop-blur-xl sm:grid-cols-[1.2fr_1fr] sm:gap-14 sm:p-14">
        <div className="flex flex-col gap-8">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-sky-400/80">
            <span className="h-1.5 w-12 rounded-full bg-sky-500/70" />
            Real-Time Coding Arena
          </span>
          <h1 className="text-4xl font-semibold leading-tight text-sky-50 md:text-6xl">
            Battle-ready coding with neon intensity.
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-sky-100/70 md:text-lg">
            Duel friends, climb the Royale ladder, and sharpen your reflexes in a
            futuristic arena crafted for developers. Every keystroke powers the
            scoreboard.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <NeonLink href="/auth/signup">Join the Beta</NeonLink>
            <NeonLink
              href="#get-started"
              className="border-sky-400/40 bg-transparent text-sky-200 hover:border-sky-300 hover:bg-sky-400/10"
            >
              Explore Setup Steps
            </NeonLink>
          </div>
          <dl className="grid gap-6 sm:grid-cols-3">
            {[
              {
                label: "Concurrent Battles",
                helper: "Connect Firebase to stream live counts.",
              },
              {
                label: "Verified Coders",
                helper: "Displays once Auth sync is enabled.",
              },
              {
                label: "Average Match",
                helper: "Timer appears after first duel.",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-sky-500/20 bg-slate-900/60 p-4 text-center shadow-[0_0_30px_rgba(56,189,248,0.08)]"
              >
                <dt className="text-xs uppercase tracking-[0.3em] text-sky-500/60">
                  {stat.label}
                </dt>
                <dd className="mt-3 text-lg font-semibold text-sky-100/80">
                  Awaiting data
                </dd>
                <dd className="mt-2 text-xs text-sky-400/60">{stat.helper}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="relative flex flex-col justify-end gap-6 rounded-3xl border border-sky-500/20 bg-gradient-to-br from-slate-900/60 to-slate-900/10 p-8 shadow-[0_0_45px_rgba(56,189,248,0.16)]">
          <div className="absolute inset-x-6 top-6 h-32 rounded-3xl bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.35),_transparent_70%)] blur-3xl" />
          <div className="relative grid gap-4 text-sm">
            <h2 className="text-lg font-semibold text-sky-100">Match Uplink</h2>
            <div className="space-y-3 rounded-2xl border border-sky-500/20 bg-slate-950/80 p-4">
              <p className="text-sm text-sky-100/65">
                Live queues will populate here automatically once Socket.IO is wired
                to the Firebase queue collection.
              </p>
            </div>
            <div className="rounded-2xl border border-sky-500/20 bg-slate-950/80 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-sky-400/70">
                Next Duel
              </p>
              <p className="mt-3 text-base font-semibold text-sky-100">
                Waiting for your first matchmaking event.
              </p>
              <p className="mt-2 text-sm text-sky-100/60">
                Once the backend pushes an active duel, details drop here in real
                time.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-3">
        <GlowCard
          title="Lightning Modes"
          description="Hop into Bullet, League, or Bot scrims. Every mode recalibrates pace, difficulty, and scoring curves."
          accent="cyan"
        >
          <ul className="grid gap-3 text-sm text-sky-100/70">
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.5)]" />
              60s bullet rounds with adaptive prompts.
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
              League ladders with ELO-calibrated rivals.
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.5)]" />
              Smart bots tuned for practice or chaos.
            </li>
          </ul>
        </GlowCard>

        <GlowCard
          title="Telemetry Dashboard"
          description="KPIs sync directly from Firestore once you connect live data.
          Placeholder widgets below demonstrate layout states."
          accent="blue"
        >
          <div className="grid gap-3 text-sm text-sky-100/70">
            {["Streaks", "Solve velocity"].map((metric) => (
              <div
                key={metric}
                className="rounded-xl border border-sky-500/20 bg-slate-950/80 p-3"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-sky-400/70">
                  {metric}
                </p>
                <p className="mt-2 text-sm text-sky-100/60">
                  Data appears after Firebase integration.
                </p>
              </div>
            ))}
          </div>
        </GlowCard>

        <GlowCard
          title="Secure Sandbox"
          description="Instant verdicts stream from a hardened Firebase + Socket uplink. Compile, execute, respond in milliseconds."
          accent="purple"
        >
          <div className="space-y-3 text-sm text-sky-100/70">
            <p>Optimized for TypeScript, Python, and C++ out of the box.</p>
            <p>Custom judges &amp; rate limiting ensure fair duels.</p>
            <p>Replay packets let you audit every keystroke.</p>
          </div>
        </GlowCard>
      </section>

      <section className="grid gap-10 rounded-[36px] border border-slate-800/80 bg-slate-900/40 p-10 shadow-[0_0_55px_rgba(56,189,248,0.12)] backdrop-blur-xl md:grid-cols-[1.1fr_0.9fr] md:gap-14 md:p-14">
        <div className="flex flex-col gap-6">
          <h2 className="text-3xl font-semibold text-sky-50 md:text-4xl">
            Built for coders who crave adrenaline.
          </h2>
          <p className="text-base text-sky-100/70">
            Code Royale fuses esports presentation with rigorous assessments. Queue with teammates, scout rivals via the dashboard, and climb neon-lit leagues.
          </p>
          <div className="grid gap-4 text-sm text-sky-100/75 md:grid-cols-2">
            {["Real-time sockets", "Firebase telemetry", "Monaco editor", "Framer motion"].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl border border-sky-500/20 bg-slate-950/60 p-4"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.5)]" />
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="relative flex flex-col gap-5 rounded-3xl border border-sky-500/20 bg-slate-950/70 p-6 shadow-[0_0_50px_rgba(56,189,248,0.12)]">
          <p className="text-xs uppercase tracking-[0.35em] text-sky-400/60">
            Pipeline Preview
          </p>
          <div className="space-y-3 text-sm text-sky-100/70">
            <p>
              <strong className="text-sky-200">pnpm dev</strong> spins up the arena with real-time socket feeds.
            </p>
            <p>Firebase Auth verifies players before they enter the tunnel.</p>
            <p>Leaderboard sync pulses every 5 seconds with incremental updates.</p>
            <p>Match replays stream through an encrypted edge cache.</p>
          </div>
        </div>
      </section>

      <section id="get-started" className="relative overflow-hidden rounded-[32px] border border-sky-500/20 bg-slate-950/70 p-10 text-center shadow-[0_0_45px_rgba(56,189,248,0.14)]">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.2),_transparent_65%)]" />
        <h2 className="text-3xl font-semibold text-sky-50 md:text-4xl">
          Ready to activate your arena?
        </h2>
        <p className="mt-4 text-sm text-sky-100/70 md:text-base">
          Connect your Firebase project, enable Socket.IO matchmaking, and bring your
          first duel online. The interface adapts instantly once live data flows in.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <NeonLink href="/auth/signup" className="px-8 py-3">
            Get Started
          </NeonLink>
          <NeonLink
            href="/auth/login"
            className="border-sky-500/30 bg-transparent text-sky-200 hover:border-sky-400 hover:bg-sky-500/10"
          >
            I already have access
          </NeonLink>
        </div>
      </section>
    </div>
  );
}
