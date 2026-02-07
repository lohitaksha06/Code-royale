import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServiceClient } from "../../../../lib/supabase-service";

// POST /api/clubs/leave — leave a club
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const supabase = createSupabaseServiceClient();

    // Get current membership
    const { data: membership, error: memError } = await supabase
      .from("club_members")
      .select("id, club_id, role")
      .eq("user_id", userId)
      .maybeSingle();

    if (!membership) {
      return NextResponse.json({ error: "You are not in a club" }, { status: 400 });
    }

    // If user is host, delete the entire club (or transfer ownership)
    if (membership.role === "host") {
      // Check if there are other members
      const { count } = await supabase
        .from("club_members")
        .select("id", { count: "exact", head: true })
        .eq("club_id", membership.club_id)
        .neq("user_id", userId);

      if ((count ?? 0) > 0) {
        // Transfer host to the first remaining member
        const { data: nextHost } = await supabase
          .from("club_members")
          .select("id, user_id")
          .eq("club_id", membership.club_id)
          .neq("user_id", userId)
          .order("joined_at", { ascending: true })
          .limit(1)
          .single();

        if (nextHost) {
          await supabase
            .from("club_members")
            .update({ role: "host" })
            .eq("id", nextHost.id);

          await supabase
            .from("clubs")
            .update({ owner_id: nextHost.user_id })
            .eq("id", membership.club_id);
        }
      } else {
        // No other members — delete the club
        await supabase.from("clubs").delete().eq("id", membership.club_id);
      }
    }

    // Remove membership
    await supabase.from("club_members").delete().eq("id", membership.id);

    return NextResponse.json({ status: "left" });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
