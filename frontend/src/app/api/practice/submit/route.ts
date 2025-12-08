import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase-service";

const languageMap: Record<string, number> = {
  javascript: 63, // Node.js 16.13.0
  python: 71, // Python 3.8.1
  cpp: 54, // GCC 9.2.0
};

const judge0BaseUrl = (process.env.JUDGE0_BASE_URL ?? process.env.JUDGE0_ENDPOINT)?.replace(/\/$/, "");
const judge0ApiKey = process.env.JUDGE0_API_KEY ?? process.env.JUDGE0_KEY;
const judge0ApiHost = process.env.JUDGE0_API_HOST;

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch (error) {
    console.error("Invalid JSON payload", error);
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }

  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }

  const { questionId, code, language } = payload as {
    questionId?: string;
    code?: string;
    language?: string;
  };

  if (!questionId || !code || !language) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!languageMap[language]) {
    return NextResponse.json({ error: "Unsupported language" }, { status: 400 });
  }

  if (!judge0BaseUrl) {
    return NextResponse.json({ error: "Judge0 API is not configured" }, { status: 500 });
  }

  let supabase;

  try {
    supabase = createSupabaseServiceClient();
  } catch (error) {
    console.error("Supabase service client error", error);
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  const { data: question, error: questionError } = await supabase
    .from("practice_questions")
    .select("id,languages")
    .eq("id", questionId)
    .single();

  if (questionError || !question) {
    console.error("Question lookup failed", questionError);
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  const allowedLanguages = Array.isArray(question.languages)
    ? (question.languages as string[])
    : [];

  if (allowedLanguages.length && !allowedLanguages.includes(language)) {
    return NextResponse.json({ error: "Language not allowed for this question" }, { status: 400 });
  }

  const { data: testcases, error: testcasesError } = await supabase
    .from("practice_testcases")
    .select("id,stdin,expected_output")
    .eq("question_id", questionId)
    .order("id", { ascending: true });

  if (testcasesError || !testcases || testcases.length === 0) {
    console.error("Failed to load testcases", testcasesError);
    return NextResponse.json({ error: "No testcases configured" }, { status: 500 });
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (judge0ApiKey) {
    headers["X-RapidAPI-Key"] = judge0ApiKey;
  }

  if (judge0ApiHost) {
    headers["X-RapidAPI-Host"] = judge0ApiHost;
  }

  const results = [] as Array<{
    id: number;
    status: string;
    stdout: string | null;
    stderr: string | null;
    time: string | null;
    memory: number | null;
    passed: boolean;
  }>;

  for (const testcase of testcases) {
    try {
      const response = await fetch(
        `${judge0BaseUrl}/submissions?base64_encoded=false&wait=true`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            language_id: languageMap[language],
            source_code: code,
            stdin: testcase.stdin,
            expected_output: testcase.expected_output,
          }),
        },
      );

      if (!response.ok) {
        const message = await response.text();
        console.error("Judge0 submission error", message);
        return NextResponse.json({ error: "Judge0 submission failed" }, { status: 502 });
      }

      const submission = (await response.json()) as {
        status?: { description?: string };
        stdout?: string | null;
        stderr?: string | null;
        time?: string | null;
        memory?: number | null;
      };

      const status = submission.status?.description ?? "Unknown";
      const stdout = submission.stdout ?? null;
      const stderr = submission.stderr ?? null;
      const passed = status.toLowerCase() === "accepted";

      results.push({
        id: testcase.id,
        status,
        stdout,
        stderr,
        time: submission.time ?? null,
        memory: submission.memory ?? null,
        passed,
      });

      if (!passed) {
        // Stop early on first failure to provide faster feedback.
        break;
      }
    } catch (error) {
      console.error("Judge0 request error", error);
      return NextResponse.json({ error: "Judge0 request failed" }, { status: 502 });
    }
  }

  const allPassed = results.length > 0 && results.every((result) => result.passed);

  return NextResponse.json({
    passed: allPassed,
    results,
  });
}
