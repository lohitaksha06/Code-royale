'use client';

import { useCallback, useEffect, useMemo, useState } from "react";

type PracticeArenaShellProps = {
  question: {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    sampleInput?: string | null;
    sampleOutput?: string | null;
    languages: string[];
    meta?: {
      timeComplexity?: string | null;
      spaceComplexity?: string | null;
      topics?: string[] | null;
    } | null;
  };
  initialTimer: number;
  initialLanguage: string;
};

type SubmissionResult = {
  id: number;
  status: string;
  stdout: string | null;
  stderr: string | null;
  time: string | null;
  memory: number | null;
  passed: boolean;
};

const languageLabels: Record<string, string> = {
  javascript: "JavaScript (Node)",
  python: "Python 3",
  cpp: "C++",
  java: "Java",
  c: "C",
};

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.max(seconds % 60, 0)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
};

export function PracticeArenaShell({ question, initialTimer, initialLanguage }: PracticeArenaShellProps) {
  const [language, setLanguage] = useState(initialLanguage);
  const [timerSeconds, setTimerSeconds] = useState(initialTimer);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [code, setCode] = useState<string>(() => {
    const defaultSnippets: Record<string, string> = {
      javascript: `// ${question.title}\nfunction solve(input) {\n  // TODO: implement solution\n  return input;\n}\n\nconst fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8').trim();\nprocess.stdout.write(String(solve(input)));\n`,
      python: `# ${question.title}\ndef solve(raw: str) -> str:\n    # TODO: implement solution\n    return raw\n\nimport sys\ninput_data = sys.stdin.read().strip()\nprint(solve(input_data))\n`,
      cpp: `// ${question.title}\n#include <bits/stdc++.h>\nusing namespace std;\n\nstring solve(const string& input) {\n    // TODO: implement solution\n    return input;\n}\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    stringstream buffer;\n    buffer << cin.rdbuf();\n    string input = buffer.str();\n\n    cout << solve(input);\n    return 0;\n}\n`,
      java: `// ${question.title}\nimport java.io.*;\nimport java.util.*;\n\npublic class Main {\n  private static String solve(String input) {\n    // TODO: implement solution\n    return input;\n  }\n\n  public static void main(String[] args) throws Exception {\n    StringBuilder sb = new StringBuilder();\n    try (BufferedReader br = new BufferedReader(new InputStreamReader(System.in))) {\n      String line;\n      while ((line = br.readLine()) != null) {\n        if (sb.length() > 0) sb.append("\\n");\n        sb.append(line);\n      }\n    }\n    System.out.print(solve(sb.toString()));\n  }\n}\n`,
      c: `// ${question.title}\n#include <stdio.h>\n#include <string.h>\n\nvoid solve(const char *input) {\n  // TODO: implement solution\n  printf("%s", input);\n}\n\nint main(void) {\n  char buffer[1 << 16];\n  size_t length = fread(buffer, 1, sizeof(buffer) - 1, stdin);\n  buffer[length] = '\\0';\n  solve(buffer);\n  return 0;\n}\n`,
    };

    return defaultSnippets[initialLanguage] ?? "";
  });
  const [results, setResults] = useState<SubmissionResult[] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const timeComplexity = question.meta?.timeComplexity ?? "To be determined";
  const spaceComplexity = question.meta?.spaceComplexity ?? "To be determined";
  const topics = Array.isArray(question.meta?.topics)
    ? (question.meta?.topics ?? []).filter(Boolean) as string[]
    : [];
  const hasResults = (results?.length ?? 0) > 0;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (!isTimerActive) {
          return prev;
        }
        if (prev <= 0) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerActive]);

  useEffect(() => {
    setResults(null);
    setFeedback(null);
  }, [language]);

  const timerState = useMemo(() => {
    if (timerSeconds === 0) {
      return "Time";
    }
    return formatDuration(timerSeconds);
  }, [timerSeconds]);

  const handleResetTimer = useCallback(() => {
    setTimerSeconds(initialTimer);
    setIsTimerActive(true);
  }, [initialTimer]);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    setCode((currentCode) => {
      if (!currentCode.trim()) {
        const defaultSnippets: Record<string, string> = {
          javascript: `// ${question.title}\nfunction solve(input) {\n  return input;\n}\n\nconst fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8').trim();\nprocess.stdout.write(String(solve(input)));\n`,
          python: `# ${question.title}\ndef solve(raw: str) -> str:\n    return raw\n\nimport sys\ninput_data = sys.stdin.read().strip()\nprint(solve(input_data))\n`,
          cpp: `// ${question.title}\n#include <bits/stdc++.h>\nusing namespace std;\n\nstring solve(const string& input) {\n    return input;\n}\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    stringstream buffer;\n    buffer << cin.rdbuf();\n    string input = buffer.str();\n\n    cout << solve(input);\n    return 0;\n}\n`,
          java: `// ${question.title}\nimport java.io.*;\nimport java.util.*;\n\npublic class Main {\n  private static String solve(String input) {\n    return input;\n  }\n\n  public static void main(String[] args) throws Exception {\n    StringBuilder sb = new StringBuilder();\n    try (BufferedReader br = new BufferedReader(new InputStreamReader(System.in))) {\n      String line;\n      while ((line = br.readLine()) != null) {\n        if (sb.length() > 0) sb.append("\\n");\n        sb.append(line);\n      }\n    }\n    System.out.print(solve(sb.toString()));\n  }\n}\n`,
          c: `// ${question.title}\n#include <stdio.h>\n#include <string.h>\n\nvoid solve(const char *input) {\n  printf("%s", input);\n}\n\nint main(void) {\n  char buffer[1 << 16];\n  size_t length = fread(buffer, 1, sizeof(buffer) - 1, stdin);\n  buffer[length] = '\\0';\n  solve(buffer);\n  return 0;\n}\n`,
        };

        return defaultSnippets[value] ?? currentCode;
      }

      return currentCode;
    });
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      setFeedback("Write some code before running your solution.");
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);
    setResults(null);

    try {
      const response = await fetch("/api/practice/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: question.id,
          language,
          code,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: "Submission failed." }));
        const message = data.error ?? "Submission failed.";
        setFeedback(message);
        return;
      }

      const payload = (await response.json()) as {
        passed: boolean;
        results: SubmissionResult[];
      };

      setResults(payload.results);
      setFeedback(payload.passed ? "All test cases passed!" : "Some test cases failed.");
    } catch (error) {
      console.error("Submission error", error);
      setFeedback("Unable to reach Judge0. Check your configuration and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-8 rounded-[40px] border border-sky-500/22 bg-slate-950/85 p-6 shadow-[0_0_70px_rgba(56,189,248,0.2)] backdrop-blur-xl sm:p-8 xl:grid-cols-[1.25fr_1fr]">
      <article className="space-y-8">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-sky-400/70">
            <span>{question.difficulty} practice</span>
            <span className="rounded-full border border-sky-500/30 px-3 py-1 text-[10px] text-sky-300">
              {timerState}
            </span>
          </div>
          <h2 className="text-3xl font-semibold text-sky-50 md:text-4xl">{question.title}</h2>
        </div>
        <div className="space-y-4 text-sm leading-relaxed text-sky-100/75">
          {question.description.split(/\n\n+/).map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        {(question.sampleInput || question.sampleOutput) && (
          <div className="grid gap-4 lg:grid-cols-2">
            {question.sampleInput && (
              <div className="rounded-2xl border border-sky-500/20 bg-slate-900/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-400/60">Sample Input</p>
                <pre className="mt-3 max-h-56 overflow-auto text-sm text-sky-100/80">{question.sampleInput}</pre>
              </div>
            )}
            {question.sampleOutput && (
              <div className="rounded-2xl border border-sky-500/20 bg-slate-900/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-400/60">Sample Output</p>
                <pre className="mt-3 max-h-56 overflow-auto text-sm text-sky-100/80">{question.sampleOutput}</pre>
              </div>
            )}
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-sky-500/20 bg-slate-900/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-400/60">Time complexity</p>
            <p className="mt-2 text-sm text-sky-100/75">{timeComplexity}</p>
          </div>
          <div className="rounded-2xl border border-sky-500/20 bg-slate-900/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-400/60">Space complexity</p>
            <p className="mt-2 text-sm text-sky-100/75">{spaceComplexity}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-sky-500/20 bg-slate-900/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-400/60">Key topics</p>
          {topics.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {topics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-full border border-sky-500/30 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-sky-200"
                >
                  {topic}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-sky-100/65">
              Topics will populate as we gather more submissions for this challenge.
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-full border border-sky-500/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-sky-200 hover:border-sky-300"
            onClick={() => setIsTimerActive((state) => !state)}
          >
            {isTimerActive ? "Pause Timer" : "Resume Timer"}
          </button>
          <button
            type="button"
            className="rounded-full border border-sky-500/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-sky-200 hover:border-sky-300"
            onClick={handleResetTimer}
          >
            Reset Timer
          </button>
        </div>
      </article>

      <section className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-400/60">Language</label>
          <select
            value={language}
            onChange={(event) => handleLanguageChange(event.target.value)}
            className="rounded-full border border-sky-500/20 bg-slate-900/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-sky-100/80 focus:border-sky-400/60 focus:outline-none"
          >
            {question.languages.map((lang) => (
              <option key={lang} value={lang}>
                {languageLabels[lang] ?? lang}
              </option>
            ))}
          </select>
        </div>
        <div className="relative flex-1">
          <textarea
            value={code}
            onChange={(event) => setCode(event.target.value)}
            spellCheck={false}
            className="min-h-[420px] w-full resize-none rounded-[28px] border border-slate-700/70 bg-[#04070f] p-6 font-mono text-sm text-sky-100 shadow-[0_0_40px_rgba(56,189,248,0.16)] focus:border-sky-400/60 focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-full border border-emerald-500/40 bg-emerald-500/20 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100 shadow-[0_0_35px_rgba(16,185,129,0.35)] transition hover:border-emerald-400 disabled:opacity-60"
          >
            {isSubmitting ? "Running..." : "Run Code"}
          </button>
          <button
            type="button"
            onClick={() => setCode("")}
            className="rounded-full border border-slate-600/50 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-sky-200 hover:border-sky-400/60"
          >
            Clear Editor
          </button>
        </div>
        <div className="rounded-[28px] border border-slate-700/60 bg-[#050b18] p-5 shadow-[0_0_42px_rgba(56,189,248,0.18)]">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-sky-400/70">
            <span>Execution console</span>
            <span className="rounded-full border border-sky-500/25 px-3 py-1 text-[10px] text-sky-300">
              {languageLabels[language] ?? language}
            </span>
          </div>
          <div className="mt-3 h-52 overflow-y-auto rounded-2xl border border-slate-700/40 bg-[#030713] p-4">
            <div className="space-y-4 text-xs text-sky-100/85">
              {feedback && (
                <div
                  className={`rounded-xl border px-3 py-2 ${
                    feedback.includes("passed")
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                      : "border-sky-500/35 bg-sky-500/10 text-sky-100"
                  }`}
                >
                  {feedback}
                </div>
              )}
              {hasResults ? (
                results!.map((result, index) => (
                  <div
                    key={result.id}
                    className={`rounded-xl border px-3 py-3 ${
                      result.passed
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-100"
                        : "border-red-500/40 bg-red-500/10 text-red-100"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em]">
                      <span>Test {index + 1}</span>
                      <span>{result.status}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-4 text-[10px] uppercase tracking-[0.25em] text-sky-200/70">
                      <span>Time {result.time ?? "—"}</span>
                      <span>Memory {result.memory != null ? result.memory : "—"}</span>
                    </div>
                    {result.stdout && (
                      <pre className="mt-2 whitespace-pre-wrap text-[11px] text-sky-100/90">
                        {result.stdout}
                      </pre>
                    )}
                    {result.stderr && (
                      <pre className="mt-2 whitespace-pre-wrap text-[11px] text-red-200/90">
                        {result.stderr}
                      </pre>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sky-300/70">Run your code to view test case feedback and console output.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
