"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "../../components/app-shell";
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
  const [activeTab, setActiveTab] = useState<"search" | "friends" | "pending">("friends");

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
    return () => { mounted = false; };
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

    const otherIds = users.map((u) => u.id).filter((id) => id !== viewerId);
    if (otherIds.length === 0) {
      setSearching(false);
      return;
    }

    const { data: connRows, error: connError } = await supabase
      .from("connections")
      .select("user_id,connection_id,status")
      .or(`user_id.eq.${viewerId},connection_id.eq.${viewerId}`)
      .in("connection_id", [...otherIds, viewerId])
      .in("user_id", [...otherIds, viewerId]);

    if (connError) {
      setSearching(false);
      return;
    }

    const rows = (connRows ?? []) as ConnectionRow[];
    const relMap: Record<string, RelationshipState> = {};
    for (const user of users) {
      if (user.id === viewerId) {
        relMap[user.id] = "none";
      } else {
        relMap[user.id] = computeRelationship(viewerId, user.id, rows);
      }
    }
    setRelationshipByUserId(relMap);
    setSearching(false);
  };

  const handleAddFriend = async (userId: string) => {
    if (!viewerId) return;
    await supabase.from("connections").insert({ user_id: viewerId, connection_id: userId, status: "pending" });
    setRelationshipByUserId((prev) => ({ ...prev, [userId]: "outgoing_pending" }));
  };

  const handleAccept = async (userId: string) => {
    if (!viewerId) return;
    await supabase.from("connections").update({ status: "accepted" }).match({ user_id: userId, connection_id: viewerId });
    setRelationshipByUserId((prev) => ({ ...prev, [userId]: "friends" }));
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--cr-fg)]">Friends</h1>
          <p className="mt-1 text-sm text-[var(--cr-fg-muted)]">
            Search for players and manage your connections.
          </p>
        </header>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-lg bg-[var(--cr-bg-secondary)] p-1">
          {[
            { id: "friends", label: "Friends" },
            { id: "pending", label: "Pending" },
            { id: "search", label: "Search" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-[var(--cr-bg)] text-[var(--cr-fg)]"
                  : "text-[var(--cr-fg-muted)] hover:text-[var(--cr-fg)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Tab */}
        {activeTab === "search" && (
          <div className="space-y-4">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Search by username..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg)] px-4 py-2.5 text-sm text-[var(--cr-fg)] placeholder:text-[var(--cr-fg-muted)] focus:border-[rgba(var(--cr-accent-rgb),0.5)] focus:outline-none"
              />
              <button
                onClick={handleSearch}
                disabled={!canSearch || searching}
                className="rounded-lg bg-[rgb(var(--cr-accent-rgb))] px-5 py-2.5 text-sm font-medium text-[var(--cr-bg)] transition-all hover:opacity-90 disabled:opacity-50"
              >
                {searching ? "..." : "Search"}
              </button>
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {results.length > 0 && (
              <div className="rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)]">
                {results.map((user, i) => {
                  const relationship = relationshipByUserId[user.id] ?? "none";
                  const isSelf = user.id === viewerId;

                  return (
                    <div
                      key={user.id}
                      className={`flex items-center justify-between p-4 ${
                        i !== results.length - 1 ? "border-b border-[var(--cr-border)]" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(var(--cr-accent-rgb),0.2)] text-sm font-medium text-[rgb(var(--cr-accent-rgb))]">
                          {(user.username ?? "?")[0].toUpperCase()}
                        </div>
                        <div>
                          <Link
                            href={`/profile?userId=${user.id}`}
                            className="text-sm font-medium text-[var(--cr-fg)] hover:underline"
                          >
                            {user.username ?? "Unknown"}
                          </Link>
                          {user.rating !== undefined && (
                            <p className="text-xs text-[var(--cr-fg-muted)]">Rating: {user.rating ?? 0}</p>
                          )}
                        </div>
                      </div>
                      {!isSelf && (
                        <div>
                          {relationship === "none" && (
                            <button
                              onClick={() => handleAddFriend(user.id)}
                              className="rounded-md border border-[var(--cr-border)] bg-[var(--cr-bg)] px-3 py-1.5 text-xs font-medium text-[var(--cr-fg)] hover:bg-[var(--cr-bg-tertiary)]"
                            >
                              Add Friend
                            </button>
                          )}
                          {relationship === "outgoing_pending" && (
                            <span className="text-xs text-[var(--cr-fg-muted)]">Request Sent</span>
                          )}
                          {relationship === "incoming_pending" && (
                            <button
                              onClick={() => handleAccept(user.id)}
                              className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500"
                            >
                              Accept
                            </button>
                          )}
                          {relationship === "friends" && (
                            <span className="text-xs text-emerald-400">Friends</span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {results.length === 0 && !searching && trimmedQuery.length >= 2 && (
              <div className="rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] p-8 text-center text-sm text-[var(--cr-fg-muted)]">
                No users found matching "{trimmedQuery}"
              </div>
            )}
          </div>
        )}

        {/* Friends Tab */}
        {activeTab === "friends" && (
          <div className="rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-[var(--cr-fg-muted)] opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
            <p className="mt-3 text-sm text-[var(--cr-fg-muted)]">No friends yet</p>
            <button
              onClick={() => setActiveTab("search")}
              className="mt-4 text-sm text-[rgb(var(--cr-accent-rgb))] hover:underline"
            >
              Search for players →
            </button>
          </div>
        )}

        {/* Pending Tab */}
        {activeTab === "pending" && (
          <div className="rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-[var(--cr-fg-muted)] opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-3 text-sm text-[var(--cr-fg-muted)]">No pending requests</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
