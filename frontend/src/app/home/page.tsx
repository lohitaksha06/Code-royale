import Image from "next/image";
import Link from "next/link";

import { AppShell } from "../../components/app-shell";

const battleModes = [
  {
    title: "Battle Against Bots",
    description: "Solo queue against adaptive AI rivals tuned for practice.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
      </svg>
    ),
  },
  {
    title: "1v1 Duels",
    description: "Head-to-head clashes where speed and accuracy crown the champion.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    title: "4-Player Brawls",
    description: "1v1v1v1 chaos built for squads or rivals.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
];

const stats = [
  { label: "Active Players", value: "12.5K" },
  { label: "Problems Solved", value: "1.2M" },
  { label: "Matches Today", value: "3.4K" },
];

export default function HomePage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-8 p-6">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[var(--cr-bg-secondary)] to-[var(--cr-bg-tertiary)] p-8">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl font-bold text-[var(--cr-fg)] md:text-4xl">
              Welcome back, Coder
            </h1>
            <p className="mt-3 text-[var(--cr-fg-muted)]">
              Ready for your next challenge? Jump into practice mode or queue up for a real-time battle.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/practice"
                className="inline-flex items-center gap-2 rounded-lg bg-[rgb(var(--cr-accent-rgb))] px-5 py-2.5 text-sm font-semibold text-[var(--cr-bg)] transition-all hover:opacity-90"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Start Practice
              </Link>
              <Link
                href="/game-modes"
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg)] px-5 py-2.5 text-sm font-semibold text-[var(--cr-fg)] transition-all hover:bg-[var(--cr-bg-secondary)]"
              >
                Battle Mode
              </Link>
            </div>
          </div>
          {/* Decorative gradient */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[rgba(var(--cr-accent-rgb),0.1)] to-transparent" />
        </section>

        {/* Stats Row */}
        <section className="grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] p-5"
            >
              <div className="text-2xl font-bold text-[rgb(var(--cr-accent-rgb))]">{stat.value}</div>
              <div className="mt-1 text-sm text-[var(--cr-fg-muted)]">{stat.label}</div>
            </div>
          ))}
        </section>

        {/* Battle Modes */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-[var(--cr-fg)]">Battle Modes</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {battleModes.map((mode) => (
              <div
                key={mode.title}
                className="group rounded-xl border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] p-5 transition-all hover:border-[rgba(var(--cr-accent-rgb),0.3)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[rgba(var(--cr-accent-rgb),0.1)] text-[rgb(var(--cr-accent-rgb))]">
                  {mode.icon}
                </div>
                <h3 className="mt-4 text-base font-semibold text-[var(--cr-fg)]">{mode.title}</h3>
                <p className="mt-2 text-sm text-[var(--cr-fg-muted)]">{mode.description}</p>
                <Link
                  href="/game-modes"
                  className="mt-4 inline-flex items-center gap-1 text-sm text-[rgb(var(--cr-accent-rgb))] transition-colors hover:underline"
                >
                  Play now
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activity / Quick Actions */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Quick Practice */}
          <section className="rounded-xl border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] p-5">
            <h2 className="mb-4 text-lg font-semibold text-[var(--cr-fg)]">Quick Practice</h2>
            <div className="space-y-3">
              {[
                { label: "Easy", problems: "20 problems", color: "text-emerald-400" },
                { label: "Medium", problems: "35 problems", color: "text-amber-400" },
                { label: "Hard", problems: "15 problems", color: "text-red-400" },
              ].map((tier) => (
                <Link
                  key={tier.label}
                  href={`/practice?difficulty=${tier.label.toLowerCase()}`}
                  className="flex items-center justify-between rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg)] p-4 transition-all hover:border-[rgba(var(--cr-accent-rgb),0.3)]"
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-medium ${tier.color}`}>{tier.label}</span>
                    <span className="text-xs text-[var(--cr-fg-muted)]">{tier.problems}</span>
                  </div>
                  <svg className="h-5 w-5 text-[var(--cr-fg-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              ))}
            </div>
          </section>

          {/* Your Progress */}
          <section className="rounded-xl border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] p-5">
            <h2 className="mb-4 text-lg font-semibold text-[var(--cr-fg)]">Your Progress</h2>
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-[var(--cr-fg-muted)]">Problems Solved</span>
                  <span className="text-[var(--cr-fg)]">42 / 70</span>
                </div>
                <div className="h-2 rounded-full bg-[var(--cr-bg-tertiary)]">
                  <div className="h-full w-[60%] rounded-full bg-[rgb(var(--cr-accent-rgb))]" />
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-[var(--cr-fg-muted)]">Current Streak</span>
                  <span className="text-[var(--cr-fg)]">5 days 🔥</span>
                </div>
                <div className="h-2 rounded-full bg-[var(--cr-bg-tertiary)]">
                  <div className="h-full w-[71%] rounded-full bg-amber-500" />
                </div>
              </div>
              <div className="pt-2">
                <Link
                  href="/profile"
                  className="text-sm text-[rgb(var(--cr-accent-rgb))] hover:underline"
                >
                  View full profile →
                </Link>
              </div>
            </div>
          </section>
        </div>

        {/* Featured Image */}
        <section className="relative overflow-hidden rounded-xl">
          <div className="relative h-48 w-full md:h-64">
            <Image
              src="/images/bluebracket.jpg"
              alt="Code battle interface"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--cr-bg)]/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-[rgb(var(--cr-accent-rgb))]">
                Live Tournaments
              </p>
              <h3 className="mt-1 text-xl font-bold text-[var(--cr-fg)]">
                Weekly Code Championship
              </h3>
              <p className="mt-1 text-sm text-[var(--cr-fg-muted)]">
                Join 500+ players competing for the top spot
              </p>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
