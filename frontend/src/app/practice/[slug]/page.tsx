import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase";
import { PracticeArenaLeetcode } from "@/components/practice-arena-leetcode";

type PageProps = {
  params: { slug: string };
  searchParams?: { timer?: string; language?: string };
};

export default async function PracticeSessionPage({ params, searchParams }: PageProps) {
  const supabase = createSupabaseServerClient();

  const { data: question, error } = await supabase
    .from("practice_questions")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (error || !question) {
    notFound();
  }

  const parsedTimer = Number(searchParams?.timer ?? 300);
  const initialTimer = Number.isFinite(parsedTimer) && parsedTimer > 0 ? parsedTimer : 300;

  const rawLanguages = Array.isArray(question.languages)
    ? (question.languages as string[]).filter((lang): lang is string => typeof lang === "string" && !!lang)
    : ["javascript", "python", "cpp"];

  const languages = rawLanguages.length > 0 ? rawLanguages : ["javascript", "python", "cpp"];

  const requestedLanguage = searchParams?.language;
  const initialLanguage = requestedLanguage && languages.includes(requestedLanguage)
    ? requestedLanguage
    : languages[0] ?? "javascript";

  const rawTestcases = Array.isArray(question.testcases)
    ? (question.testcases as Array<{ id?: string; input?: string; output?: string; stdin?: string; expected_output?: string }>)
    : [];

  let testcases = rawTestcases.map((testcase, index) => ({
    id: testcase.id ?? `${question.id}-case-${index + 1}`,
    input: testcase.input ?? testcase.stdin ?? "",
    output: testcase.output ?? testcase.expected_output ?? "",
  }));

  if (testcases.length === 0) {
    const { data: legacyTestcases } = await supabase
      .from("practice_testcases")
      .select("id,stdin,expected_output")
      .eq("question_id", question.id)
      .order("id", { ascending: true });

    testcases = (legacyTestcases ?? []).map((testcase, index) => ({
      id: String(testcase.id ?? `${question.id}-legacy-${index + 1}`),
      input: testcase.stdin ?? "",
      output: testcase.expected_output ?? "",
    }));
  }

  const meta = question.meta && typeof question.meta === "object" ? question.meta : null;

  return (
    <PracticeArenaLeetcode
      question={{
        id: question.id,
        title: question.title,
        description: question.description,
        difficulty: question.difficulty,
        languages,
        meta: meta as {
          timeComplexity?: string | null;
          spaceComplexity?: string | null;
          topics?: string[] | null;
        } | null,
      }}
      testcases={testcases}
      initialTimer={initialTimer}
      initialLanguage={initialLanguage}
    />
  );
}
