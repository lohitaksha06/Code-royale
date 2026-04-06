"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AppShell } from "../../components/app-shell";
import { supabase } from "../../lib/supabase-browser";

export const dynamic = "force-dynamic";

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

type ActiveTab = "search" | "friends" | "pending";

type FriendListItem = {
  id: string;
  username: string;
  rating: number;
  friendCount: number;
};

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

function FriendsContent() {
  const searchParams = useSearchParams();

  const [viewerId, setViewerId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [loadingConnections, setLoadingConnections] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<UserRow[]>([]);
  const [connectionRows, setConnectionRows] = useState<ConnectionRow[]>([]);
  const [friends, setFriends] = useState<FriendListItem[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<FriendListItem[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<FriendListItem[]>([]);
  const [relationshipByUserId, setRelationshipByUserId] = useState<Record<string, RelationshipState>>({});
  const [friendCountByUserId, setFriendCountByUserId] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<ActiveTab>("friends");

  const trimmedQuery = query.trim();
  const canSearch = trimmedQuery.length >= 2;

  const getDisplayName = (value: string | null | undefined) => {
    const trimmed = value?.trim();
    return trimmed && trimmed.length > 0 ? trimmed : "Unknown";
  };

  const loadFriendCounts = async (userIds: string[]) => {
    if (userIds.length === 0) {
      return {} as Record<string, number>;
    }

    const response = await fetch(`/api/friends/meta?userIds=${encodeURIComponent(userIds.join(","))}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return {} as Record<string, number>;
    }

    const payload = (await response.json()) as { counts?: Record<string, number> };
    return payload.counts ?? {};
  };

  const buildRelationshipMap = (users: UserRow[], rows: ConnectionRow[], currentViewerId: string) => {
    const relMap: Record<string, RelationshipState> = {};
    for (const user of users) {
      if (user.id === currentViewerId) {
        relMap[user.id] = "none";
      } else {
        relMap[user.id] = computeRelationship(currentViewerId, user.id, rows);
      }
    }
    return relMap;
  };

  const loadConnections = async (currentViewerId: string) => {
    setLoadingConnections(true);

    const { data: rowsData, error: rowsError } = await supabase
      .from("connections")
      .select("user_id,connection_id,status")
      .or(`user_id.eq.${currentViewerId},connection_id.eq.${currentViewerId}`);

    if (rowsError) {
      setError(rowsError.message);
      setConnectionRows([]);
      setFriends([]);
      setIncomingRequests([]);
      setOutgoingRequests([]);
      setLoadingConnections(false);
      return;
    }

    const rows = (rowsData ?? []) as ConnectionRow[];
    setConnectionRows(rows);

    const incomingIds = rows
      .filter((row) => row.status === "pending" && row.connection_id === currentViewerId)
      .map((row) => row.user_id);

    const outgoingIds = rows
      .filter((row) => row.status === "pending" && row.user_id === currentViewerId)
      .map((row) => row.connection_id);

    const friendIds = rows
      .filter((row) => row.status === "accepted")
      .map((row) => (row.user_id === currentViewerId ? row.connection_id : row.user_id))
      .filter((id) => id !== currentViewerId);

    const uniqueIds = Array.from(new Set([...incomingIds, ...outgoingIds, ...friendIds]));

    if (uniqueIds.length === 0) {
      setFriends([]);
      setIncomingRequests([]);
      setOutgoingRequests([]);
      setLoadingConnections(false);
      return;
    }

    const { data: usersData, error: usersError } = await supabase
      .from("users")
      .select("id,username,rating")
      .in("id", uniqueIds);

    if (usersError) {
      setError(usersError.message);
      setFriends([]);
      setIncomingRequests([]);
      setOutgoingRequests([]);
      setLoadingConnections(false);
      return;
    }

    const users = (usersData ?? []) as UserRow[];
    const userMap = new Map(users.map((user) => [user.id, user]));
    const counts = await loadFriendCounts(uniqueIds);
    setFriendCountByUserId((prev) => ({ ...prev, ...counts }));

    const toListItem = (userId: string): FriendListItem => {
      const user = userMap.get(userId);
      return {
        id: userId,
        username: getDisplayName(user?.username),
        rating: typeof user?.rating === "number" ? user.rating : 0,
        friendCount: counts[userId] ?? 0,
      };
    };

    const sortByName = (a: FriendListItem, b: FriendListItem) => a.username.localeCompare(b.username);

    setIncomingRequests(incomingIds.map(toListItem).sort(sortByName));
    setOutgoingRequests(outgoingIds.map(toListItem).sort(sortByName));
    setFriends(friendIds.map(toListItem).sort(sortByName));
    setLoadingConnections(false);
  };

  useEffect(() => {
    let mounted = true;
    const loadViewer = async () => {
      const { data, error: authError } = await supabase.auth.getUser();
      if (!mounted) return;
      if (authError) {
        setViewerId(null);
        setLoadingConnections(false);
        return;
      }

      const currentViewerId = data.user?.id ?? null;
      setViewerId(currentViewerId);

      if (currentViewerId) {
        await loadConnections(currentViewerId);
      } else {
        setLoadingConnections(false);
      }
    };
    void loadViewer();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const requestedTab = searchParams.get("tab");
    if (requestedTab === "friends" || requestedTab === "pending" || requestedTab === "search") {
      setActiveTab(requestedTab);
    }
  }, [searchParams]);

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

    const counts = await loadFriendCounts(users.map((user) => user.id));
    setFriendCountByUserId((prev) => ({ ...prev, ...counts }));

    if (!viewerId || users.length === 0) {
      setSearching(false);
      return;
    }

    setRelationshipByUserId(buildRelationshipMap(users, connectionRows, viewerId));
    setSearching(false);
  };

  const handleAddFriend = async (userId: string) => {
    if (!viewerId) return;
    const { error: requestError } = await supabase
      .from("connections")
      .insert({ user_id: viewerId, connection_id: userId, status: "pending" });

    if (requestError) {
      setError(requestError.message);
      return;
    }

    await loadConnections(viewerId);
    setRelationshipByUserId((prev) => ({ ...prev, [userId]: "outgoing_pending" }));
  };

  const handleAccept = async (userId: string) => {
    if (!viewerId) return;
    const { error: acceptError } = await supabase
      .from("connections")
      .update({ status: "accepted" })
      .match({ user_id: userId, connection_id: viewerId });

    if (acceptError) {
      setError(acceptError.message);
      return;
    }

    await loadConnections(viewerId);
    setRelationshipByUserId((prev) => ({ ...prev, [userId]: "friends" }));
  };

  const handleDecline = async (userId: string) => {
    if (!viewerId) return;

    const { error: declineError } = await supabase
      .from("connections")
      .delete()
      .match({ user_id: userId, connection_id: viewerId, status: "pending" });

    if (declineError) {
      setError(declineError.message);
      return;
    }

    await loadConnections(viewerId);
    setRelationshipByUserId((prev) => ({ ...prev, [userId]: "none" }));
  };

  const handleCancelOutgoing = async (userId: string) => {
    if (!viewerId) return;

    const { error: cancelError } = await supabase
      .from("connections")
      .delete()
      .match({ user_id: viewerId, connection_id: userId, status: "pending" });

    if (cancelError) {
      setError(cancelError.message);
      return;
    }

    await loadConnections(viewerId);
    setRelationshipByUserId((prev) => ({ ...prev, [userId]: "none" }));
  };

  const incomingCount = incomingRequests.length;

  const renderUserLine = (user: FriendListItem, kind: "incoming" | "outgoing" | "friend") => {
    const isSelf = user.id === viewerId;
    const profileHref = isSelf ? "/profile" : `/profile?userId=${user.id}`;

    return (
      <div
        key={`${kind}-${user.id}`}
        className="flex items-center justify-between rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] px-4 py-3"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(var(--cr-accent-rgb),0.2)] text-sm font-medium text-[rgb(var(--cr-accent-rgb))]">
            {user.username[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Link href={profileHref} className="text-sm font-medium text-[var(--cr-fg)] hover:underline">
                {user.username}
              </Link>
              {kind === "friend" && (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11c1.657 0 3-1.567 3-3.5S17.657 4 16 4s-3 1.567-3 3.5 1.343 3.5 3 3.5zM8 11c1.657 0 3-1.567 3-3.5S9.657 4 8 4 5 5.567 5 7.5 6.343 11 8 11zm0 2c-2.761 0-5 2.015-5 4.5V20h10v-2.5c0-2.485-2.239-4.5-5-4.5zm8 0a5.76 5.76 0 00-1.16.118A6.52 6.52 0 0119 17.5V20h5v-2.5c0-2.485-2.239-4.5-5-4.5z" />
                  </svg>
                  Friends
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--cr-fg-muted)]">Rating: {user.rating}</p>
            <p className="text-xs text-[var(--cr-fg-muted)]">Friends: {user.friendCount}</p>
          </div>
        </div>

        {kind === "incoming" && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAccept(user.id)}
              className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500"
            >
              Accept
            </button>
            <button
              onClick={() => handleDecline(user.id)}
              className="rounded-md border border-[var(--cr-border)] bg-[var(--cr-bg)] px-3 py-1.5 text-xs font-medium text-[var(--cr-fg)] hover:bg-[var(--cr-bg-tertiary)]"
            >
              Decline
            </button>
          </div>
        )}
        {kind === "outgoing" && (
          <button
            onClick={() => handleCancelOutgoing(user.id)}
            className="rounded-md border border-[var(--cr-border)] bg-[var(--cr-bg)] px-3 py-1.5 text-xs font-medium text-[var(--cr-fg)] hover:bg-[var(--cr-bg-tertiary)]"
          >
            Cancel Request
          </button>
        )}
        {kind === "friend" && (
          <span className="text-xs text-emerald-400">Friends</span>
        )}
      </div>
    );
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
            { id: "pending", label: `Pending${incomingCount > 0 ? ` (${incomingCount})` : ""}` },
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
                          <div className="flex items-center gap-2">
                            <Link
                              href={isSelf ? "/profile" : `/profile?userId=${user.id}`}
                              className="text-sm font-medium text-[var(--cr-fg)] hover:underline"
                            >
                              {user.username ?? "Unknown"}
                            </Link>
                            {relationship === "friends" && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11c1.657 0 3-1.567 3-3.5S17.657 4 16 4s-3 1.567-3 3.5 1.343 3.5 3 3.5zM8 11c1.657 0 3-1.567 3-3.5S9.657 4 8 4 5 5.567 5 7.5 6.343 11 8 11zm0 2c-2.761 0-5 2.015-5 4.5V20h10v-2.5c0-2.485-2.239-4.5-5-4.5zm8 0a5.76 5.76 0 00-1.16.118A6.52 6.52 0 0119 17.5V20h5v-2.5c0-2.485-2.239-4.5-5-4.5z" />
                                </svg>
                                Friends
                              </span>
                            )}
                          </div>
                          {user.rating !== undefined && (
                            <p className="text-xs text-[var(--cr-fg-muted)]">Rating: {user.rating ?? 0}</p>
                          )}
                          <p className="text-xs text-[var(--cr-fg-muted)]">
                            Friends: {friendCountByUserId[user.id] ?? 0}
                          </p>
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
                No users found matching &quot;{trimmedQuery}&quot;
              </div>
            )}
          </div>
        )}

        {/* Friends Tab */}
        {activeTab === "friends" && (
          <div className="space-y-3">
            {loadingConnections && (
              <div className="rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] p-6 text-center text-sm text-[var(--cr-fg-muted)]">
                Loading friends...
              </div>
            )}
            {!loadingConnections && friends.length === 0 && (
              <div className="rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] p-8 text-center">
                <p className="text-sm text-[var(--cr-fg-muted)]">No friends yet</p>
                <button
                  onClick={() => setActiveTab("search")}
                  className="mt-4 text-sm text-[rgb(var(--cr-accent-rgb))] hover:underline"
                >
                  Search for players →
                </button>
              </div>
            )}
            {!loadingConnections && friends.length > 0 && friends.map((user) => renderUserLine(user, "friend"))}
          </div>
        )}

        {/* Pending Tab */}
        {activeTab === "pending" && (
          <div className="space-y-6">
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--cr-fg)]">
                Incoming Requests
              </h2>
              <div className="space-y-3">
                {incomingRequests.length === 0 ? (
                  <div className="rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] p-5 text-sm text-[var(--cr-fg-muted)]">
                    No incoming requests.
                  </div>
                ) : (
                  incomingRequests.map((user) => renderUserLine(user, "incoming"))
                )}
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--cr-fg)]">
                Sent By You
              </h2>
              <div className="space-y-3">
                {outgoingRequests.length === 0 ? (
                  <div className="rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] p-5 text-sm text-[var(--cr-fg-muted)]">
                    No outgoing requests.
                  </div>
                ) : (
                  outgoingRequests.map((user) => renderUserLine(user, "outgoing"))
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default function FriendsPage() {
  return (
    <Suspense
      fallback={
        <AppShell>
          <div className="mx-auto max-w-3xl p-6">
            <div className="rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] p-6 text-sm text-[var(--cr-fg-muted)]">
              Loading friends...
            </div>
          </div>
        </AppShell>
      }
    >
      <FriendsContent />
    </Suspense>
  );
}
