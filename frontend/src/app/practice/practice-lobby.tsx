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
  { label: "JavaScript (Node)", value: "javascript" },
  { label: "Python 3", value: "python" },
  { label: "C++", value: "cpp" },
];

export function PracticeLobby() {
  const router = useRouter();
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [timer, setTimer] = useState<number>(5 * 60);
  const [language, setLanguage] = useState<string>(languageOptions[0].value);
  const [questions, setQuestions] = useState<QuestionMeta[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadQuestions(currentDifficulty: Difficulty) {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/practice/questions?difficulty=${currentDifficulty}`);

        if (!response.ok) {
          throw new Error(`Failed to load questions (${response.status})`);
        }

        const data = (await response.json()) as { questions: QuestionMeta[] };

        if (!isMounted) {
          return;
        }

        setQuestions(data.questions);
        setSelectedQuestionId(data.questions[0]?.id ?? null);
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError("Unable to load questions. Please try again.");
          setQuestions([]);
          setSelectedQuestionId(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadQuestions(difficulty);

    return () => {
      isMounted = false;
    };
  }, [difficulty]);

  const selectedQuestion = useMemo(
    () => questions.find((question) => question.id === selectedQuestionId) ?? null,
    [questions, selectedQuestionId],
  );

  const handleStart = () => {
    if (!selectedQuestion) {
      setError("Select a question to begin.");
      return;
    }

    const searchParams = new URLSearchParams({
      timer: String(timer),
      language,
    });

    router.push(`/practice/${selectedQuestion.slug}?${searchParams.toString()}`);
  };

  return (
    <section className="rounded-[32px] border border-sky-500/20 bg-slate-950/75 p-8 shadow-[0_0_45px_rgba(56,189,248,0.18)] backdrop-blur-xl">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-400/60">
              Pick difficulty
            </p>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {difficultyOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setDifficulty(option.value)}
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                    difficulty === option.value
                      ? "border-sky-400 bg-sky-500/20 text-sky-100 shadow-[0_0_25px_rgba(56,189,248,0.3)]"
                      : "border-sky-500/20 bg-slate-900/70 text-sky-100/70 hover:border-sky-400/40 hover:text-sky-100"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-400/60">
              Timer
            </label>
            <select
              value={timer}
              onChange={(event) => setTimer(Number(event.target.value))}
              className="mt-3 w-full rounded-2xl border border-sky-500/20 bg-slate-900/70 px-4 py-3 text-sm font-semibold text-sky-100/80 focus:border-sky-400/60 focus:outline-none"
            >
              {timerOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-400/60">
              Language
            </label>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="mt-3 w-full rounded-2xl border border-sky-500/20 bg-slate-900/70 px-4 py-3 text-sm font-semibold text-sky-100/80 focus:border-sky-400/60 focus:outline-none"
            >
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-400/60">
              Question
            </p>
            <div className="mt-3 space-y-3">
              {loading && (
                <div className="rounded-2xl border border-sky-500/20 bg-slate-900/70 px-4 py-3 text-sm text-sky-100/70">
                  Loading questions...
                </div>
              )}
              {!loading && questions.length === 0 && (
                <div className="rounded-2xl border border-sky-500/20 bg-slate-900/70 px-4 py-3 text-sm text-sky-100/70">
                  No questions available yet for this difficulty.
                </div>
              )}
              {!loading && questions.map((question) => (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => setSelectedQuestionId(question.id)}
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition ${
                    selectedQuestionId === question.id
                      ? "border-sky-400 bg-sky-500/15 text-sky-50 shadow-[0_0_25px_rgba(56,189,248,0.22)]"
                      : "border-sky-500/20 bg-slate-900/70 text-sky-100/80 hover:border-sky-400/40 hover:text-sky-100"
                  }`}
                >
                  <span>{question.title}</span>
                  <span className="text-xs uppercase tracking-[0.25em] text-sky-400/70">
                    {question.difficulty}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleStart}
            className="mt-auto rounded-full border border-sky-500/40 bg-sky-500/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-sky-50 shadow-[0_0_35px_rgba(56,189,248,0.32)] transition hover:border-sky-300 hover:bg-sky-500/30"
            disabled={loading || !selectedQuestionId}
          >
            Start Practice
          </button>
        </div>
      </div>
    </section>
  );
}
