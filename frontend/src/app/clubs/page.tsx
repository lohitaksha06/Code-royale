"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "../../components/app-shell";

type Tab = "browse" | "create" | "my-club";

type ClubPrivacy = "public" | "private";
type MaxMembers = 10 | 20 | 30 | 40;

// Mock data for top clubs
const topClubs = [
  {
    id: "1",
    name: "Code Warriors",
    logo: "⚔️",
    emblem: "sword",
    trophies: 15420,
    members: 38,
    maxMembers: 40,
    privacy: "public" as ClubPrivacy,
    rank: 1,
  },
  {
    id: "2",
    name: "Binary Beasts",
    logo: "🐉",
    emblem: "dragon",
    trophies: 12850,
    members: 35,
    maxMembers: 40,
    privacy: "public" as ClubPrivacy,
    rank: 2,
  },
  {
    id: "3",
    name: "Algorithm Aces",
    logo: "🎯",
    emblem: "target",
    trophies: 11200,
    members: 28,
    maxMembers: 30,
    privacy: "private" as ClubPrivacy,
    rank: 3,
  },
  {
    id: "4",
    name: "Syntax Slayers",
    logo: "⚡",
    emblem: "lightning",
    trophies: 9800,
    members: 20,
    maxMembers: 20,
    privacy: "public" as ClubPrivacy,
    rank: 4,
  },
  {
    id: "5",
    name: "Debug Dynasty",
    logo: "🔥",
    emblem: "fire",
    trophies: 8500,
    members: 19,
    maxMembers: 30,
    privacy: "private" as ClubPrivacy,
    rank: 5,
  },
];

const logoOptions = ["⚔️", "🐉", "🎯", "⚡", "🔥", "🏆", "💎", "🚀", "👑", "🦁", "🐺", "🦅"];
const emblemOptions = [
  { id: "sword", name: "Sword", color: "from-red-500 to-orange-500" },
  { id: "shield", name: "Shield", color: "from-blue-500 to-cyan-500" },
  { id: "crown", name: "Crown", color: "from-amber-500 to-yellow-500" },
  { id: "star", name: "Star", color: "from-purple-500 to-pink-500" },
  { id: "lightning", name: "Lightning", color: "from-cyan-500 to-blue-500" },
  { id: "fire", name: "Fire", color: "from-orange-500 to-red-500" },
];

export default function ClubsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("browse");
  const [searchQuery, setSearchQuery] = useState("");

  // Create club form state
  const [clubName, setClubName] = useState("");
  const [selectedLogo, setSelectedLogo] = useState(logoOptions[0]);
  const [selectedEmblem, setSelectedEmblem] = useState(emblemOptions[0].id);
  const [privacy, setPrivacy] = useState<ClubPrivacy>("public");
  const [maxMembers, setMaxMembers] = useState<MaxMembers>(20);
  const [creating, setCreating] = useState(false);

  // Mock user's club (null = not in a club)
  const [myClub, setMyClub] = useState<typeof topClubs[0] | null>(null);

  const filteredClubs = topClubs.filter((club) =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateClub = async () => {
    if (!clubName.trim()) return;
    setCreating(true);
    
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    
    const newClub = {
      id: crypto.randomUUID(),
      name: clubName,
      logo: selectedLogo,
      emblem: selectedEmblem,
      trophies: 0,
      members: 1,
      maxMembers,
      privacy,
      rank: 999,
    };
    
    setMyClub(newClub);
    setActiveTab("my-club");
    setCreating(false);
  };

  const handleJoinClub = (club: typeof topClubs[0]) => {
    if (club.privacy === "private") {
      // Show request sent notification
      alert(`Request sent to join ${club.name}! The club host will review your request.`);
    } else {
      setMyClub(club);
      setActiveTab("my-club");
    }
  };

  const handleLeaveClub = () => {
    if (confirm("Are you sure you want to leave this club?")) {
      setMyClub(null);
      setActiveTab("browse");
    }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "browse", label: "Browse Clubs" },
    { id: "create", label: "Create Club" },
    { id: "my-club", label: "My Club" },
  ];

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--cr-fg)]">Clubs</h1>
          <p className="mt-1 text-sm text-[var(--cr-fg-muted)]">
            Join a club to compete with teammates and earn bonus trophies
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-[rgb(var(--cr-accent-rgb))] text-white"
                  : "text-[var(--cr-fg-muted)] hover:text-[var(--cr-fg)]"
              }`}
            >
              {tab.label}
              {tab.id === "my-club" && myClub && (
                <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              )}
            </button>
          ))}
        </div>

        {/* Browse Clubs Tab */}
        {activeTab === "browse" && (
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--cr-fg-muted)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search clubs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg)] py-2.5 pl-10 pr-4 text-sm text-[var(--cr-fg)] placeholder:text-[var(--cr-fg-muted)] focus:border-[rgb(var(--cr-accent-rgb))] focus:outline-none"
              />
            </div>

            {/* Top Clubs List */}
            <div className="rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)]">
              <div className="border-b border-[var(--cr-border)] px-4 py-3">
                <h2 className="font-semibold text-[var(--cr-fg)]">Top Clubs by Trophies</h2>
              </div>
              <div className="divide-y divide-[var(--cr-border)]">
                {filteredClubs.map((club) => (
                  <div
                    key={club.id}
                    className="flex items-center gap-4 p-4 hover:bg-[var(--cr-bg-tertiary)] transition-colors"
                  >
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
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-[rgba(var(--cr-accent-rgb),0.2)] to-transparent text-2xl">
                      {club.logo}
                    </div>

                    {/* Club Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[var(--cr-fg)]">{club.name}</span>
                        {club.privacy === "private" && (
                          <svg className="h-4 w-4 text-[var(--cr-fg-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

                    {/* Join Button */}
                    {myClub?.id === club.id ? (
                      <span className="rounded-lg bg-emerald-500/20 px-3 py-1.5 text-xs font-medium text-emerald-400">
                        Joined
                      </span>
                    ) : club.members >= club.maxMembers ? (
                      <span className="rounded-lg bg-[var(--cr-bg-tertiary)] px-3 py-1.5 text-xs font-medium text-[var(--cr-fg-muted)]">
                        Full
                      </span>
                    ) : (
                      <button
                        onClick={() => handleJoinClub(club)}
                        className="rounded-lg bg-[rgb(var(--cr-accent-rgb))] px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 transition-opacity"
                      >
                        {club.privacy === "private" ? "Request" : "Join"}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Create Club Tab */}
        {activeTab === "create" && (
          <div className="rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] p-6">
            {myClub ? (
              <div className="text-center py-8">
                <p className="text-[var(--cr-fg-muted)]">
                  You're already in a club. Leave your current club to create a new one.
                </p>
                <button
                  onClick={() => setActiveTab("my-club")}
                  className="mt-4 text-sm text-[rgb(var(--cr-accent-rgb))] hover:underline"
                >
                  View My Club →
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-[var(--cr-fg)]">Create a New Club</h2>

                {/* Club Name */}
                <div>
                  <label className="block text-sm font-medium text-[var(--cr-fg)] mb-2">
                    Club Name
                  </label>
                  <input
                    type="text"
                    value={clubName}
                    onChange={(e) => setClubName(e.target.value)}
                    placeholder="Enter club name..."
                    maxLength={24}
                    className="w-full rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg)] px-4 py-2.5 text-sm text-[var(--cr-fg)] placeholder:text-[var(--cr-fg-muted)] focus:border-[rgb(var(--cr-accent-rgb))] focus:outline-none"
                  />
                  <p className="mt-1 text-xs text-[var(--cr-fg-muted)]">{clubName.length}/24 characters</p>
                </div>

                {/* Logo Selection */}
                <div>
                  <label className="block text-sm font-medium text-[var(--cr-fg)] mb-2">
                    Club Logo
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {logoOptions.map((logo) => (
                      <button
                        key={logo}
                        onClick={() => setSelectedLogo(logo)}
                        className={`flex h-12 w-12 items-center justify-center rounded-lg text-2xl transition-all ${
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

                {/* Emblem Selection */}
                <div>
                  <label className="block text-sm font-medium text-[var(--cr-fg)] mb-2">
                    Club Emblem
                  </label>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                    {emblemOptions.map((emblem) => (
                      <button
                        key={emblem.id}
                        onClick={() => setSelectedEmblem(emblem.id)}
                        className={`flex flex-col items-center gap-1 rounded-lg p-3 transition-all ${
                          selectedEmblem === emblem.id
                            ? "ring-2 ring-[rgb(var(--cr-accent-rgb))] ring-offset-2 ring-offset-[var(--cr-bg-secondary)]"
                            : "hover:bg-[var(--cr-bg-tertiary)]"
                        }`}
                      >
                        <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${emblem.color}`} />
                        <span className="text-xs text-[var(--cr-fg-muted)]">{emblem.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Privacy Setting */}
                <div>
                  <label className="block text-sm font-medium text-[var(--cr-fg)] mb-2">
                    Privacy
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      onClick={() => setPrivacy("public")}
                      className={`rounded-lg border p-4 text-left transition-all ${
                        privacy === "public"
                          ? "border-[rgb(var(--cr-accent-rgb))] bg-[rgba(var(--cr-accent-rgb),0.1)]"
                          : "border-[var(--cr-border)] bg-[var(--cr-bg)] hover:border-[var(--cr-fg-muted)]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium text-[var(--cr-fg)]">Public</span>
                      </div>
                      <p className="mt-1 text-xs text-[var(--cr-fg-muted)]">
                        Anyone can join immediately
                      </p>
                    </button>
                    <button
                      onClick={() => setPrivacy("private")}
                      className={`rounded-lg border p-4 text-left transition-all ${
                        privacy === "private"
                          ? "border-[rgb(var(--cr-accent-rgb))] bg-[rgba(var(--cr-accent-rgb),0.1)]"
                          : "border-[var(--cr-border)] bg-[var(--cr-bg)] hover:border-[var(--cr-fg-muted)]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="font-medium text-[var(--cr-fg)]">Private</span>
                      </div>
                      <p className="mt-1 text-xs text-[var(--cr-fg-muted)]">
                        You approve join requests
                      </p>
                    </button>
                  </div>
                </div>

                {/* Max Members */}
                <div>
                  <label className="block text-sm font-medium text-[var(--cr-fg)] mb-2">
                    Maximum Members
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {([10, 20, 30, 40] as MaxMembers[]).map((num) => (
                      <button
                        key={num}
                        onClick={() => setMaxMembers(num)}
                        className={`rounded-lg border py-3 text-center transition-all ${
                          maxMembers === num
                            ? "border-[rgb(var(--cr-accent-rgb))] bg-[rgba(var(--cr-accent-rgb),0.1)] text-[rgb(var(--cr-accent-rgb))]"
                            : "border-[var(--cr-border)] bg-[var(--cr-bg)] text-[var(--cr-fg-muted)] hover:border-[var(--cr-fg-muted)]"
                        }`}
                      >
                        <div className="text-lg font-semibold">{num}</div>
                        <div className="text-xs opacity-70">members</div>
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-[var(--cr-fg-muted)]">
                    💡 Larger clubs earn bonus trophies from club battles
                  </p>
                </div>

                {/* Preview */}
                <div className="rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg)] p-4">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--cr-fg-muted)]">
                    Preview
                  </p>
                  <div className="flex items-center gap-4">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${
                      emblemOptions.find((e) => e.id === selectedEmblem)?.color ?? "from-blue-500 to-cyan-500"
                    } text-3xl`}>
                      {selectedLogo}
                    </div>
                    <div>
                      <div className="font-semibold text-[var(--cr-fg)]">
                        {clubName || "Club Name"}
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-[var(--cr-fg-muted)]">
                        <span>{privacy === "private" ? "🔒 Private" : "🌐 Public"}</span>
                        <span>•</span>
                        <span>Max {maxMembers} members</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Create Button */}
                <button
                  onClick={handleCreateClub}
                  disabled={!clubName.trim() || creating}
                  className="w-full rounded-lg bg-[rgb(var(--cr-accent-rgb))] py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creating ? "Creating..." : "Create Club"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* My Club Tab */}
        {activeTab === "my-club" && (
          <div>
            {myClub ? (
              <div className="space-y-6">
                {/* Club Header */}
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
                <div className="grid gap-4 sm:grid-cols-2">
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
                <div className="rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)]">
                  <div className="border-b border-[var(--cr-border)] px-4 py-3">
                    <h3 className="font-semibold text-[var(--cr-fg)]">Members</h3>
                  </div>
                  <div className="divide-y divide-[var(--cr-border)]">
                    {/* Mock member - You */}
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
                    {/* Empty state for other members */}
                    <div className="p-8 text-center text-[var(--cr-fg-muted)]">
                      <p className="text-sm">No other members yet</p>
                      <p className="mt-1 text-xs">Invite friends to join your club!</p>
                    </div>
                  </div>
                </div>

                {/* Join Requests (for private clubs) */}
                {myClub.privacy === "private" && (
                  <div className="rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)]">
                    <div className="border-b border-[var(--cr-border)] px-4 py-3">
                      <h3 className="font-semibold text-[var(--cr-fg)]">Join Requests</h3>
                    </div>
                    <div className="p-8 text-center text-[var(--cr-fg-muted)]">
                      <p className="text-sm">No pending requests</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] p-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--cr-bg-tertiary)]">
                  <svg className="h-8 w-8 text-[var(--cr-fg-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[var(--cr-fg)]">You're not in a club</h3>
                <p className="mt-2 text-sm text-[var(--cr-fg-muted)]">
                  Join an existing club or create your own to start earning bonus trophies!
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  <button
                    onClick={() => setActiveTab("browse")}
                    className="rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg)] px-4 py-2 text-sm font-medium text-[var(--cr-fg)] hover:bg-[var(--cr-bg-tertiary)] transition-colors"
                  >
                    Browse Clubs
                  </button>
                  <button
                    onClick={() => setActiveTab("create")}
                    className="rounded-lg bg-[rgb(var(--cr-accent-rgb))] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                  >
                    Create Club
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
