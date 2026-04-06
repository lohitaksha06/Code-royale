"use client";

import { useEffect, useMemo, useState } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "./supabase-browser";

type ConnectionRow = {
  user_id: string;
  connection_id: string;
  status: "pending" | "accepted" | "blocked";
};

type UserRow = {
  id: string;
  username: string | null;
};

export type FriendPresenceRow = {
  id: string;
  username: string;
  online: boolean;
};

export function useFriendPresence() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewerId, setViewerId] = useState<string | null>(null);
  const [friendRows, setFriendRows] = useState<Array<{ id: string; username: string }>>([]);
  const [onlineIds, setOnlineIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let mounted = true;
    let channel: RealtimeChannel | null = null;

    const setup = async () => {
      setLoading(true);
      setError(null);

      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (!mounted) return;

      if (authError || !authData.user?.id) {
        setViewerId(null);
        setFriendRows([]);
        setOnlineIds(new Set());
        setLoading(false);
        return;
      }

      const currentViewerId = authData.user.id;
      setViewerId(currentViewerId);

      const { data: connectionRows, error: connError } = await supabase
        .from("connections")
        .select("user_id,connection_id,status")
        .or(`user_id.eq.${currentViewerId},connection_id.eq.${currentViewerId}`)
        .eq("status", "accepted");

      if (!mounted) return;
      if (connError) {
        setError(connError.message);
        setFriendRows([]);
        setLoading(false);
        return;
      }

      const rows = (connectionRows ?? []) as ConnectionRow[];
      const friendIds = Array.from(
        new Set(
          rows
            .map((row) => (row.user_id === currentViewerId ? row.connection_id : row.user_id))
            .filter(Boolean),
        ),
      );

      if (friendIds.length === 0) {
        setFriendRows([]);
      } else {
        const { data: usersData, error: usersError } = await supabase
          .from("users")
          .select("id,username")
          .in("id", friendIds);

        if (!mounted) return;
        if (usersError) {
          setError(usersError.message);
          setFriendRows([]);
          setLoading(false);
          return;
        }

        const mapped = ((usersData ?? []) as UserRow[])
          .map((row) => ({
            id: row.id,
            username: row.username?.trim() || "Unknown Pilot",
          }))
          .sort((a, b) => a.username.localeCompare(b.username));

        setFriendRows(mapped);
      }

      channel = supabase.channel("global-friend-presence", {
        config: { presence: { key: currentViewerId } },
      });

      channel.on("presence", { event: "sync" }, () => {
        const state = channel?.presenceState() ?? {};
        const present = new Set(Object.keys(state));
        if (!mounted) return;
        setOnlineIds(present);
      });

      channel.subscribe(async (status) => {
        if (status !== "SUBSCRIBED") return;

        await channel?.track({
          user_id: currentViewerId,
          seen_at: new Date().toISOString(),
        });
      });

      setLoading(false);
    };

    void setup();

    return () => {
      mounted = false;
      if (channel) {
        void supabase.removeChannel(channel);
      }
    };
  }, []);

  const friends = useMemo<FriendPresenceRow[]>(() => {
    return friendRows.map((friend) => ({
      ...friend,
      online: onlineIds.has(friend.id),
    }));
  }, [friendRows, onlineIds]);

  const onlineFriendIds = useMemo(() => {
    return friends.filter((friend) => friend.online).map((friend) => friend.id);
  }, [friends]);

  return {
    loading,
    error,
    viewerId,
    friends,
    onlineFriendIds,
  };
}
