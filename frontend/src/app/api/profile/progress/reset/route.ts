import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function POST() {
  let supabase;

  try {
    supabase = await createSupabaseServerClient();
  } catch (error) {
    console.error("Supabase server client error", error);
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 401 });
  }

  if (!user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { error: deleteError } = await supabase
    .from("practice_submissions")
    .delete()
    .eq("user_id", user.id);

  if (deleteError) {
    console.error("Failed to reset user progress", deleteError);
    return NextResponse.json({ error: "Failed to reset progress" }, { status: 500 });
  }

  return NextResponse.json(
    { ok: true, message: "Progress reset" },
    { headers: { "cache-control": "no-store" } },
  );
}
