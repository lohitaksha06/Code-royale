"use client";

import { useEffect, useMemo, useState } from "react";
import { PracticeScaffold } from "../practice/practice-scaffold";
import { NeonButton } from "../../components/neon-button";
import { supabase } from "../../lib/supabase-browser";

type UserRow = {
  id: string;
  username: string | null;
  rating?: number | null;
};

type ConnectionRow = {
  user_id: string;
  connection_id: string;
  status: "pending" | "accepted" | "blocked";
};

type RelationshipState =
  | "none"
  | "friends"
  | "outgoing_pending"
  | "incoming_pending"
  | "blocked"
  | "blocked_by_other";

function computeRelationship(viewerId: string, otherId: string, rows: ConnectionRow[]) {
  const outgoing = rows.find((row) => row.user_id === viewerId && row.connection_id === otherId);
  const incoming = rows.find((row) => row.user_id === otherId && row.connection_id === viewerId);

  if (outgoing?.status === "blocked") return "blocked";
  if (incoming?.status === "blocked") return "blocked_by_other";
  if (outgoing?.status === "accepted" || incoming?.status === "accepted") return "friends";
  if (outgoing?.status === "pending") return "outgoing_pending";
  if (incoming?.status === "pending") return "incoming_pending";
  return "none";
}

export default function FriendsPage() {
  const [viewerId, setViewerId] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [results, setResults] = useState<UserRow[]>([]);
  const [relationshipByUserId, setRelationshipByUserId] = useState<Record<string, RelationshipState>>({});

  const trimmedQuery = query.trim();
  const canSearch = trimmedQuery.length >= 2;

  useEffect(() => {
    let mounted = true;

    const loadViewer = async () => {
      const { data, error: authError } = await supabase.auth.getUser();
      if (!mounted) return;
      if (authError) {
        setViewerId(null);
        return;
      }
      setViewerId(data.user?.id ?? null);
    };

    void loadViewer();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSearch = async () => {
    if (!canSearch) {
      setError("Type at least 2 characters to search.");
      return;
    }

    setSearching(true);
    setError(null);
    setResults([]);
    setRelationshipByUserId({});

    const { data: userRows, error: usersError } = await supabase
      .from("users")
      .select("id,username,rating")
      .ilike("username", `%${trimmedQuery}%`)
      .order("username", { ascending: true })
      .limit(20);

    if (usersError) {
      setSearching(false);
      setError(usersError.message);
      return;
    }

    const users = (userRows ?? []) as UserRow[];
    setResults(users);

    if (!viewerId || users.length === 0) {
      setSearching(false);
      return;
    }

    const ids = users.map((u) => u.id);

    const filter = `and(user_id.eq.${viewerId},connection_id.in.(${ids.join(",")})),and(connection_id.eq.${viewerId},user_id.in.(${ids.join(",")}))`;
    const { data: connRows, error: connError } = await supabase
      .from("connections")
      .select("user_id,connection_id,status")
      .or(filter);

    if (connError) {
      // Not fatal; still show search results.
      setSearching(false);
      return;
    }

    const rows = (connRows ?? []) as ConnectionRow[];
    const map: Record<string, RelationshipState> = {};
    for (const user of users) {
      map[user.id] = computeRelationship(viewerId, user.id, rows);
    }

    setRelationshipByUserId(map);
    setSearching(false);
  };

  const handleAddOrAccept = async (targetId: string) => {
    if (!viewerId || viewerId === targetId) return;

    setError(null);

    const rel = relationshipByUserId[targetId] ?? "none";

    if (rel === "incoming_pending") {
      const { error: acceptError } = await supabase
        .from("connections")
        .update({ status: "accepted" })
        .eq("user_id", targetId)
        .eq("connection_id", viewerId)
        .eq("status", "pending");

      if (acceptError) {
        setError(acceptError.message);
        return;
      }

      setRelationshipByUserId((prev) => ({ ...prev, [targetId]: "friends" }));
      return;
    }

    const { error: requestError } = await supabase
      .from("connections")
      .insert({ user_id: viewerId, connection_id: targetId, status: "pending" });

    if (requestError) {
      setError(requestError.message);
      return;
    }

    setRelationshipByUserId((prev) => ({ ...prev, [targetId]: "outgoing_pending" }));
  };

  const helperText = useMemo(() => {
    if (!viewerId) return "Sign in to send friend requests.";
    return "Search by username (min 2 characters).";
  }, [viewerId]);

  return (
    <PracticeScaffold defaultSidebarOpen>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 pt-8 sm:px-10 lg:px-12">
        <header className="rounded-3xl border border-[rgba(var(--cr-accent-rgb),0.20)] bg-gradient-to-br from-[#071629] via-[#041021] to-[#020610] p-8 shadow-[0_0_60px_rgba(var(--cr-accent-rgb),0.20)]">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[rgba(var(--cr-accent-rgb),0.75)]">
            Connections
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-sky-50 sm:text-5xl">Search friends</h1>
          <p className="mt-3 max-w-2xl text-sm text-sky-100/70">{helperText}</p>
        </header>

        <section className="rounded-3xl border border-[rgba(var(--cr-accent-rgb),0.20)] bg-[#040b18]/80 p-8 shadow-[0_0_45px_rgba(var(--cr-accent-rgb),0.14)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <label className="flex flex-1 flex-col gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-[rgba(var(--cr-accent-rgb),0.70)]">
              Username
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a username…"
                className="rounded-2xl border border-[rgba(var(--cr-accent-rgb),0.22)] bg-[#050d1a] px-4 py-3 text-sm text-sky-100 focus:border-[rgba(var(--cr-accent-rgb),0.60)] focus:outline-none"
              />
            </label>
            <NeonButton
              className="h-[46px] w-full justify-center md:w-auto"
              disabled={searching || !canSearch}
              onClick={handleSearch}
            >
              {searching ? "Searching…" : "Search"}
            </NeonButton>
          </div>

          {error && (
            <div className="mt-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-100">
              {error}
            </div>
          )}

          <div className="mt-8 grid gap-4">
            {results.map((user) => {
              const username = (user.username ?? "Unknown Pilot").trim() || "Unknown Pilot";
              const isSelf = viewerId && user.id === viewerId;
              const rel = relationshipByUserId[user.id] ?? "none";

              const actionLabel =
                rel === "friends"
                  ? "✅ Friends"
                  : rel === "outgoing_pending"
                    ? "⏳ Pending"
                    : rel === "incoming_pending"
                      ? "✅ Accept"
                      : rel === "blocked" || rel === "blocked_by_other"
                        ? "🚫 Blocked"
                        : "🤝 Add";

              const disabled =
                !viewerId || isSelf || rel === "friends" || rel === "outgoing_pending" || rel === "blocked" || rel === "blocked_by_other";

              return (
                <div
                  key={user.id}
                  className="flex flex-col gap-4 rounded-2xl border border-[rgba(var(--cr-accent-rgb),0.18)] bg-slate-950/50 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate text-lg font-semibold text-sky-50">{username}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.35em] text-sky-100/60">Pilot ID · {user.id}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={`/profile?userId=${user.id}`}
                      className="rounded-full border border-[rgba(var(--cr-accent-rgb),0.25)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-sky-100/80 transition hover:border-[rgba(var(--cr-accent-rgb),0.55)] hover:bg-[rgba(var(--cr-accent-rgb),0.12)]"
                    >
                      View
                    </a>
                    <NeonButton
                      className="px-6 py-2"
                      disabled={disabled}
                      onClick={() => handleAddOrAccept(user.id)}
                    >
                      {isSelf ? "You" : actionLabel}
                    </NeonButton>
                  </div>
                </div>
              );
            })}

            {!searching && results.length === 0 && (
              <div className="rounded-2xl border border-[rgba(var(--cr-accent-rgb),0.14)] bg-slate-950/40 p-5 text-sm text-sky-100/70">
                No results yet. Try searching for a username.
              </div>
            )}
          </div>
        </section>
      </div>
    </PracticeScaffold>
  );
}
