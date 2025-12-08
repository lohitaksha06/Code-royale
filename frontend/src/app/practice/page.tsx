import { PracticeLobby } from "./practice-lobby";
import { PracticeScaffold } from "./practice-scaffold";

export default function PracticePage() {
  return (
    <PracticeScaffold>
      <header className="max-w-3xl space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-400/70">
          Solo training grounds
        </p>
        <h1 className="text-4xl font-semibold text-sky-50 md:text-5xl">
          Practice Arena
        </h1>
        <p className="text-sm text-sky-100/70 md:text-base">
          Sharpen your fundamentals before stepping into PvP. Choose a difficulty tier, lock in a timer, and let us deliver a randomized challenge tuned to your goals.
        </p>
      </header>
      <PracticeLobby />
    </PracticeScaffold>
  );
}
