import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServiceClient } from "../../../../lib/supabase-service";

// POST /api/clubs/create — create a new club
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, logo, emblem, privacy, maxMembers, userId } = body;

    if (!name || !userId) {
      return NextResponse.json({ error: "name and userId are required" }, { status: 400 });
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

    // Create club
    const { data: club, error: clubError } = await supabase
      .from("clubs")
      .insert({
        name,
        logo: logo || "⚔️",
        emblem: emblem || "sword",
        privacy: privacy || "public",
        max_members: maxMembers || 20,
        owner_id: userId,
      })
      .select()
      .single();

    if (clubError) {
      return NextResponse.json({ error: clubError.message }, { status: 500 });
    }

    // Add owner as host member
    await supabase.from("club_members").insert({
      club_id: club.id,
      user_id: userId,
      role: "host",
    });

    return NextResponse.json({ club });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
