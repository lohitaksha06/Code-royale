import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";
import { createSupabaseServiceClient } from "@/lib/supabase-service";
import { PVP_QUESTION_SLUGS } from "@/lib/pvp-questions";

type CreateFriendMatchRequest = {
  friendUserId?: string;
  timeLimitSeconds?: number;
  language?: string | null;
};

function sanitizeTimeLimitSeconds(value: unknown) {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return 10 * 60;
  return Math.max(60, Math.min(60 * 60, Math.floor(parsed)));
}

function sanitizeLanguage(value: unknown) {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return null;
  if (["node", "javascript", "python", "cpp", "java", "c"].includes(normalized)) {
    return normalized === "javascript" ? "node" : normalized;
  }
  return null;
}

export async function POST(request: Request) {
  let payload: CreateFriendMatchRequest;

  try {
    payload = (await request.json()) as CreateFriendMatchRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const friendUserId = typeof payload.friendUserId === "string" ? payload.friendUserId.trim() : "";
  if (!friendUserId) {
    return NextResponse.json({ error: "friendUserId is required" }, { status: 400 });
  }

  const timeLimitSeconds = sanitizeTimeLimitSeconds(payload.timeLimitSeconds);
  const language = sanitizeLanguage(payload.language);

  const supabaseAuth = createSupabaseServerClient();
  const { data: authData, error: authError } = await supabaseAuth.auth.getUser();

  if (authError || !authData.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = authData.user.id;
  if (userId === friendUserId) {
    return NextResponse.json({ error: "You cannot invite yourself" }, { status: 400 });
  }

  let supabase;
  try {
    supabase = createSupabaseServiceClient();
  } catch (error) {
    console.error("Supabase service client error", error);
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
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
  // Note: started_at is intentionally null until someone starts the match.
  const { data: matchRow, error: matchError } = await supabase
    .from("matches")
    .insert({
      mode: "unranked",
      metadata: {
        question_id: chosen.id,
        time_limit: timeLimitSeconds,
        language,
        match_type: "1v1",
        friend_invite: {
          inviter_id: userId,
          invitee_id: friendUserId,
        },
        trophy_multiplier: 1,
        started_at: null,
      },
    })
    .select("id")
    .single();

  if (matchError || !matchRow?.id) {
    console.error("Failed to create friend match", matchError);
    return NextResponse.json({ error: "Failed to create match" }, { status: 500 });
  }

  const matchId = matchRow.id as string;

  const { error: playersError } = await supabase.from("match_players").insert([
    { match_id: matchId, user_id: userId },
    { match_id: matchId, user_id: friendUserId },
  ]);

  if (playersError) {
    console.error("Failed to create match players", playersError);
    await supabase.from("matches").delete().eq("id", matchId);
    return NextResponse.json({ error: "Failed to create match players" }, { status: 500 });
  }

  return NextResponse.json({ matchId }, { status: 200 });
}
