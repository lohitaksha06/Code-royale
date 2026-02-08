"use client";

import { AppShell } from "../../components/app-shell";

/* ── Rule sections ──────────────────────────────────────── */
const rules = [
  {
    title: "Fair Play",
    icon: "⚖️",
    items: [
      "Each participant may only compete with one account per tournament. Alt accounts or shared accounts will result in immediate disqualification.",
      "All code submitted must be your own original work, written during the tournament window.",
      "The use of AI code-generation tools (e.g. ChatGPT, Copilot, or similar) to solve tournament problems is strictly prohibited.",
      "Sharing or receiving solutions, hints, or test-case information with other participants during a live tournament is not allowed.",
    ],
  },
  {
    title: "Conduct",
    icon: "🤝",
    items: [
      "Treat all participants, organizers, and spectators with respect at all times.",
      "Any form of harassment, hate speech, or toxic behavior in chat, lobbies, or forums will lead to penalties.",
      "Do not disrupt or interfere with other participants' ability to compete (e.g. spamming, DDoS, exploiting bugs).",
      "Publicly discussing or leaking tournament problems before the event officially concludes is forbidden.",
    ],
  },
  {
    title: "Scoring & Submissions",
    icon: "📊",
    items: [
      "Problems are scored based on correctness and time of submission. Faster correct solutions rank higher.",
      "Partial credit may be awarded for solutions that pass a subset of test cases, depending on the tournament format.",
      "Submissions that attempt to exploit the judge system (e.g. hardcoding outputs, time-bomb solutions) will be invalidated.",
      "In the event of a tie, the participant with fewer total submissions (penalty) will be ranked higher.",
    ],
  },
  {
    title: "Penalties",
    icon: "🚫",
    items: [
      "First violation: Tournament score is nullified and a temporary ban from future tournaments (duration at organizer discretion).",
      "Second violation: Permanent ban from all Code Royale tournaments and potential account suspension.",
      "Organizers reserve the right to investigate suspicious activity and issue penalties retroactively.",
    ],
  },
];

/* ── Component ──────────────────────────────────────────── */
export default function TournamentsPage() {
  return (
    <AppShell>
      <div className="min-h-[calc(100vh-3.5rem)] p-6 md:p-10">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏆</span>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--cr-fg)]">
              Tournaments
            </h1>
            <span className="ml-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-0.5 text-xs font-semibold tracking-wider text-amber-400">
              COMING SOON
            </span>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--cr-fg-muted)]">
            Organized competitive events where players battle it out for glory and bragging rights.
            Tournaments are currently under development — stay tuned for launch announcements!
          </p>
        </div>

        {/* Coming Soon banner */}
        <div className="mb-10 overflow-hidden rounded-xl border border-[var(--cr-border)] bg-gradient-to-br from-[rgba(var(--cr-accent-rgb),0.08)] to-transparent">
          <div className="flex flex-col items-center gap-4 px-6 py-12 text-center md:py-16">
            <span className="text-6xl">🚧</span>
            <h2 className="text-xl font-semibold text-[var(--cr-fg)]">
              Tournaments are on the way!
            </h2>
            <p className="max-w-lg text-sm text-[var(--cr-fg-muted)]">
              We&apos;re building a fully-featured tournament system with brackets, seeding, and
              live spectating. Prizes haven&apos;t been decided yet — we&apos;ll announce
              details once everything is finalized.
            </p>
            <div className="mt-2 flex items-center gap-2 rounded-full border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] px-5 py-2 text-xs font-medium text-[var(--cr-fg-muted)]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
              In Development
            </div>
          </div>
        </div>

        {/* Rules */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[var(--cr-fg)]">Tournament Rules</h2>
          <p className="mt-1 text-sm text-[var(--cr-fg-muted)]">
            Code Royale is built on fair competition. All participants must follow these rules.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {rules.map((section) => (
            <div
              key={section.title}
              className="rounded-xl border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] p-5 transition-colors hover:border-[rgba(var(--cr-accent-rgb),0.3)]"
            >
              <div className="mb-4 flex items-center gap-2">
                <span className="text-xl">{section.icon}</span>
                <h3 className="text-sm font-semibold tracking-wide text-[var(--cr-fg)]">
                  {section.title}
                </h3>
              </div>
              <ul className="space-y-3">
                {section.items.map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed text-[var(--cr-fg-muted)]">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[rgb(var(--cr-accent-rgb))]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Reporting section */}
        <div className="mt-10 rounded-xl border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] p-6">
          <div className="flex items-start gap-3">
            <span className="text-xl">📣</span>
            <div>
              <h3 className="text-sm font-semibold text-[var(--cr-fg)]">Report Violations</h3>
              <p className="mt-1 text-sm leading-relaxed text-[var(--cr-fg-muted)]">
                We encourage all participants to help maintain fair competition. If you witness any
                rule-breaking behavior during a tournament, please report it through the in-game
                reporting system. Valid reports help keep Code Royale competitive and fun for everyone.
              </p>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-8 text-center text-xs text-[var(--cr-fg-muted)]">
          Rules are subject to change. Organizers reserve the right to make final decisions on all disputes.
        </p>
      </div>
    </AppShell>
  );
}
