import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../lib/supabase";
import { createSupabaseServiceClient } from "../../../../lib/supabase-service";

type ManageRequest = {
  action?: "block" | "unblock";
  targetUserId?: string;
};

export async function POST(request: Request) {
  const supabaseAuth = await createSupabaseServerClient();
  const { data: authData, error: authError } = await supabaseAuth.auth.getUser();

  if (authError || !authData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: ManageRequest;
  try {
    payload = (await request.json()) as ManageRequest;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const viewerId = authData.user.id;
  const targetUserId = payload.targetUserId?.trim();
  const action = payload.action;

  if (!targetUserId) {
    return NextResponse.json({ error: "targetUserId is required" }, { status: 400 });
  }

  if (targetUserId === viewerId) {
    return NextResponse.json({ error: "Cannot perform this action on yourself" }, { status: 400 });
  }

  if (action !== "block" && action !== "unblock") {
    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  }

  const supabase = createSupabaseServiceClient();

  if (action === "block") {
    const { error: cleanupError } = await supabase
      .from("connections")
      .delete()
      .or(`and(user_id.eq.${viewerId},connection_id.eq.${targetUserId}),and(user_id.eq.${targetUserId},connection_id.eq.${viewerId})`);

    if (cleanupError) {
      return NextResponse.json({ error: cleanupError.message }, { status: 500 });
    }

    const { error: insertError } = await supabase
      .from("connections")
      .insert({ user_id: viewerId, connection_id: targetUserId, status: "blocked" });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, relationship: "blocked" }, { status: 200 });
  }

  const { error: unblockError } = await supabase
    .from("connections")
    .delete()
    .match({ user_id: viewerId, connection_id: targetUserId, status: "blocked" });

  if (unblockError) {
    return NextResponse.json({ error: unblockError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, relationship: "none" }, { status: 200 });
}
