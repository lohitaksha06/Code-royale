"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "../../../components/app-shell";

type ClubPrivacy = "public" | "private";

type ClubMember = {
  id: string;
  username: string;
  avatar: string;
  trophies: number;
  role: "host" | "elder" | "member";
};

type Club = {
  id: string;
  name: string;
  logo: string;
  emblem: string;
  trophies: number;
  members: number;
  maxMembers: number;
  privacy: ClubPrivacy;
  rank: number;
  description?: string;
  topPlayers: ClubMember[];
};

const STORAGE_MY_CLUB_ID = "cr_my_club_id";
const STORAGE_MY_CUSTOM_CLUB = "cr_my_custom_club";

const emblemOptions = [
  { id: "sword",     color: "from-red-500 to-orange-500" },
  { id: "shield",    color: "from-blue-500 to-cyan-500" },
  { id: "crown",     color: "from-amber-500 to-yellow-500" },
  { id: "star",      color: "from-purple-500 to-pink-500" },
  { id: "lightning", color: "from-cyan-500 to-blue-500" },
  { id: "fire",      color: "from-orange-500 to-red-500" },
  { id: "dragon",    color: "from-emerald-500 to-teal-500" },
  { id: "target",    color: "from-rose-500 to-pink-500" },
];

const topClubs: Club[] = [];

function loadCustomClub(): Club | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_MY_CUSTOM_CLUB);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Club;
  } catch {
    return null;
  }
}

function getMyClubId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STORAGE_MY_CLUB_ID);
}

function setMyClubId(id: string, club?: Club) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_MY_CLUB_ID, id);
  if (club) {
    window.localStorage.setItem(STORAGE_MY_CUSTOM_CLUB, JSON.stringify(club));
  }
}

function clearMyClub() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_MY_CLUB_ID);
  window.localStorage.removeItem(STORAGE_MY_CUSTOM_CLUB);
}

export default function ClubDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clubId = typeof params.clubId === "string" ? params.clubId : "";

  const [myClubId, setMyClubIdState] = useState<string | null>(null);

  useEffect(() => {
    clearMyClub();
    setMyClubIdState(null);
  }, []);

  const club = useMemo(() => {
    const custom = loadCustomClub();
    if (custom && custom.id === clubId) return custom;
    return topClubs.find((c) => c.id === clubId) ?? null;
  }, [clubId]);

  if (!club) {
    return (
      <AppShell>
        <div className="mx-auto max-w-3xl p-6">
          <div className="rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] p-6 text-center">
            <p className="text-[var(--cr-fg-muted)]">Club not found.</p>
            <button
              onClick={() => router.push("/clubs")}
              className="mt-4 rounded-lg bg-[rgb(var(--cr-accent-rgb))] px-4 py-2 text-sm font-medium text-white"
            >
              Back to Clubs
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  const isMyClub = myClubId === club.id;
  const isInClub = Boolean(myClubId);
  const isFull = club.members >= club.maxMembers;

  const handleJoin = () => {
    if (isInClub) return;
    if (club.privacy === "private") {
      alert(`Request sent to join ${club.name}! The club host will review your request.`);
      return;
    }
    setMyClubId(club.id, club.id.startsWith("custom_") ? club : undefined);
    setMyClubIdState(club.id);
  };

  const handleLeave = () => {
    if (!isMyClub) return;
    if (confirm("Are you sure you want to leave this club?")) {
      clearMyClub();
      setMyClubIdState(null);
      router.push("/clubs");
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl p-6">
        <div className="mb-5 flex items-center justify-between">
          <Link
            href="/clubs"
            className="text-sm text-[var(--cr-fg-muted)] hover:text-[var(--cr-fg)]"
          >
            ← Back to Clubs
          </Link>
          {isMyClub ? (
            <button
              onClick={handleLeave}
              className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors"
            >
              Leave Club
            </button>
          ) : isFull ? (
            <span className="rounded-lg bg-[var(--cr-bg-tertiary)] px-3 py-1.5 text-xs font-medium text-[var(--cr-fg-muted)]">
              Full
            </span>
          ) : isInClub ? (
            <span className="rounded-lg bg-[var(--cr-bg-tertiary)] px-3 py-1.5 text-xs font-medium text-[var(--cr-fg-muted)]">
              In a Club
            </span>
          ) : (
            <button
              onClick={handleJoin}
              className="rounded-lg bg-[rgb(var(--cr-accent-rgb))] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
            >
              {club.privacy === "private" ? "Request to Join" : "Join Club"}
            </button>
          )}
        </div>

        <div className="rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] p-6">
          <div className="flex flex-wrap items-start gap-6">
            <div className={`flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br ${
              emblemOptions.find((e) => e.id === club.emblem)?.color ?? "from-blue-500 to-cyan-500"
            } text-4xl`}>
              {club.logo}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-[var(--cr-fg)]">{club.name}</h1>
                {club.privacy === "private" && (
                  <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-400">
                    Private
                  </span>
                )}
              </div>
              {club.description && (
                <p className="mt-1 text-sm text-[var(--cr-fg-muted)]">{club.description}</p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-[var(--cr-fg-muted)]">
                <span className="flex items-center gap-1">
                  <svg className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 4h-1V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v1H5a1 1 0 0 0-1 1v2a4 4 0 0 0 3 3.87A6 6 0 0 0 11 14.9V17H8a1 1 0 0 0 0 2h8a1 1 0 1 0 0-2h-3v-2.1a6 6 0 0 0 4-3.99 4 4 0 0 0 3-3.87V5a1 1 0 0 0-1-1Z"/>
                  </svg>
                  {club.trophies.toLocaleString()} Trophies
                </span>
                <span>•</span>
                <span>{club.members}/{club.maxMembers} Members</span>
                <span>•</span>
                <span>Rank #{club.rank}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)]">
          <div className="border-b border-[var(--cr-border)] px-4 py-3">
            <h2 className="font-semibold text-[var(--cr-fg)]">Top Players</h2>
          </div>
          <div className="divide-y divide-[var(--cr-border)]">
            {club.topPlayers.map((player, idx) => (
              <div key={player.id} className="flex items-center gap-4 p-4">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                  idx === 0 ? "bg-amber-500/20 text-amber-400"
                  : idx === 1 ? "bg-slate-400/20 text-slate-300"
                  : "bg-orange-500/20 text-orange-400"
                }`}>
                  {idx + 1}
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(var(--cr-accent-rgb),0.15)] text-xs font-bold text-[rgb(var(--cr-accent-rgb))]">
                  {player.avatar}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-[var(--cr-fg)]">{player.username}</div>
                  <div className="text-xs text-[var(--cr-fg-muted)]">{player.role.toUpperCase()}</div>
                </div>
                <div className="text-sm font-semibold text-amber-400">
                  {player.trophies.toLocaleString()} trophies
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
