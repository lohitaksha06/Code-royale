import { AppShell } from "@/components/app-shell";
import { PracticeLobby } from "./practice-lobby";

export default function PracticePage() {
  return (
    <AppShell>
      <div className="p-6">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--cr-fg)]">Practice Arena</h1>
          <p className="mt-1 text-sm text-[var(--cr-fg-muted)]">
            Sharpen your skills before stepping into PvP. Choose a difficulty and start coding.
          </p>
        </header>
        <PracticeLobby />
      </div>
    </AppShell>
  );
}
