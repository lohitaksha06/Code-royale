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

const difficultyOptions: Array<{ label: string; value: Difficulty; color: string }> = [
  { label: "Easy", value: "easy", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
  { label: "Medium", value: "medium", color: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
  { label: "Hard", value: "hard", color: "text-red-400 border-red-500/30 bg-red-500/10" },
];

const timerOptions = [
  { label: "1 minute", value: 60 },
  { label: "5 minutes", value: 5 * 60 },
  { label: "15 minutes", value: 15 * 60 },
  { label: "30 minutes", value: 30 * 60 },
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
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Settings Panel */}
      <div className="lg:col-span-2 space-y-6">
        {/* Difficulty Selection */}
        <div className="rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] p-5">
          <h3 className="mb-4 text-sm font-medium text-[var(--cr-fg)]">Difficulty</h3>
          <div className="flex gap-3">
            {difficultyOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setDifficulty(option.value)}
                className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-all ${
                  difficulty === option.value
                    ? `${option.color} shadow-sm`
                    : "border-[var(--cr-border)] text-[var(--cr-fg-muted)] hover:border-[var(--cr-fg-muted)] hover:text-[var(--cr-fg)]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Timer and Language */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] p-5">
            <label className="mb-3 block text-sm font-medium text-[var(--cr-fg)]">Timer</label>
            <select
              value={timer}
              onChange={(event) => setTimer(Number(event.target.value))}
              className="w-full rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg)] px-4 py-2.5 text-sm text-[var(--cr-fg)] focus:border-[rgba(var(--cr-accent-rgb),0.5)] focus:outline-none focus:ring-1 focus:ring-[rgba(var(--cr-accent-rgb),0.5)]"
            >
              {timerOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] p-5">
            <label className="mb-3 block text-sm font-medium text-[var(--cr-fg)]">Language</label>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="w-full rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg)] px-4 py-2.5 text-sm text-[var(--cr-fg)] focus:border-[rgba(var(--cr-accent-rgb),0.5)] focus:outline-none focus:ring-1 focus:ring-[rgba(var(--cr-accent-rgb),0.5)]"
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

      {/* Preview Panel */}
      <div className="space-y-6">
        <div className="rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] p-5">
          <h3 className="mb-4 text-sm font-medium text-[var(--cr-fg)]">Problem Preview</h3>
          <div className="space-y-4 text-sm">
            {loading && (
              <div className="flex items-center gap-2 text-[var(--cr-fg-muted)]">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Loading problems...
              </div>
            )}
            {!loading && questions.length > 0 && (
              <>
                <p className="text-[var(--cr-fg-muted)]">
                  <span className="text-[rgb(var(--cr-accent-rgb))]">{questions.length}</span> {activeDifficultyLabel.toLowerCase()} problems available
                </p>
                <div className="space-y-2">
                  <p className="text-xs text-[var(--cr-fg-muted)]">Sample problems:</p>
                  <ul className="space-y-1.5">
                    {questions.slice(0, 4).map((question) => (
                      <li key={question.id} className="flex items-center gap-2 text-[var(--cr-fg)]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--cr-accent-rgb))]" />
                        <span className="truncate">{question.title}</span>
                      </li>
                    ))}
                    {questions.length > 4 && (
                      <li className="text-xs text-[var(--cr-fg-muted)]">
                        + {questions.length - 4} more
                      </li>
                    )}
                  </ul>
                </div>
              </>
            )}
            {!loading && questions.length === 0 && !error && (
              <p className="text-[var(--cr-fg-muted)]">No problems available for this difficulty yet.</p>
            )}
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleStart}
          disabled={loading || questions.length === 0}
          className="w-full rounded-lg bg-[rgb(var(--cr-accent-rgb))] px-6 py-3 text-sm font-semibold text-[var(--cr-bg)] transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Start Practice
        </button>
      </div>
    </div>
  );
}
