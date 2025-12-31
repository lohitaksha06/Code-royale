import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";
import { createSupabaseServiceClient } from "@/lib/supabase-service";

export async function GET() {
  const supabaseAuth = createSupabaseServerClient();
  const { data: authData, error: authError } = await supabaseAuth.auth.getUser();

  if (authError || !authData.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let supabase;
  try {
    supabase = createSupabaseServiceClient();
  } catch (error) {
    console.error("Supabase service client error", error);
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  const userId = authData.user.id;

  // Find latest match the user is in.
  const { data: playerRow, error } = await supabase
    .from("match_players")
    .select("match_id")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Failed to check match status", error);
    return NextResponse.json({ matchId: null }, { status: 200 });
  }

  return NextResponse.json({ matchId: playerRow?.match_id ?? null }, { status: 200 });
}
