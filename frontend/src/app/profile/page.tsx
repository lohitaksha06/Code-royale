"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { AppShell } from "../../components/app-shell";
import { supabase } from "../../lib/supabase-browser";

type UserRow = {
  id: string;
  username: string | null;
  rating: number | null;
  wins: number | null;
  losses: number | null;
  team_name?: string | null;
  club_id?: string | null;
  club_name?: string | null;
  club_logo?: string | null;
  club_trophies?: number | null;
};

function getRankFromRating(rating: number) {
  if (rating >= 600) return { name: "Gold", color: "text-amber-400" };
  if (rating >= 400) return { name: "Silver", color: "text-slate-300" };
  if (rating >= 200) return { name: "Bronze", color: "text-orange-400" };
  return { name: "Unranked", color: "text-[var(--cr-fg-muted)]" };
}

function initialsFromName(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return "CR";
  const parts = trimmed.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "C";
  const second = parts.length > 1 ? parts[1]?.[0] : parts[0]?.[1];
  return `${first}${second ?? "R"}`.toUpperCase();
}

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const targetUserIdParam = searchParams.get("userId");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [viewerUserId, setViewerUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserRow | null>(null);

  const resolvedUserId = targetUserIdParam ?? viewerUserId;
  const isSelf = Boolean(resolvedUserId && viewerUserId && resolvedUserId === viewerUserId);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (!mounted) return;

      if (authError) {
        setError(authError.message);
        setViewerUserId(null);
      } else {
        setViewerUserId(authData.user?.id ?? null);
      }

      const idToLoad = targetUserIdParam ?? authData.user?.id;
      if (!idToLoad) {
        setError("You must be signed in to view profiles.");
        setLoading(false);
        return;
      }

      const { data: userRow, error: profileError } = await supabase
        .from("users")
        .select("id, username, rating, wins, losses, team_name")
        .eq("id", idToLoad)
        .maybeSingle();

      if (!mounted) return;

      if (profileError) {
        setError(profileError.message);
      } else if (!userRow) {
        setError("User not found.");
      } else {
        setProfile(userRow as UserRow);
      }

      setLoading(false);
    };

    void load();

    return () => {
      mounted = false;
    };
  }, [targetUserIdParam]);

  const displayName = profile?.username || "Anonymous";
  const initials = initialsFromName(displayName);
  const rating = profile?.rating ?? 0;
  const rank = getRankFromRating(rating);
  const wins = profile?.wins ?? 0;
  const losses = profile?.losses ?? 0;
  const totalMatches = wins + losses;
  const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl p-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--cr-border)] border-t-[rgb(var(--cr-accent-rgb))]" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-center">
            <p className="text-red-400">{error}</p>
            <Link
              href="/auth/login"
              className="mt-4 inline-block text-sm text-[rgb(var(--cr-accent-rgb))] hover:underline"
            >
              Sign in to view profile
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Profile Header */}
            <section className="rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] p-6">
              <div className="flex flex-wrap items-start gap-6">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[rgba(var(--cr-accent-rgb),0.2)] text-2xl font-bold text-[rgb(var(--cr-accent-rgb))]">
                  {initials}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl font-bold text-[var(--cr-fg)]">{displayName}</h1>
                    <span className={`rounded px-2 py-0.5 text-xs font-medium ${rank.color}`}>
                      {rank.name}
                    </span>
                  </div>
                  {profile?.team_name && (
                    <p className="mt-1 text-sm text-[var(--cr-fg-muted)]">
                      Team: {profile.team_name}
                    </p>
                  )}
                  {/* Club Badge */}
                  {profile?.club_name && (
                    <Link
                      href="/clubs"
                      className="mt-3 inline-flex items-center gap-2 rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg)] px-3 py-1.5 text-sm transition-colors hover:border-[rgba(var(--cr-accent-rgb),0.3)]"
                    >
                      <span className="text-lg">{profile.club_logo || "🏆"}</span>
                      <span className="font-medium text-[var(--cr-fg)]">{profile.club_name}</span>
                      <span className="flex items-center gap-1 text-xs text-amber-400">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 4h-1V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v1H5a1 1 0 0 0-1 1v2a4 4 0 0 0 3 3.87A6 6 0 0 0 11 14.9V17H8a1 1 0 0 0 0 2h8a1 1 0 1 0 0-2h-3v-2.1a6 6 0 0 0 4-3.99 4 4 0 0 0 3-3.87V5a1 1 0 0 0-1-1Z"/>
                        </svg>
                        {(profile.club_trophies ?? 0).toLocaleString()}
                      </span>
                    </Link>
                  )}
                  {isSelf && (
                    <Link
                      href="/settings"
                      className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg)] px-4 py-2 text-sm font-medium text-[var(--cr-fg)] transition-colors hover:bg-[var(--cr-bg-tertiary)]"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                      Edit Profile
                    </Link>
                  )}
                </div>
              </div>
            </section>

            {/* Stats Grid */}
            <section className="grid gap-4 sm:grid-cols-4">
              <div className="rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] p-4 text-center">
                <div className="text-2xl font-bold text-[rgb(var(--cr-accent-rgb))]">{rating}</div>
                <div className="mt-1 text-xs text-[var(--cr-fg-muted)]">Rating</div>
              </div>
              <div className="rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] p-4 text-center">
                <div className="text-2xl font-bold text-emerald-400">{wins}</div>
                <div className="mt-1 text-xs text-[var(--cr-fg-muted)]">Wins</div>
              </div>
              <div className="rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] p-4 text-center">
                <div className="text-2xl font-bold text-red-400">{losses}</div>
                <div className="mt-1 text-xs text-[var(--cr-fg-muted)]">Losses</div>
              </div>
              <div className="rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] p-4 text-center">
                <div className="text-2xl font-bold text-[var(--cr-fg)]">{winRate}%</div>
                <div className="mt-1 text-xs text-[var(--cr-fg-muted)]">Win Rate</div>
              </div>
            </section>

            {/* Recent Activity */}
            <section className="rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] p-6">
              <h2 className="mb-4 text-lg font-semibold text-[var(--cr-fg)]">Recent Activity</h2>
              <div className="flex items-center justify-center py-8 text-[var(--cr-fg-muted)]">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="mt-2 text-sm">No recent activity</p>
                  <Link
                    href="/practice"
                    className="mt-4 inline-block text-sm text-[rgb(var(--cr-accent-rgb))] hover:underline"
                  >
                    Start practicing →
                  </Link>
                </div>
              </div>
            </section>

            {/* Achievements */}
            <section className="rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] p-6">
              <h2 className="mb-4 text-lg font-semibold text-[var(--cr-fg)]">Achievements</h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { name: "First Win", description: "Win your first match", unlocked: wins > 0 },
                  { name: "5-Win Streak", description: "Win 5 matches in a row", unlocked: false },
                  { name: "Problem Solver", description: "Solve 50 practice problems", unlocked: false },
                ].map((achievement) => (
                  <div
                    key={achievement.name}
                    className={`rounded-lg border p-4 ${
                      achievement.unlocked
                        ? "border-[rgba(var(--cr-accent-rgb),0.3)] bg-[rgba(var(--cr-accent-rgb),0.1)]"
                        : "border-[var(--cr-border)] bg-[var(--cr-bg)] opacity-50"
                    }`}
                  >
                    <div className="text-sm font-medium text-[var(--cr-fg)]">{achievement.name}</div>
                    <div className="mt-1 text-xs text-[var(--cr-fg-muted)]">{achievement.description}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </AppShell>
  );
}
