import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServiceClient } from "../../../../lib/supabase-service";

// POST /api/clubs/join — join a public club or request to join a private one
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clubId, userId } = body;

    if (!clubId || !userId) {
      return NextResponse.json({ error: "clubId and userId are required" }, { status: 400 });
    }

    const supabase = createSupabaseServiceClient();

    // Check if user is already in a club
    const { data: existingMembership } = await supabase
      .from("club_members")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (existingMembership) {
      return NextResponse.json({ error: "You are already in a club. Leave first." }, { status: 400 });
    }

    // Get club details
    const { data: club, error: clubError } = await supabase
      .from("clubs")
      .select("*")
      .eq("id", clubId)
      .single();

    if (clubError || !club) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 });
    }

    // Check member count
    const { count } = await supabase
      .from("club_members")
      .select("id", { count: "exact", head: true })
      .eq("club_id", clubId);

    if ((count ?? 0) >= club.max_members) {
      return NextResponse.json({ error: "Club is full" }, { status: 400 });
    }

    // If private, create join request
    if (club.privacy === "private") {
      const { error: reqError } = await supabase
        .from("club_join_requests")
        .insert({ club_id: clubId, user_id: userId });

      if (reqError) {
        return NextResponse.json({ error: reqError.message }, { status: 500 });
      }

      return NextResponse.json({ status: "request_sent" });
    }

    // Public — join immediately
    const { error: joinError } = await supabase
      .from("club_members")
      .insert({ club_id: clubId, user_id: userId, role: "member" });

    if (joinError) {
      return NextResponse.json({ error: joinError.message }, { status: 500 });
    }

    return NextResponse.json({ status: "joined", club });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
