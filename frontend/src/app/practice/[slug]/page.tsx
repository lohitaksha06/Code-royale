import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase";
import { PracticeArenaShell } from "./practice-arena-shell";
import { PracticeScaffold } from "../practice-scaffold";

type PageProps = {
  params: { slug: string };
  searchParams?: { timer?: string; language?: string };
};

export default async function PracticeSessionPage({ params, searchParams }: PageProps) {
  const supabase = createSupabaseServerClient();

  const { data: question, error } = await supabase
    .from("practice_questions")
    .select("id,title,description,difficulty,sample_input,sample_output,languages")
    .eq("slug", params.slug)
    .single();

  if (error || !question) {
    notFound();
  }

  const parsedTimer = Number(searchParams?.timer ?? 300);
  const initialTimer = Number.isFinite(parsedTimer) && parsedTimer > 0 ? parsedTimer : 300;

  const languages = Array.isArray(question.languages)
    ? (question.languages as string[])
    : ["javascript", "python", "cpp"];

  const requestedLanguage = searchParams?.language;
  const initialLanguage = requestedLanguage && languages.includes(requestedLanguage)
    ? requestedLanguage
    : languages[0];

  return (
    <PracticeScaffold>
      <PracticeArenaShell
        question={{
          id: question.id,
          title: question.title,
          description: question.description,
          difficulty: question.difficulty,
          sampleInput: question.sample_input,
          sampleOutput: question.sample_output,
          languages,
        }}
        initialTimer={initialTimer}
        initialLanguage={initialLanguage}
      />
    </PracticeScaffold>
  );
}
