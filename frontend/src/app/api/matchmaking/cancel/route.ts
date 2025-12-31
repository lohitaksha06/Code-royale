import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";
import { createSupabaseServiceClient } from "@/lib/supabase-service";

export async function POST() {
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

  const { error } = await supabase.from("matchmaking_queue").delete().eq("user_id", authData.user.id);

  if (error) {
    console.error("Failed to cancel matchmaking", error);
    return NextResponse.json({ error: "Failed to cancel" }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
