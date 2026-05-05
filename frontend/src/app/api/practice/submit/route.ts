import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase-service";
import { createSupabaseServerClient } from "@/lib/supabase";

const languageMap: Record<string, { language: string; version: string }> = {
  node: { language: "javascript", version: "18.15.0" },
  javascript: { language: "javascript", version: "18.15.0" },
  python: { language: "python", version: "3.10.0" },
  cpp: { language: "c++", version: "10.2.0" },
  java: { language: "java", version: "15.0.2" },
  c: { language: "c", version: "10.2.0" },
};

const pistonBaseUrl = "https://emkc.org/api/v2/piston";

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

  let supabase;

  try {
    supabase = createSupabaseServiceClient();
  } catch (error) {
    console.error("Supabase service client error", error);
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  const { data: question, error: questionError } = await supabase
    .from("practice_questions")
    .select("id,languages,testcases")
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

  const rawTestcases = Array.isArray(question.testcases)
    ? (question.testcases as Array<{ id?: string; input?: string; output?: string; stdin?: string; expected_output?: string }>)
    : [];

  let normalizedTestcases = rawTestcases.map((testcase, index) => ({
    id: testcase.id ?? `${question.id}-case-${index + 1}`,
    input: testcase.input ?? testcase.stdin ?? "",
    expected: testcase.output ?? testcase.expected_output ?? "",
    index,
  }));

  if (normalizedTestcases.length === 0) {
    const { data: legacyTestcases } = await supabase
      .from("practice_testcases")
      .select("id,stdin,expected_output")
      .eq("question_id", questionId)
      .order("id", { ascending: true });

    normalizedTestcases = (legacyTestcases ?? []).map((testcase, index) => ({
      id: String(testcase.id ?? `${question.id}-legacy-${index + 1}`),
      input: testcase.stdin ?? "",
      expected: testcase.expected_output ?? "",
      index,
    }));
  }

  if (normalizedTestcases.length === 0) {
    console.error("No testcases configured for question", question.id);
    return NextResponse.json({ error: "No testcases configured" }, { status: 500 });
  }

  const results = [] as Array<{
    index: number;
    status: string;
    actual: string;
    stderr: string | null;
    time: string | null;
    memory: number | null;
    passed: boolean;
    expected: string;
    input: string;
  }>;

  for (const testcase of normalizedTestcases) {
    try {
      const runConfig = languageMap[language];
      const response = await fetch(`${pistonBaseUrl}/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: runConfig.language,
          version: runConfig.version,
          files: [
            {
              content: code,
            },
          ],
          stdin: testcase.input,
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        console.error("Piston submission error", message);
        return NextResponse.json({ error: "Code execution failed" }, { status: 502 });
      }

      const submission = (await response.json()) as {
        run?: {
          stdout?: string;
          stderr?: string;
          output?: string;
          code?: number;
          signal?: string;
        };
        compile?: {
          stdout?: string;
          stderr?: string;
          output?: string;
          code?: number;
        };
      };

      const stdout = submission.run?.stdout ?? "";
      const stderr = submission.run?.stderr ?? submission.compile?.stderr ?? null;
      
      // Clean expected and actual to ignore trailing newlines and whitespace differences
      const cleanExpected = testcase.expected.trim().replace(/\r\n/g, "\n");
      const cleanActual = stdout.trim().replace(/\r\n/g, "\n");
      
      const passed = submission.run?.code === 0 && cleanActual === cleanExpected;
      const status = submission.compile?.code !== 0 && submission.compile?.code !== undefined 
          ? "Compilation Error" 
          : submission.run?.code !== 0 
            ? "Runtime Error" 
            : passed ? "Accepted" : "Wrong Answer";

      results.push({
        index: testcase.index,
        status,
        actual: stdout,
        stderr,
        time: null, // Piston free doesn't reliably return execution time
        memory: null, // Piston free doesn't reliably return memory usage
        passed,
        expected: testcase.expected,
        input: testcase.input,
      });

      if (!passed) {
        // Stop early on first failure to provide faster feedback.
        break;
      }
    } catch (error) {
      console.error("Piston request error", error);
      return NextResponse.json({ error: "Code execution request failed" }, { status: 502 });
    }
  }

  const allPassed = results.length > 0 && results.every((result) => result.passed);

  if (allPassed) {
    try {
      const authSupabase = await createSupabaseServerClient();
      const {
        data: { user },
      } = await authSupabase.auth.getUser();

      if (user?.id) {
        // Best-effort write for user progress; do not fail submission response on tracking issues.
        await supabase.from("practice_submissions").insert({
          user_id: user.id,
          question_id: questionId,
          language,
          passed: true,
        });
      }
    } catch {
      // ignore tracking failures
    }
  }

  return NextResponse.json({
    passed: allPassed,
    results,
  });
}
