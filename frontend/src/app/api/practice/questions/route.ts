import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const difficulty = url.searchParams.get("difficulty");

  let supabase;
  try {
    supabase = createSupabaseServerClient();
  } catch (error) {
    console.error("Supabase server client error", error);
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }
  let query = supabase
    .from("practice_questions")
    .select("id,title,slug,difficulty")
    .order("title", { ascending: true });

  if (difficulty) {
    query = query.eq("difficulty", difficulty.toLowerCase());
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch practice questions", error);
    return NextResponse.json({ error: "Failed to load questions" }, { status: 500 });
  }

  return NextResponse.json({ questions: data ?? [] });
}
