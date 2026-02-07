"use client";

import { useState, useMemo } from "react";
import { AppShell } from "../../components/app-shell";

/* ── League tier config ─────────────────────────────────── */
type League = "bronze" | "silver" | "gold" | "platinum" | "diamond";

const leagueTiers: {
  id: League;
  label: string;
  color: string;
  bg: string;
  border: string;
  icon: string;
  minTrophies: number;
}[] = [
  { id: "bronze",   label: "Bronze",   color: "text-amber-700",   bg: "bg-amber-900/30",   border: "border-amber-700/40",   icon: "🥉", minTrophies: 0 },
  { id: "silver",   label: "Silver",   color: "text-slate-300",   bg: "bg-slate-600/20",   border: "border-slate-400/40",   icon: "🥈", minTrophies: 1000 },
  { id: "gold",     label: "Gold",     color: "text-amber-400",   bg: "bg-amber-500/20",   border: "border-amber-400/40",   icon: "🥇", minTrophies: 2500 },
  { id: "platinum", label: "Platinum", color: "text-cyan-300",    bg: "bg-cyan-500/15",    border: "border-cyan-400/40",    icon: "💎", minTrophies: 5000 },
  { id: "diamond",  label: "Diamond",  color: "text-violet-300",  bg: "bg-violet-500/15",  border: "border-violet-400/40",  icon: "👑", minTrophies: 10000 },
];

function getLeague(trophies: number): League {
  if (trophies >= 10000) return "diamond";
  if (trophies >= 5000) return "platinum";
  if (trophies >= 2500) return "gold";
  if (trophies >= 1000) return "silver";
  return "bronze";
}

function getTierConfig(league: League) {
  return leagueTiers.find((t) => t.id === league)!;
}

/* ── Mode type ──────────────────────────────────────────── */
type Mode = "1v1" | "2v2";

/* ── Mock leaderboard data ──────────────────────────────── */
const mockPlayers = [
  { id: "1",  username: "NeonCoder",     avatar: "NC", trophies_1v1: 12450, trophies_2v2: 8900,  wins_1v1: 245, losses_1v1: 80,  wins_2v2: 120, losses_2v2: 40 },
  { id: "2",  username: "ByteStorm",     avatar: "BS", trophies_1v1: 11800, trophies_2v2: 10200, wins_1v1: 230, losses_1v1: 95,  wins_2v2: 150, losses_2v2: 35 },
  { id: "3",  username: "AlgoKnight",    avatar: "AK", trophies_1v1: 10500, trophies_2v2: 9100,  wins_1v1: 198, losses_1v1: 72,  wins_2v2: 130, losses_2v2: 55 },
  { id: "4",  username: "CodePhantom",   avatar: "CP", trophies_1v1: 9200,  trophies_2v2: 7800,  wins_1v1: 175, losses_1v1: 90,  wins_2v2: 100, losses_2v2: 60 },
  { id: "5",  username: "BinaryWraith",  avatar: "BW", trophies_1v1: 8400,  trophies_2v2: 11500, wins_1v1: 160, losses_1v1: 85,  wins_2v2: 180, losses_2v2: 30 },
  { id: "6",  username: "SyntaxSage",    avatar: "SS", trophies_1v1: 7600,  trophies_2v2: 6500,  wins_1v1: 140, losses_1v1: 75,  wins_2v2: 95,  losses_2v2: 50 },
  { id: "7",  username: "LoopLegend",    avatar: "LL", trophies_1v1: 6800,  trophies_2v2: 5900,  wins_1v1: 130, losses_1v1: 70,  wins_2v2: 85,  losses_2v2: 45 },
  { id: "8",  username: "StackSamurai",  avatar: "SM", trophies_1v1: 5500,  trophies_2v2: 4800,  wins_1v1: 110, losses_1v1: 65,  wins_2v2: 70,  losses_2v2: 40 },
  { id: "9",  username: "HeapHero",      avatar: "HH", trophies_1v1: 4200,  trophies_2v2: 3600,  wins_1v1: 95,  losses_1v1: 60,  wins_2v2: 55,  losses_2v2: 35 },
  { id: "10", username: "RecursionKing", avatar: "RK", trophies_1v1: 3800,  trophies_2v2: 5200,  wins_1v1: 85,  losses_1v1: 55,  wins_2v2: 78,  losses_2v2: 32 },
  { id: "11", username: "VoidVoyager",   avatar: "VV", trophies_1v1: 2800,  trophies_2v2: 2400,  wins_1v1: 70,  losses_1v1: 45,  wins_2v2: 40,  losses_2v2: 25 },
  { id: "12", username: "PixelProwler",  avatar: "PP", trophies_1v1: 2200,  trophies_2v2: 1900,  wins_1v1: 55,  losses_1v1: 40,  wins_2v2: 30,  losses_2v2: 20 },
  { id: "13", username: "NodeNinja",     avatar: "NN", trophies_1v1: 1500,  trophies_2v2: 1100,  wins_1v1: 40,  losses_1v1: 30,  wins_2v2: 20,  losses_2v2: 15 },
  { id: "14", username: "FuncFalcon",    avatar: "FF", trophies_1v1: 900,   trophies_2v2: 650,   wins_1v1: 25,  losses_1v1: 20,  wins_2v2: 12,  losses_2v2: 10 },
  { id: "15", username: "LambdaLion",    avatar: "LD", trophies_1v1: 400,   trophies_2v2: 300,   wins_1v1: 12,  losses_1v1: 10,  wins_2v2: 5,   losses_2v2: 5 },
];

const topClubs: { id: string; name: string; trophies: number }[] = [];

/* ── Component ──────────────────────────────────────────── */
export default function LeaderboardPage() {
  const [mode, setMode] = useState<Mode>("1v1");
  const [selectedLeague, setSelectedLeague] = useState<League | "all">("all");

  // Mock: current user has 0 matches = unranked
  const myStats = {
    trophies_1v1: 0,
    trophies_2v2: 0,
    wins_1v1: 0,
    losses_1v1: 0,
    wins_2v2: 0,
    losses_2v2: 0,
    matchesPlayed: 0,
  };

  const isUnranked = myStats.matchesPlayed === 0;
  const myTrophies = mode === "1v1" ? myStats.trophies_1v1 : myStats.trophies_2v2;
  const myLeague = isUnranked ? null : getLeague(myTrophies);

  // Sort players by trophies for selected mode
  const sortedPlayers = useMemo(() => {
    const key = mode === "1v1" ? "trophies_1v1" : "trophies_2v2";
    const sorted = [...mockPlayers].sort((a, b) => b[key] - a[key]);

    if (selectedLeague === "all") return sorted;
    return sorted.filter((p) => getLeague(p[key]) === selectedLeague);
  }, [mode, selectedLeague]);

  // Top 10 in your league
  const myLeaguePlayers = useMemo(() => {
    if (!myLeague) return [];
    const key = mode === "1v1" ? "trophies_1v1" : "trophies_2v2";
    return [...mockPlayers]
      .filter((p) => getLeague(p[key]) === myLeague)
      .sort((a, b) => b[key] - a[key])
      .slice(0, 10);
  }, [myLeague, mode]);

  const trophyKey = mode === "1v1" ? "trophies_1v1" : "trophies_2v2";
  const winsKey   = mode === "1v1" ? "wins_1v1" : "wins_2v2";
  const lossesKey = mode === "1v1" ? "losses_1v1" : "losses_2v2";

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--cr-fg)]">Leaderboard</h1>
          <p className="mt-1 text-sm text-[var(--cr-fg-muted)]">
            Compete, climb ranks, and dominate the leagues
          </p>
        </div>

        {/* Your Rank Card */}
        <div className="mb-6 rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(var(--cr-accent-rgb),0.2)] text-lg font-bold text-[rgb(var(--cr-accent-rgb))]">
                You
              </div>
              <div>
                <div className="text-sm text-[var(--cr-fg-muted)]">Your Status ({mode})</div>
                {isUnranked ? (
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-lg font-bold text-[var(--cr-fg)]">Unranked</span>
                    <span className="rounded bg-[var(--cr-bg-tertiary)] px-2 py-0.5 text-xs text-[var(--cr-fg-muted)]">
                      Play a match to get ranked!
                    </span>
                  </div>
                ) : (
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-lg font-bold text-[var(--cr-fg)]">
                      {myTrophies.toLocaleString()} Trophies
                    </span>
                    {myLeague && (
                      <span className={`rounded px-2 py-0.5 text-xs font-medium ${getTierConfig(myLeague).bg} ${getTierConfig(myLeague).color}`}>
                        {getTierConfig(myLeague).icon} {getTierConfig(myLeague).label}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* W/L */}
            <div className="flex gap-6 text-center">
              <div>
                <div className="text-lg font-bold text-emerald-400">{mode === "1v1" ? myStats.wins_1v1 : myStats.wins_2v2}</div>
                <div className="text-xs text-[var(--cr-fg-muted)]">Wins</div>
              </div>
              <div>
                <div className="text-lg font-bold text-red-400">{mode === "1v1" ? myStats.losses_1v1 : myStats.losses_2v2}</div>
                <div className="text-xs text-[var(--cr-fg-muted)]">Losses</div>
              </div>
              <div>
                <div className="text-lg font-bold text-[var(--cr-fg)]">{myStats.matchesPlayed}</div>
                <div className="text-xs text-[var(--cr-fg-muted)]">Played</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="mb-4 flex gap-2">
          {(["1v1", "2v2"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition-all ${
                mode === m
                  ? "bg-[rgb(var(--cr-accent-rgb))] text-white shadow-lg shadow-[rgba(var(--cr-accent-rgb),0.3)]"
                  : "border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] text-[var(--cr-fg-muted)] hover:text-[var(--cr-fg)]"
              }`}
            >
              {m} Ranked
            </button>
          ))}
        </div>

        {/* League Tiers */}
        <div className="mb-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--cr-fg-muted)]">
            Leagues
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedLeague("all")}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                selectedLeague === "all"
                  ? "bg-[rgba(var(--cr-accent-rgb),0.15)] text-[rgb(var(--cr-accent-rgb))] ring-1 ring-[rgb(var(--cr-accent-rgb))]"
                  : "bg-[var(--cr-bg-secondary)] text-[var(--cr-fg-muted)] hover:text-[var(--cr-fg)]"
              }`}
            >
              All Leagues
            </button>
            {leagueTiers.map((tier) => (
              <button
                key={tier.id}
                onClick={() => setSelectedLeague(tier.id)}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  selectedLeague === tier.id
                    ? `${tier.bg} ${tier.color} ring-1 ${tier.border}`
                    : "bg-[var(--cr-bg-secondary)] text-[var(--cr-fg-muted)] hover:text-[var(--cr-fg)]"
                }`}
              >
                {tier.icon} {tier.label}
                <span className="ml-1 opacity-60">({tier.minTrophies.toLocaleString()}+)</span>
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)]">
          <div className="border-b border-[var(--cr-border)] px-4 py-3">
            <h2 className="font-semibold text-[var(--cr-fg)]">
              {selectedLeague === "all"
                ? `Global ${mode} Leaderboard`
                : `${getTierConfig(selectedLeague as League).icon} ${getTierConfig(selectedLeague as League).label} League — ${mode}`}
            </h2>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-[3rem_1fr_6rem_5rem_5rem_5rem] items-center gap-2 border-b border-[var(--cr-border)] px-4 py-2 text-xs font-medium uppercase tracking-wider text-[var(--cr-fg-muted)]">
            <span>#</span>
            <span>Player</span>
            <span className="text-right">Trophies</span>
            <span className="text-right">W</span>
            <span className="text-right">L</span>
            <span className="text-right">League</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-[var(--cr-border)]">
            {sortedPlayers.length === 0 ? (
              <div className="p-8 text-center text-sm text-[var(--cr-fg-muted)]">
                No players in this league yet
              </div>
            ) : (
              sortedPlayers.map((player, idx) => {
                const league = getLeague(player[trophyKey]);
                const tierCfg = getTierConfig(league);
                const rank = idx + 1;
                return (
                  <div
                    key={player.id}
                    className={`grid grid-cols-[3rem_1fr_6rem_5rem_5rem_5rem] items-center gap-2 px-4 py-3 transition-colors hover:bg-[var(--cr-bg-tertiary)] ${
                      rank <= 3 ? "bg-[var(--cr-bg-tertiary)]/50" : ""
                    }`}
                  >
                    {/* Rank */}
                    <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                      rank === 1
                        ? "bg-amber-500/20 text-amber-400"
                        : rank === 2
                        ? "bg-slate-400/20 text-slate-300"
                        : rank === 3
                        ? "bg-orange-500/20 text-orange-400"
                        : "text-[var(--cr-fg-muted)]"
                    }`}>
                      {rank}
                    </div>

                    {/* Player */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(var(--cr-accent-rgb),0.15)] text-xs font-bold text-[rgb(var(--cr-accent-rgb))]">
                        {player.avatar}
                      </div>
                      <span className="font-medium text-[var(--cr-fg)]">{player.username}</span>
                    </div>

                    {/* Trophies */}
                    <div className="text-right">
                      <span className="flex items-center justify-end gap-1 font-semibold text-amber-400">
                        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 4h-1V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v1H5a1 1 0 0 0-1 1v2a4 4 0 0 0 3 3.87A6 6 0 0 0 11 14.9V17H8a1 1 0 0 0 0 2h8a1 1 0 1 0 0-2h-3v-2.1a6 6 0 0 0 4-3.99 4 4 0 0 0 3-3.87V5a1 1 0 0 0-1-1Z"/>
                        </svg>
                        {player[trophyKey].toLocaleString()}
                      </span>
                    </div>

                    {/* Wins */}
                    <div className="text-right text-sm text-emerald-400">{player[winsKey]}</div>

                    {/* Losses */}
                    <div className="text-right text-sm text-red-400">{player[lossesKey]}</div>

                    {/* League */}
                    <div className="flex justify-end">
                      <span className={`rounded px-2 py-0.5 text-[10px] font-medium ${tierCfg.bg} ${tierCfg.color}`}>
                        {tierCfg.icon} {tierCfg.label}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Top 10 in Your League */}
        {!isUnranked && myLeague && myLeaguePlayers.length > 0 && (
          <div className="mt-8 rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)]">
            <div className="border-b border-[var(--cr-border)] px-4 py-3">
              <h2 className="font-semibold text-[var(--cr-fg)]">
                {getTierConfig(myLeague).icon} Top 10 in Your League ({getTierConfig(myLeague).label})
              </h2>
            </div>
            <div className="divide-y divide-[var(--cr-border)]">
              {myLeaguePlayers.map((player, idx) => {
                const tierCfg = getTierConfig(myLeague);
                return (
                  <div
                    key={player.id}
                    className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-[var(--cr-bg-tertiary)]"
                  >
                    <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${tierCfg.bg} ${tierCfg.color}`}>
                      {idx + 1}
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(var(--cr-accent-rgb),0.15)] text-xs font-bold text-[rgb(var(--cr-accent-rgb))]">
                      {player.avatar}
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-[var(--cr-fg)]">{player.username}</span>
                    </div>
                    <span className="flex items-center gap-1 text-sm font-semibold text-amber-400">
                      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 4h-1V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v1H5a1 1 0 0 0-1 1v2a4 4 0 0 0 3 3.87A6 6 0 0 0 11 14.9V17H8a1 1 0 0 0 0 2h8a1 1 0 1 0 0-2h-3v-2.1a6 6 0 0 0 4-3.99 4 4 0 0 0 3-3.87V5a1 1 0 0 0-1-1Z"/>
                      </svg>
                      {player[trophyKey].toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* League Progression Info */}
        <div className="mt-8">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--cr-fg-muted)]">
            League Progression
          </h2>
          <div className="grid gap-3 sm:grid-cols-5">
            {leagueTiers.map((tier, i) => {
              const isMyLeague = myLeague === tier.id;
              return (
                <div
                  key={tier.id}
                  className={`relative rounded-lg border p-4 text-center transition-all ${
                    isMyLeague
                      ? `${tier.border} ${tier.bg} ring-2 ${tier.border}`
                      : "border-[var(--cr-border)] bg-[var(--cr-bg-secondary)]"
                  }`}
                >
                  {isMyLeague && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 rounded bg-[rgb(var(--cr-accent-rgb))] px-2 py-0.5 text-[10px] font-bold text-white">
                      YOU
                    </div>
                  )}
                  <div className="text-2xl">{tier.icon}</div>
                  <div className={`mt-1 text-sm font-semibold ${tier.color}`}>{tier.label}</div>
                  <div className="mt-0.5 text-xs text-[var(--cr-fg-muted)]">
                    {tier.minTrophies === 0 ? "0" : tier.minTrophies.toLocaleString()}+ trophies
                  </div>
                  {i < leagueTiers.length - 1 && (
                    <div className="absolute -right-2 top-1/2 hidden -translate-y-1/2 text-[var(--cr-fg-muted)] sm:block">
                      →
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Clubs (empty for now) */}
        <div className="mt-8 rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)]">
          <div className="border-b border-[var(--cr-border)] px-4 py-3">
            <h2 className="font-semibold text-[var(--cr-fg)]">Top Clubs</h2>
          </div>
          <div className="p-8 text-center text-sm text-[var(--cr-fg-muted)]">
            {topClubs.length === 0 ? "No clubs yet." : ""}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
