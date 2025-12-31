import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";
import { createSupabaseServiceClient } from "@/lib/supabase-service";
import { PVP_QUESTION_SLUGS } from "@/lib/pvp-questions";

type JoinRequest = {
  mode?: "ranked" | "unranked";
  timeLimitSeconds?: number;
};

function sanitizeTimeLimitSeconds(value: unknown) {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return 8 * 60;
  return Math.max(60, Math.min(30 * 60, Math.floor(parsed)));
}

export async function POST(request: Request) {
  let payload: JoinRequest;

  try {
    payload = (await request.json()) as JoinRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const mode = payload.mode === "ranked" || payload.mode === "unranked" ? payload.mode : "ranked";
  const timeLimitSeconds = sanitizeTimeLimitSeconds(payload.timeLimitSeconds);

  const supabaseAuth = createSupabaseServerClient();
  const { data: authData, error: authError } = await supabaseAuth.auth.getUser();

  if (authError || !authData.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = authData.user.id;

  let supabase;
  try {
    supabase = createSupabaseServiceClient();
  } catch (error) {
    console.error("Supabase service client error", error);
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  // Ensure the user has only one active queue entry.
  await supabase.from("matchmaking_queue").delete().eq("user_id", userId);

  const { error: enqueueError } = await supabase
    .from("matchmaking_queue")
    .insert({ user_id: userId, mode });

  if (enqueueError) {
    console.error("Failed to enqueue", enqueueError);
    return NextResponse.json({ error: "Failed to join matchmaking" }, { status: 500 });
  }

  const { data: opponentRow, error: opponentError } = await supabase
    .from("matchmaking_queue")
    .select("user_id,mode")
    .eq("mode", mode)
    .neq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (opponentError) {
    console.error("Failed to query matchmaking queue", opponentError);
    return NextResponse.json({ status: "queued" }, { status: 200 });
  }

  if (!opponentRow?.user_id) {
    // Nobody to match with right now.
    return NextResponse.json({ status: "queued" }, { status: 200 });
  }

  // Pick a PvP question from the curated slug list.
  const { data: availableQuestions, error: questionsError } = await supabase
    .from("practice_questions")
    .select("id,slug")
    .in("slug", PVP_QUESTION_SLUGS);

  if (questionsError || !availableQuestions || availableQuestions.length === 0) {
    console.error("No PvP questions available", questionsError);
    return NextResponse.json({ error: "PvP questions are not seeded yet" }, { status: 500 });
  }

  const chosen = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];

  // Create match + players.
  const startedAt = new Date().toISOString();
  const { data: matchRow, error: matchError } = await supabase
    .from("matches")
    .insert({
      mode,
      metadata: {
        question_id: chosen.id,
        time_limit: timeLimitSeconds,
        started_at: startedAt,
      },
    })
    .select("id")
    .single();

  if (matchError || !matchRow?.id) {
    console.error("Failed to create match", matchError);
    return NextResponse.json({ error: "Failed to create match" }, { status: 500 });
  }

  const matchId = matchRow.id as string;

  const { error: playersError } = await supabase.from("match_players").insert([
    { match_id: matchId, user_id: userId },
    { match_id: matchId, user_id: opponentRow.user_id },
  ]);

  if (playersError) {
    console.error("Failed to create match players", playersError);
    // Best-effort cleanup.
    await supabase.from("matches").delete().eq("id", matchId);
    return NextResponse.json({ error: "Failed to create match players" }, { status: 500 });
  }

  // Remove both from queue.
  await supabase
    .from("matchmaking_queue")
    .delete()
    .in("user_id", [userId, opponentRow.user_id]);

  return NextResponse.json({ matchId }, { status: 200 });
}
