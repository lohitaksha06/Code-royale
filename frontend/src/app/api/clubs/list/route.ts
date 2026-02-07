import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServiceClient } from "../../../../lib/supabase-service";

// GET /api/clubs/list — list clubs with optional search, including member counts & top players
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const userId = searchParams.get("userId") || "";

    const supabase = createSupabaseServiceClient();

    // Get clubs sorted by trophies
    let query = supabase
      .from("clubs")
      .select("*")
      .order("trophies", { ascending: false })
      .limit(50);

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    const { data: clubs, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Enrich each club with member count and top 3 players
    const enriched = await Promise.all(
      (clubs ?? []).map(async (club) => {
        const { count } = await supabase
          .from("club_members")
          .select("id", { count: "exact", head: true })
          .eq("club_id", club.id);

        const { data: topMembers } = await supabase
          .from("club_members")
          .select("user_id, role, trophies_contributed")
          .eq("club_id", club.id)
          .order("trophies_contributed", { ascending: false })
          .limit(3);

        // Get player stats for top members
        const topPlayers = await Promise.all(
          (topMembers ?? []).map(async (m) => {
            const { data: ps } = await supabase
              .from("player_stats")
              .select("username, avatar_url")
              .eq("user_id", m.user_id)
              .maybeSingle();

            return {
              id: m.user_id,
              username: ps?.username ?? "Player",
              avatar: (ps?.username ?? "P").substring(0, 2).toUpperCase(),
              trophies: m.trophies_contributed,
              role: m.role,
            };
          })
        );

        return {
          ...club,
          memberCount: count ?? 0,
          topPlayers,
        };
      })
    );

    // If userId provided, also check if the user is in a club
    let myClub = null;
    if (userId) {
      const { data: membership } = await supabase
        .from("club_members")
        .select("club_id")
        .eq("user_id", userId)
        .maybeSingle();

      if (membership) {
        myClub = enriched.find((c) => c.id === membership.club_id) ?? null;
      }
    }

    return NextResponse.json({ clubs: enriched, myClub });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
