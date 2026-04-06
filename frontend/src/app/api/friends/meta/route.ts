import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../lib/supabase";
import { createSupabaseServiceClient } from "../../../../lib/supabase-service";

const MAX_IDS = 100;

function parseUserIds(raw: string | null) {
  if (!raw) return [];

  const values = raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  return Array.from(new Set(values)).slice(0, MAX_IDS);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userIds = parseUserIds(url.searchParams.get("userIds"));

  if (userIds.length === 0) {
    return NextResponse.json({ counts: {} }, { status: 200 });
  }

  const supabaseAuth = await createSupabaseServerClient();
  const { data: authData, error: authError } = await supabaseAuth.auth.getUser();

  if (authError || !authData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseServiceClient();

  const [firstHalf, secondHalf] = await Promise.all([
    supabase
      .from("connections")
      .select("user_id,connection_id")
      .eq("status", "accepted")
      .in("user_id", userIds),
    supabase
      .from("connections")
      .select("user_id,connection_id")
      .eq("status", "accepted")
      .in("connection_id", userIds),
  ]);

  if (firstHalf.error || secondHalf.error) {
    return NextResponse.json(
      { error: firstHalf.error?.message ?? secondHalf.error?.message ?? "Failed to load friend counts" },
      { status: 500 },
    );
  }

  const targetSet = new Set(userIds);
  const counts: Record<string, number> = {};

  for (const userId of userIds) {
    counts[userId] = 0;
  }

  for (const row of firstHalf.data ?? []) {
    if (targetSet.has(row.user_id)) {
      counts[row.user_id] = (counts[row.user_id] ?? 0) + 1;
    }
  }

  for (const row of secondHalf.data ?? []) {
    if (targetSet.has(row.connection_id)) {
      counts[row.connection_id] = (counts[row.connection_id] ?? 0) + 1;
    }
  }

  return NextResponse.json({ counts }, { status: 200 });
}
