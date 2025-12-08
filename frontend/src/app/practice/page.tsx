import { PracticeLobby } from "./practice-lobby";

export default function PracticePage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-20">
      <header className="space-y-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-400/70">
          Solo training grounds
        </p>
        <h1 className="text-4xl font-semibold text-sky-50 md:text-5xl">
          Practice Arena
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-sky-100/70 md:text-base">
          Sharpen your fundamentals before stepping into PvP. Choose a difficulty tier, pick a curated challenge, and lock in a timer to simulate competitive pressure.
        </p>
      </header>
      <PracticeLobby />
    </div>
  );
}
