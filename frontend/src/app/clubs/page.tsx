"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { AppShell } from "../../components/app-shell";

type ClubPrivacy = "public" | "private";
type MaxMembers = 10 | 20 | 30 | 40;

/* ── Mock data ──────────────────────────────────────────── */
interface ClubMember {
  id: string;
  username: string;
  avatar: string;
  trophies: number;
  role: "host" | "elder" | "member";
}

interface Club {
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
}

const topClubs: Club[] = [
  {
    id: "1",
    name: "Code Warriors",
    logo: "⚔️",
    emblem: "sword",
    trophies: 15420,
    members: 38,
    maxMembers: 40,
    privacy: "public",
    rank: 1,
    description: "Elite coders pushing the limits. Join us for daily battles!",
    topPlayers: [
      { id: "p1", username: "NeonCoder",  avatar: "NC", trophies: 4200, role: "host" },
      { id: "p2", username: "ByteStorm",  avatar: "BS", trophies: 3800, role: "elder" },
      { id: "p3", username: "AlgoKnight", avatar: "AK", trophies: 3100, role: "member" },
    ],
  },
  {
    id: "2",
    name: "Binary Beasts",
    logo: "🐉",
    emblem: "dragon",
    trophies: 12850,
    members: 35,
    maxMembers: 40,
    privacy: "public",
    rank: 2,
    description: "Beasts in binary, dragons in code.",
    topPlayers: [
      { id: "p4", username: "CodePhantom",  avatar: "CP", trophies: 3500, role: "host" },
      { id: "p5", username: "BinaryWraith", avatar: "BW", trophies: 3200, role: "elder" },
      { id: "p6", username: "SyntaxSage",   avatar: "SS", trophies: 2900, role: "member" },
    ],
  },
  {
    id: "3",
    name: "Algorithm Aces",
    logo: "🎯",
    emblem: "target",
    trophies: 11200,
    members: 28,
    maxMembers: 30,
    privacy: "private",
    rank: 3,
    description: "Private club for algorithm enthusiasts. Apply to join!",
    topPlayers: [
      { id: "p7", username: "LoopLegend",   avatar: "LL", trophies: 3000, role: "host" },
      { id: "p8", username: "StackSamurai", avatar: "SM", trophies: 2700, role: "elder" },
      { id: "p9", username: "HeapHero",     avatar: "HH", trophies: 2400, role: "member" },
    ],
  },
  {
    id: "4",
    name: "Syntax Slayers",
    logo: "⚡",
    emblem: "lightning",
    trophies: 9800,
    members: 20,
    maxMembers: 20,
    privacy: "public",
    rank: 4,
    description: "Slaying syntax errors since day one.",
    topPlayers: [
      { id: "p10", username: "RecursionKing", avatar: "RK", trophies: 2600, role: "host" },
      { id: "p11", username: "VoidVoyager",   avatar: "VV", trophies: 2200, role: "elder" },
      { id: "p12", username: "PixelProwler",  avatar: "PP", trophies: 1800, role: "member" },
    ],
  },
  {
    id: "5",
    name: "Debug Dynasty",
    logo: "🔥",
    emblem: "fire",
    trophies: 8500,
    members: 19,
    maxMembers: 30,
    privacy: "private",
    rank: 5,
    description: "Where bugs come to die. Private club — request to join.",
    topPlayers: [
      { id: "p13", username: "NodeNinja",  avatar: "NN", trophies: 2100, role: "host" },
      { id: "p14", username: "FuncFalcon", avatar: "FF", trophies: 1900, role: "elder" },
      { id: "p15", username: "LambdaLion", avatar: "LD", trophies: 1500, role: "member" },
    ],
  },
  {
    id: "6",
    name: "Runtime Rebels",
    logo: "🚀",
    emblem: "star",
    trophies: 7200,
    members: 15,
    maxMembers: 30,
    privacy: "public",
    rank: 6,
    description: "Breaking limits at runtime. Open to all challengers.",
    topPlayers: [
      { id: "p16", username: "TurboTyper", avatar: "TT", trophies: 1800, role: "host" },
      { id: "p17", username: "BitBlaster", avatar: "BB", trophies: 1500, role: "member" },
      { id: "p18", username: "DataDruid",  avatar: "DD", trophies: 1200, role: "member" },
    ],
  },
];

const logoOptions = ["⚔️", "🐉", "🎯", "⚡", "🔥", "🏆", "💎", "🚀", "👑", "🦁", "🐺", "🦅"];
const emblemOptions = [
  { id: "sword",     name: "Sword",     color: "from-red-500 to-orange-500" },
  { id: "shield",    name: "Shield",    color: "from-blue-500 to-cyan-500" },
  { id: "crown",     name: "Crown",     color: "from-amber-500 to-yellow-500" },
  { id: "star",      name: "Star",      color: "from-purple-500 to-pink-500" },
  { id: "lightning", name: "Lightning", color: "from-cyan-500 to-blue-500" },
  { id: "fire",      name: "Fire",      color: "from-orange-500 to-red-500" },
  { id: "dragon",    name: "Dragon",    color: "from-emerald-500 to-teal-500" },
  { id: "target",    name: "Target",    color: "from-rose-500 to-pink-500" },
];

/* ── Hover tooltip component ────────────────────────────── */
function ClubHoverCard({ club }: { club: Club }) {
  return (
    <div className="absolute left-full top-0 z-50 ml-2 w-72 rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg)] p-4 shadow-xl shadow-black/40 animate-fade-in pointer-events-none">
      {/* Club header */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${
          emblemOptions.find((e) => e.id === club.emblem)?.color ?? "from-blue-500 to-cyan-500"
        } text-xl`}>
          {club.logo}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[var(--cr-fg)]">{club.name}</span>
            {club.privacy === "private" && (
              <svg className="h-3.5 w-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            )}
          </div>
          <div className="text-xs text-[var(--cr-fg-muted)]">{club.members}/{club.maxMembers} members</div>
        </div>
      </div>

      {/* Description */}
      {club.description && (
        <p className="mb-3 text-xs text-[var(--cr-fg-muted)] leading-relaxed">{club.description}</p>
      )}

      {/* Trophies */}
      <div className="mb-3 flex items-center gap-2 rounded-md bg-[var(--cr-bg-secondary)] px-3 py-2">
        <svg className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 4h-1V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v1H5a1 1 0 0 0-1 1v2a4 4 0 0 0 3 3.87A6 6 0 0 0 11 14.9V17H8a1 1 0 0 0 0 2h8a1 1 0 1 0 0-2h-3v-2.1a6 6 0 0 0 4-3.99 4 4 0 0 0 3-3.87V5a1 1 0 0 0-1-1Z"/>
        </svg>
        <span className="text-sm font-semibold text-amber-400">{club.trophies.toLocaleString()}</span>
        <span className="text-xs text-[var(--cr-fg-muted)]">Total Trophies</span>
      </div>

      {/* Top 3 players */}
      <div>
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--cr-fg-muted)]">
          Top 3 Players
        </div>
        <div className="space-y-1.5">
          {club.topPlayers.map((player, i) => (
            <div key={player.id} className="flex items-center gap-2">
              <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                i === 0 ? "bg-amber-500/20 text-amber-400"
                : i === 1 ? "bg-slate-400/20 text-slate-300"
                : "bg-orange-500/20 text-orange-400"
              }`}>
                {i + 1}
              </span>
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[rgba(var(--cr-accent-rgb),0.15)] text-[9px] font-bold text-[rgb(var(--cr-accent-rgb))]">
                {player.avatar}
              </div>
              <span className="flex-1 text-xs font-medium text-[var(--cr-fg)]">{player.username}</span>
              <span className="text-[10px] text-amber-400">{player.trophies.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Hoverable club row ─────────────────────────────────── */
function ClubRow({
  club,
  myClub,
  onJoin,
}: {
  club: Club;
  myClub: Club | null;
  onJoin: (club: Club) => void;
}) {
  const [showHover, setShowHover] = useState(false);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    hoverTimeout.current = setTimeout(() => setShowHover(true), 400);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setShowHover(false);
  };

  const isInClub = !!myClub;
  const isMyClub = myClub?.id === club.id;
  const isFull = club.members >= club.maxMembers;

  return (
    <div
      className="relative flex items-center gap-4 p-4 hover:bg-[var(--cr-bg-tertiary)] transition-colors"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Hover card */}
      {showHover && !isMyClub && <ClubHoverCard club={club} />}

      {/* Rank */}
      <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
        club.rank === 1
          ? "bg-amber-500/20 text-amber-400"
          : club.rank === 2
          ? "bg-slate-400/20 text-slate-300"
          : club.rank === 3
          ? "bg-orange-500/20 text-orange-400"
          : "bg-[var(--cr-bg-tertiary)] text-[var(--cr-fg-muted)]"
      }`}>
        #{club.rank}
      </div>

      {/* Club Logo */}
      <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${
        emblemOptions.find((e) => e.id === club.emblem)?.color ?? "from-blue-500 to-cyan-500"
      } text-2xl`}>
        {club.logo}
      </div>

      {/* Club Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[var(--cr-fg)] truncate">{club.name}</span>
          {club.privacy === "private" && (
            <svg className="h-4 w-4 shrink-0 text-[var(--cr-fg-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-3 text-xs text-[var(--cr-fg-muted)]">
          <span>{club.members}/{club.maxMembers} members</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 4h-1V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v1H5a1 1 0 0 0-1 1v2a4 4 0 0 0 3 3.87A6 6 0 0 0 11 14.9V17H8a1 1 0 0 0 0 2h8a1 1 0 1 0 0-2h-3v-2.1a6 6 0 0 0 4-3.99 4 4 0 0 0 3-3.87V5a1 1 0 0 0-1-1Z"/>
            </svg>
            {club.trophies.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Action Button */}
      {isMyClub ? (
        <span className="rounded-lg bg-emerald-500/20 px-3 py-1.5 text-xs font-medium text-emerald-400">
          Joined
        </span>
      ) : isFull ? (
        <span className="rounded-lg bg-[var(--cr-bg-tertiary)] px-3 py-1.5 text-xs font-medium text-[var(--cr-fg-muted)]">
          Full
        </span>
      ) : isInClub ? (
        <span className="rounded-lg bg-[var(--cr-bg-tertiary)] px-3 py-1.5 text-xs font-medium text-[var(--cr-fg-muted)] cursor-not-allowed" title="Leave your current club first">
          In a Club
        </span>
      ) : (
        <button
          onClick={() => onJoin(club)}
          className="rounded-lg bg-[rgb(var(--cr-accent-rgb))] px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 transition-opacity"
        >
          {club.privacy === "private" ? "Request" : "Join"}
        </button>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Main Clubs Page
   ────────────────────────────────────────────────────────── */
export default function ClubsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showBrowse, setShowBrowse] = useState(false);

  // Create club form state
  const [clubName, setClubName] = useState("");
  const [selectedLogo, setSelectedLogo] = useState(logoOptions[0]);
  const [selectedEmblem, setSelectedEmblem] = useState(emblemOptions[0].id);
  const [privacy, setPrivacy] = useState<ClubPrivacy>("public");
  const [maxMembers, setMaxMembers] = useState<MaxMembers>(20);
  const [creating, setCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock user's club (null = not in a club)
  const [myClub, setMyClub] = useState<Club | null>(null);

  const filteredClubs = topClubs.filter((club) =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateClub = async () => {
    if (!clubName.trim()) return;
    setCreating(true);
    await new Promise((r) => setTimeout(r, 1000));

    const newClub: Club = {
      id: crypto.randomUUID(),
      name: clubName,
      logo: selectedLogo,
      emblem: selectedEmblem,
      trophies: 0,
      members: 1,
      maxMembers,
      privacy,
      rank: 999,
      description: "A fresh club ready for battle!",
      topPlayers: [
        { id: "self", username: "You", avatar: "CR", trophies: 0, role: "host" },
      ],
    };

    setMyClub(newClub);
    setShowCreateModal(false);
    setCreating(false);
    setClubName("");
  };

  const handleJoinClub = (club: Club) => {
    if (myClub) return; // Already in a club
    if (club.privacy === "private") {
      alert(`Request sent to join ${club.name}! The club host will review your request.`);
    } else {
      setMyClub(club);
      setShowBrowse(false);
    }
  };

  const handleLeaveClub = () => {
    if (confirm("Are you sure you want to leave this club?")) {
      setMyClub(null);
    }
  };

  /* ── If user has a club, show "My Club" view by default ── */
  if (myClub && !showBrowse) {
    return (
      <AppShell>
        <div className="mx-auto max-w-5xl p-6">
          {/* Header with browse toggle */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-[var(--cr-fg)]">My Club</h1>
              <p className="mt-1 text-sm text-[var(--cr-fg-muted)]">
                Manage your club and compete with teammates
              </p>
            </div>
            <button
              onClick={() => setShowBrowse(true)}
              className="flex items-center gap-2 rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] px-4 py-2 text-sm text-[var(--cr-fg-muted)] transition-colors hover:bg-[var(--cr-bg-tertiary)] hover:text-[var(--cr-fg)]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              Browse Clubs
            </button>
          </div>

          {/* Club Header Card */}
          <div className="rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] p-6">
            <div className="flex flex-wrap items-start gap-6">
              <div className={`flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br ${
                emblemOptions.find((e) => e.id === myClub.emblem)?.color ?? "from-blue-500 to-cyan-500"
              } text-4xl`}>
                {myClub.logo}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-[var(--cr-fg)]">{myClub.name}</h2>
                  {myClub.privacy === "private" && (
                    <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-400">
                      Private
                    </span>
                  )}
                </div>
                {myClub.description && (
                  <p className="mt-1 text-sm text-[var(--cr-fg-muted)]">{myClub.description}</p>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-[var(--cr-fg-muted)]">
                  <span className="flex items-center gap-1">
                    <svg className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 4h-1V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v1H5a1 1 0 0 0-1 1v2a4 4 0 0 0 3 3.87A6 6 0 0 0 11 14.9V17H8a1 1 0 0 0 0 2h8a1 1 0 1 0 0-2h-3v-2.1a6 6 0 0 0 4-3.99 4 4 0 0 0 3-3.87V5a1 1 0 0 0-1-1Z"/>
                    </svg>
                    {myClub.trophies.toLocaleString()} Trophies
                  </span>
                  <span>•</span>
                  <span>{myClub.members}/{myClub.maxMembers} Members</span>
                  <span>•</span>
                  <span>Rank #{myClub.rank}</span>
                </div>
              </div>
              <button
                onClick={handleLeaveClub}
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors"
              >
                Leave Club
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Link
              href="/game-modes?mode=club-battle"
              className="group rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] p-5 transition-all hover:border-[rgba(var(--cr-accent-rgb),0.3)]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[rgba(var(--cr-accent-rgb),0.1)] text-[rgb(var(--cr-accent-rgb))]">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-[var(--cr-fg)]">Battle Club Members</div>
                  <div className="text-xs text-[var(--cr-fg-muted)]">Practice with your teammates</div>
                </div>
              </div>
            </Link>
            <button className="group rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] p-5 text-left transition-all hover:border-[rgba(var(--cr-accent-rgb),0.3)]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-[var(--cr-fg)]">Invite Friends</div>
                  <div className="text-xs text-[var(--cr-fg-muted)]">Grow your club roster</div>
                </div>
              </div>
            </button>
          </div>

          {/* Club Members */}
          <div className="mt-6 rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)]">
            <div className="border-b border-[var(--cr-border)] px-4 py-3">
              <h3 className="font-semibold text-[var(--cr-fg)]">Members</h3>
            </div>
            <div className="divide-y divide-[var(--cr-border)]">
              {/* You */}
              <div className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(var(--cr-accent-rgb),0.2)] font-bold text-[rgb(var(--cr-accent-rgb))]">
                  Y
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[var(--cr-fg)]">You</span>
                    <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-medium text-amber-400">
                      HOST
                    </span>
                  </div>
                  <div className="text-xs text-[var(--cr-fg-muted)]">0 trophies contributed</div>
                </div>
              </div>

              {/* Other members */}
              {myClub.topPlayers.filter((p) => p.id !== "self").map((player) => (
                <div key={player.id} className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--cr-bg-tertiary)] font-bold text-[var(--cr-fg-muted)]">
                    {player.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[var(--cr-fg)]">{player.username}</span>
                      {player.role === "host" && (
                        <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-medium text-amber-400">HOST</span>
                      )}
                      {player.role === "elder" && (
                        <span className="rounded bg-cyan-500/20 px-1.5 py-0.5 text-[10px] font-medium text-cyan-400">ELDER</span>
                      )}
                    </div>
                    <div className="text-xs text-[var(--cr-fg-muted)]">{player.trophies.toLocaleString()} trophies contributed</div>
                  </div>
                </div>
              ))}

              {myClub.topPlayers.length <= 1 && (
                <div className="p-8 text-center text-[var(--cr-fg-muted)]">
                  <p className="text-sm">No other members yet</p>
                  <p className="mt-1 text-xs">Invite friends to join your club!</p>
                </div>
              )}
            </div>
          </div>

          {/* Join Requests (private clubs) */}
          {myClub.privacy === "private" && (
            <div className="mt-6 rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)]">
              <div className="border-b border-[var(--cr-border)] px-4 py-3">
                <h3 className="font-semibold text-[var(--cr-fg)]">Join Requests</h3>
              </div>
              <div className="p-8 text-center text-[var(--cr-fg-muted)]">
                <p className="text-sm">No pending requests</p>
              </div>
            </div>
          )}
        </div>
      </AppShell>
    );
  }

  /* ── No club OR user clicked "Browse Clubs" ──────────── */
  return (
    <AppShell>
      <div className="mx-auto max-w-5xl p-6">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[var(--cr-fg)]">Clubs</h1>
            <p className="mt-1 text-sm text-[var(--cr-fg-muted)]">
              {myClub
                ? "Browse other clubs (leave your current club first to join another)"
                : "Join a club to compete with teammates and earn bonus trophies"}
            </p>
          </div>
          <div className="flex gap-2">
            {myClub && (
              <button
                onClick={() => setShowBrowse(false)}
                className="rounded-lg bg-[rgb(var(--cr-accent-rgb))] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
              >
                ← Back to My Club
              </button>
            )}
            {!myClub && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="rounded-lg bg-[rgb(var(--cr-accent-rgb))] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
              >
                + Create Club
              </button>
            )}
          </div>
        </div>

        {/* Already-in-club banner */}
        {myClub && (
          <div className="mb-4 flex items-center gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
            <svg className="h-5 w-5 shrink-0 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <span className="text-sm text-amber-300">
              You are already in <strong>{myClub.name}</strong>. Leave your club first to join a different one.
            </span>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-4">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--cr-fg-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search clubs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg)] py-2.5 pl-10 pr-4 text-sm text-[var(--cr-fg)] placeholder:text-[var(--cr-fg-muted)] focus:border-[rgb(var(--cr-accent-rgb))] focus:outline-none"
          />
        </div>

        {/* Club List */}
        <div className="rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)]">
          <div className="border-b border-[var(--cr-border)] px-4 py-3">
            <h2 className="font-semibold text-[var(--cr-fg)]">Top Clubs by Trophies</h2>
          </div>
          <div className="divide-y divide-[var(--cr-border)]">
            {filteredClubs.length === 0 ? (
              <div className="p-8 text-center text-sm text-[var(--cr-fg-muted)]">
                No clubs found matching &quot;{searchQuery}&quot;
              </div>
            ) : (
              filteredClubs.map((club) => (
                <ClubRow
                  key={club.id}
                  club={club}
                  myClub={myClub}
                  onJoin={handleJoinClub}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Create Club Modal ───────────────────────────── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] p-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[var(--cr-fg)]">Create a New Club</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--cr-fg-muted)] hover:bg-[var(--cr-bg-tertiary)] hover:text-[var(--cr-fg)]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5">
              {/* Club Name */}
              <div>
                <label className="block text-sm font-medium text-[var(--cr-fg)] mb-2">Club Name</label>
                <input
                  type="text"
                  value={clubName}
                  onChange={(e) => setClubName(e.target.value)}
                  placeholder="Enter club name..."
                  maxLength={24}
                  className="w-full rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg)] px-4 py-2.5 text-sm text-[var(--cr-fg)] placeholder:text-[var(--cr-fg-muted)] focus:border-[rgb(var(--cr-accent-rgb))] focus:outline-none"
                />
                <p className="mt-1 text-xs text-[var(--cr-fg-muted)]">{clubName.length}/24</p>
              </div>

              {/* Logo */}
              <div>
                <label className="block text-sm font-medium text-[var(--cr-fg)] mb-2">Club Logo</label>
                <div className="flex flex-wrap gap-2">
                  {logoOptions.map((logo) => (
                    <button
                      key={logo}
                      onClick={() => setSelectedLogo(logo)}
                      className={`flex h-11 w-11 items-center justify-center rounded-lg text-xl transition-all ${
                        selectedLogo === logo
                          ? "bg-[rgb(var(--cr-accent-rgb))] ring-2 ring-[rgb(var(--cr-accent-rgb))] ring-offset-2 ring-offset-[var(--cr-bg-secondary)]"
                          : "bg-[var(--cr-bg)] hover:bg-[var(--cr-bg-tertiary)]"
                      }`}
                    >
                      {logo}
                    </button>
                  ))}
                </div>
              </div>

              {/* Emblem */}
              <div>
                <label className="block text-sm font-medium text-[var(--cr-fg)] mb-2">Club Emblem</label>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                  {emblemOptions.map((emblem) => (
                    <button
                      key={emblem.id}
                      onClick={() => setSelectedEmblem(emblem.id)}
                      className={`flex flex-col items-center gap-1 rounded-lg p-2 transition-all ${
                        selectedEmblem === emblem.id
                          ? "ring-2 ring-[rgb(var(--cr-accent-rgb))] ring-offset-2 ring-offset-[var(--cr-bg-secondary)]"
                          : "hover:bg-[var(--cr-bg-tertiary)]"
                      }`}
                    >
                      <div className={`h-7 w-7 rounded-full bg-gradient-to-br ${emblem.color}`} />
                      <span className="text-[9px] text-[var(--cr-fg-muted)]">{emblem.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Privacy */}
              <div>
                <label className="block text-sm font-medium text-[var(--cr-fg)] mb-2">Privacy</label>
                <div className="grid gap-2 sm:grid-cols-2">
                  <button
                    onClick={() => setPrivacy("public")}
                    className={`rounded-lg border p-3 text-left transition-all ${
                      privacy === "public"
                        ? "border-[rgb(var(--cr-accent-rgb))] bg-[rgba(var(--cr-accent-rgb),0.1)]"
                        : "border-[var(--cr-border)] bg-[var(--cr-bg)] hover:border-[var(--cr-fg-muted)]"
                    }`}
                  >
                    <span className="text-sm font-medium text-[var(--cr-fg)]">🌐 Public</span>
                    <p className="mt-0.5 text-xs text-[var(--cr-fg-muted)]">Anyone can join</p>
                  </button>
                  <button
                    onClick={() => setPrivacy("private")}
                    className={`rounded-lg border p-3 text-left transition-all ${
                      privacy === "private"
                        ? "border-[rgb(var(--cr-accent-rgb))] bg-[rgba(var(--cr-accent-rgb),0.1)]"
                        : "border-[var(--cr-border)] bg-[var(--cr-bg)] hover:border-[var(--cr-fg-muted)]"
                    }`}
                  >
                    <span className="text-sm font-medium text-[var(--cr-fg)]">🔒 Private</span>
                    <p className="mt-0.5 text-xs text-[var(--cr-fg-muted)]">Approve requests</p>
                  </button>
                </div>
              </div>

              {/* Max Members */}
              <div>
                <label className="block text-sm font-medium text-[var(--cr-fg)] mb-2">Max Members</label>
                <div className="grid grid-cols-4 gap-2">
                  {([10, 20, 30, 40] as MaxMembers[]).map((num) => (
                    <button
                      key={num}
                      onClick={() => setMaxMembers(num)}
                      className={`rounded-lg border py-2 text-center transition-all ${
                        maxMembers === num
                          ? "border-[rgb(var(--cr-accent-rgb))] bg-[rgba(var(--cr-accent-rgb),0.1)] text-[rgb(var(--cr-accent-rgb))]"
                          : "border-[var(--cr-border)] bg-[var(--cr-bg)] text-[var(--cr-fg-muted)] hover:border-[var(--cr-fg-muted)]"
                      }`}
                    >
                      <div className="text-base font-semibold">{num}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg)] p-3">
                <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-[var(--cr-fg-muted)]">Preview</p>
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${
                    emblemOptions.find((e) => e.id === selectedEmblem)?.color ?? "from-blue-500 to-cyan-500"
                  } text-2xl`}>
                    {selectedLogo}
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--cr-fg)]">{clubName || "Club Name"}</div>
                    <div className="text-xs text-[var(--cr-fg-muted)]">
                      {privacy === "private" ? "🔒 Private" : "🌐 Public"} • Max {maxMembers}
                    </div>
                  </div>
                </div>
              </div>

              {/* Create Button */}
              <button
                onClick={handleCreateClub}
                disabled={!clubName.trim() || creating}
                className="w-full rounded-lg bg-[rgb(var(--cr-accent-rgb))] py-2.5 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? "Creating..." : "Create Club"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
