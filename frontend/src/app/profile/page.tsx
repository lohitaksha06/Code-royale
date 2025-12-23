"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { PracticeScaffold } from "../practice/practice-scaffold";
import { NeonButton } from "../../components/neon-button";
import { supabase } from "../../lib/supabase-browser";

type UserRow = {
  id: string;
  username: string | null;
  rating: number | null;
  wins: number | null;
  losses: number | null;
  team_name?: string | null;
};

type FriendPreview = {
  id: string;
  username: string;
  status: "online" | "offline" | "in_match";
};

function getRankFromRating(rating: number) {
  if (rating >= 600) return "Gold";
  if (rating >= 400) return "Silver";
  if (rating >= 200) return "Bronze";
  return "Unranked";
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
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const [viewerUserId, setViewerUserId] = useState<string | null>(null);
  const [viewerEmail, setViewerEmail] = useState<string | null>(null);

  const [profile, setProfile] = useState<UserRow | null>(null);

  const resolvedUserId = targetUserIdParam ?? viewerUserId;
  const isSelf = Boolean(resolvedUserId && viewerUserId && resolvedUserId === viewerUserId);

  const demoFriends: FriendPreview[] = useMemo(
    () => [
      { id: "demo-1", username: "NeonGhost", status: "online" },
      { id: "demo-2", username: "ByteBandit", status: "in_match" },
      { id: "demo-3", username: "SyntaxSiren", status: "offline" },
    ],
    [],
  );

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      setActionMessage(null);

      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (!mounted) return;

      if (authError) {
        setError(authError.message);
        setViewerUserId(null);
        setViewerEmail(null);
      } else {
        setViewerUserId(authData.user?.id ?? null);
        setViewerEmail(authData.user?.email ?? null);
      }

      const finalUserId = targetUserIdParam ?? authData.user?.id ?? null;

      if (!finalUserId) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const { data: userRow, error: profileError } = await supabase
        .from("users")
        .select("id,username,rating,wins,losses,team_name")
        .eq("id", finalUserId)
        .maybeSingle();

      if (!mounted) return;

      if (profileError) {
        setError(profileError.message);
        setProfile(null);
        setLoading(false);
        return;
      }

      setProfile(userRow ?? null);
      setLoading(false);
    };

    void load();

    return () => {
      mounted = false;
    };
  }, [targetUserIdParam]);

  const displayName = profile?.username ?? "Unknown Pilot";
  const rating = profile?.rating ?? 0;
  const rank = getRankFromRating(rating);
  const wins = profile?.wins ?? 0;
  const losses = profile?.losses ?? 0;
  const winRate = wins + losses > 0 ? Math.round((wins / (wins + losses)) * 100) : 0;
  const teamName = (profile?.team_name ?? "").trim() || "not in team";

  const canModerate = Boolean(resolvedUserId && viewerUserId && resolvedUserId !== viewerUserId);

  const handleSignOut = async () => {
    setActionMessage(null);
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      setError(signOutError.message);
      return;
    }
    setActionMessage("Signed out.");
  };

  return (
    <PracticeScaffold defaultSidebarOpen>
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 pt-8 sm:px-10 lg:px-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <a
            href="/home"
            className="inline-flex items-center gap-2 rounded-full border border-sky-500/25 bg-slate-950/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-sky-100/80 transition hover:border-sky-300 hover:bg-sky-500/10"
          >
            <span aria-hidden>←</span>
            Back to Dashboard
          </a>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/settings"
              className="inline-flex items-center justify-center rounded-full border border-fuchsia-400/60 bg-fuchsia-500/20 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-fuchsia-50 transition hover:border-fuchsia-200 hover:bg-fuchsia-500/35"
            >
              Edit Profile
            </a>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center justify-center rounded-full border border-sky-500/25 bg-slate-950/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-sky-100/80 transition hover:border-sky-300 hover:bg-sky-500/10"
            >
              Sign out
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        {actionMessage && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {actionMessage}
          </div>
        )}

        <section className="grid gap-8 lg:grid-cols-[1.35fr_0.85fr]">
          <div className="overflow-hidden rounded-3xl border border-sky-500/20 bg-[#040b18]/80 shadow-[0_0_45px_rgba(56,189,248,0.14)]">
            <div className="relative h-32 w-full">
              <Image
                src="/images/bluebracket.jpg"
                alt="Profile banner"
                fill
                className="object-cover opacity-70"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#040b18]/40 via-[#040b18]/70 to-[#040b18]" />
              <div className="absolute left-6 top-6 flex items-center gap-3 rounded-full border border-sky-500/20 bg-slate-950/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-sky-300/80">
                🧑‍🚀 Pilot profile
              </div>
            </div>

            <div className="p-8">
              <div className="flex flex-wrap items-center gap-5">
                <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-sky-500/30 bg-slate-950/80 shadow-[0_0_30px_rgba(56,189,248,0.25)]">
                  <Image src="/images/crimage.png" alt="Avatar" fill className="object-cover opacity-30" sizes="96px" />
                  <span className="relative z-10 text-lg font-semibold uppercase tracking-[0.35em] text-sky-200">
                    {initialsFromName(displayName)}
                  </span>
                </div>
                <div className="flex min-w-[240px] flex-1 flex-col gap-2">
                  <h1 className="text-4xl font-semibold tracking-tight text-sky-50">{loading ? "Loading…" : displayName}</h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-sky-100/70">
                    <span className="text-sky-200/80">@{(profile?.username ?? "unknown").toLowerCase().replace(/\s+/g, "")}</span>
                    <span className="text-sky-100/40">•</span>
                    <span className="truncate">{viewerEmail && isSelf ? viewerEmail : resolvedUserId ? `ID ${resolvedUserId}` : "Signed out"}</span>
                  </div>
                  <span className="mt-1 inline-flex w-max items-center gap-2 rounded-full border border-sky-500/25 bg-slate-950/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-sky-200/80">
                    ⚡ {rating} pts
                  </span>
                </div>
              </div>

              <div className="mt-8 grid gap-4">
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-sky-500/20 bg-slate-950/50 p-5">
                  <div className="flex flex-col">
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-400/70">🏆 Rank</p>
                    <p className="mt-2 text-xs text-sky-100/60">Bronze 200 · Silver 400 · Gold 600</p>
                  </div>
                  <p className="text-2xl font-semibold text-sky-50">{rank}</p>
                </div>

                <div className="flex items-center justify-between gap-4 rounded-2xl border border-sky-500/20 bg-slate-950/50 p-5">
                  <div className="flex flex-col">
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-400/70">🛡️ Team</p>
                    <p className="mt-2 text-xs text-sky-100/60">Your current club/team</p>
                  </div>
                  <p className="text-2xl font-semibold text-sky-50">{teamName}</p>
                </div>

                <div className="flex items-center justify-between gap-4 rounded-2xl border border-sky-500/20 bg-slate-950/50 p-5">
                  <div className="flex flex-col">
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-400/70">📊 Record</p>
                    <p className="mt-2 text-xs text-sky-100/60">Win rate {winRate}%</p>
                  </div>
                  <p className="text-2xl font-semibold text-sky-50">{wins}W · {losses}L</p>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-sky-500/20 bg-slate-950/40 p-6">
                <div className="flex items-start gap-4">
                  <div className="relative mt-1 h-12 w-12 overflow-hidden rounded-2xl border border-sky-500/20 bg-slate-950/50">
                    <Image src="/images/bluecode.jpg" alt="Code preview" fill className="object-cover opacity-70" sizes="48px" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-400/70">✨ About</p>
                    <p className="text-sm text-sky-100/70">
                      Add a bio later from Settings. For now, this space keeps the profile from feeling empty.
                    </p>
                  </div>
                </div>
              </div>

              {canModerate && (
              <div className="mt-8 rounded-2xl border border-sky-500/20 bg-slate-950/40 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-400/70">Actions</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <NeonButton className="w-full justify-center" onClick={() => setActionMessage("Friend request sent (demo).")}
                  >
                    🤝 Add Friend
                  </NeonButton>
                  <NeonButton
                    className="w-full justify-center border-amber-400/60 bg-amber-400/10 hover:border-amber-300 hover:bg-amber-400/20"
                    onClick={() => setActionMessage("Player blocked (demo).")}
                  >
                    🚫 Block
                  </NeonButton>
                  <NeonButton
                    className="w-full justify-center border-rose-500/50 bg-rose-500/10 hover:border-rose-400 hover:bg-rose-500/20"
                    onClick={() => setActionMessage("Report submitted (demo).")}
                  >
                    🧾 Report
                  </NeonButton>
                </div>
              </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-sky-500/20 bg-[#040b18]/80 p-8 shadow-[0_0_45px_rgba(56,189,248,0.14)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-sky-50">Connections</h2>
                <p className="mt-2 text-sm text-sky-100/70">Preview list (demo) until connections are wired to the database.</p>
              </div>
              <span className="rounded-full border border-sky-500/25 bg-slate-950/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-sky-200/80">
                Connections ({demoFriends.length})
              </span>
            </div>

            <div className="mt-6 grid gap-4">
              {demoFriends.map((friend) => {
                const statusPill =
                  friend.status === "online"
                    ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
                    : friend.status === "in_match"
                      ? "border-fuchsia-400/40 bg-fuchsia-500/10 text-fuchsia-200"
                      : "border-slate-500/30 bg-slate-900/40 text-slate-200";

                const statusLabel =
                  friend.status === "online" ? "Online" : friend.status === "in_match" ? "In Match" : "Offline";

                return (
                  <div key={friend.id} className="rounded-2xl border border-sky-500/20 bg-slate-950/50 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="relative h-12 w-12 overflow-hidden rounded-full border border-sky-500/20 bg-slate-950/60">
                          <Image src="/images/crimage.webp" alt="Connection avatar" fill className="object-cover opacity-70" sizes="48px" />
                        </div>
                        <div className="flex min-w-0 flex-col gap-2">
                          <span className="truncate text-base font-semibold text-sky-50">{friend.username}</span>
                          <span className={`w-max rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] ${statusPill}`}>
                            {statusLabel}
                          </span>
                        </div>
                      </div>
                      <a
                        href={`/profile?userId=${friend.id}`}
                        className="rounded-full border border-sky-500/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-sky-100/80 transition hover:border-sky-300 hover:bg-sky-500/10"
                      >
                        View
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </PracticeScaffold>
  );
}
