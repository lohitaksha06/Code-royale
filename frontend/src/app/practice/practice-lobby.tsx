'use client';

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Difficulty = "easy" | "medium" | "hard";

type QuestionMeta = {
  id: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
};

const difficultyOptions: Array<{ label: string; value: Difficulty }> = [
  { label: "Easy", value: "easy" },
  { label: "Medium", value: "medium" },
  { label: "Hard", value: "hard" },
];

const timerOptions = [
  { label: "1 minute", value: 60 },
  { label: "5 minutes", value: 5 * 60 },
  { label: "15 minutes", value: 15 * 60 },
];

const languageOptions = [
  { label: "JavaScript (Node)", value: "node" },
  { label: "Python 3", value: "python" },
  { label: "C++", value: "cpp" },
  { label: "Java", value: "java" },
  { label: "C", value: "c" },
];

export function PracticeLobby() {
  const router = useRouter();
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [timer, setTimer] = useState<number>(5 * 60);
  const [language, setLanguage] = useState<string>(languageOptions[0].value);
  const [questions, setQuestions] = useState<QuestionMeta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeDifficultyLabel = useMemo(
    () => difficultyOptions.find((option) => option.value === difficulty)?.label ?? "",
    [difficulty],
  );

  useEffect(() => {
    let isMounted = true;

    const loadQuestions = async (currentDifficulty: Difficulty) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/practice/questions?difficulty=${currentDifficulty}`);

        if (!response.ok) {
          throw new Error(`Failed to load questions (${response.status})`);
        }

        const data = (await response.json()) as { questions: QuestionMeta[] };

        if (isMounted) {
          setQuestions(data.questions);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError("Unable to load questions. Please try again.");
          setQuestions([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadQuestions(difficulty);

    return () => {
      isMounted = false;
    };
  }, [difficulty]);

  const handleStart = () => {
    if (questions.length === 0) {
      setError("No questions available yet for this difficulty.");
      return;
    }

    setError(null);

    const randomizedQuestion = questions[Math.floor(Math.random() * questions.length)];
    const searchParams = new URLSearchParams({
      timer: String(timer),
      language,
    });

    router.push(`/practice/${randomizedQuestion.slug}?${searchParams.toString()}`);
  };

  return (
    <section className="w-full px-6 pb-20 pt-10 sm:px-8 lg:px-10">
      <div className="grid gap-12 lg:grid-cols-[1.15fr_0.9fr]">
        <div className="space-y-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-400/60">Pick difficulty</p>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {difficultyOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setDifficulty(option.value)}
                  className={`rounded-2xl border px-4 py-4 text-sm font-semibold transition ${
                    difficulty === option.value
                      ? "border-sky-400 bg-sky-500/20 text-sky-100 shadow-[0_0_30px_rgba(56,189,248,0.28)]"
                      : "border-slate-600/40 bg-slate-900/70 text-sky-100/70 hover:border-sky-400/40 hover:text-sky-100"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-400/60">Timer</label>
              <select
                value={timer}
                onChange={(event) => setTimer(Number(event.target.value))}
                className="mt-3 w-full rounded-2xl border border-slate-600/40 bg-slate-900/70 px-4 py-3 text-sm font-semibold text-sky-100/80 focus:border-sky-400/60 focus:outline-none"
              >
                {timerOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-400/60">Language</label>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className="mt-3 w-full rounded-2xl border border-slate-600/40 bg-slate-900/70 px-4 py-3 text-sm font-semibold text-sky-100/80 focus:border-sky-400/60 focus:outline-none"
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-[28px] border border-slate-600/40 bg-slate-900/65 p-6 shadow-[0_0_36px_rgba(56,189,248,0.18)]">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-400/60">Next challenge preview</p>
            <div className="mt-4 space-y-3 text-sm text-sky-100/75">
              {loading && <p>Fetching curated problems...</p>}
              {!loading && questions.length > 0 && (
                <>
                  <p>
                    We have <span className="text-sky-200">{questions.length}</span> {activeDifficultyLabel.toLowerCase()} problems ready. We will pick one at random the moment you start practice.
                  </p>
                  <p className="text-xs uppercase tracking-[0.3em] text-sky-400/60">Sample pool</p>
                  <ul className="space-y-2 text-sm text-sky-100/70">
                    {questions.slice(0, 3).map((question) => (
                      <li key={question.id} className="flex items-center gap-2">
                        <span className="inline-flex h-2 w-2 rounded-full bg-sky-400/80" />
                        <span className="truncate">{question.title}</span>
                      </li>
                    ))}
                    {questions.length > 3 && (
                      <li className="text-xs text-sky-300/70">+ {questions.length - 3} more challenges in rotation</li>
                    )}
                  </ul>
                </>
              )}
              {!loading && questions.length === 0 && (
                <p className="text-sky-200/70">We are still calibrating this tier. Check back soon for fresh problems.</p>
              )}
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>
          )}

          <button
            type="button"
            onClick={handleStart}
            className="mt-2 rounded-full border border-sky-500/40 bg-sky-500/20 px-8 py-4 text-sm font-semibold uppercase tracking-[0.3em] text-sky-50 shadow-[0_0_40px_rgba(56,189,248,0.32)] transition hover:border-sky-300 hover:bg-sky-500/35 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={loading || questions.length === 0}
          >
            Start Practice
          </button>
        </div>
      </div>
    </section>
  );
}
