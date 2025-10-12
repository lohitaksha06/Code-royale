# ⚔️ Code Royale

Code Royale is a real-time, competitive coding battle game that turns problem-solving into a fast-paced duel. Players go head-to-head solving coding challenges under intense time pressure, racing to ship the most accurate solution before the clock hits zero.

---

## Table of Contents
- [Vision](#vision)
- [Game Modes](#game-modes)
- [Core Systems](#core-systems)
- [Tech Stack](#tech-stack)
- [Experience Goals](#experience-goals)
- [High-Level Architecture](#high-level-architecture)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Vision
Make coding feel like a high-octane multiplayer sport. Every match rewards speed, accuracy, and smart strategy while delivering immediate feedback, slick visuals, and a sense of progression.

---

## Game Modes

### 🧠 Bullet Mode
- 30–60 second skirmishes with streamlined, beginner-friendly prompts.
- Designed for warm-ups and casual play.

### ⚔️ League Battles
- Ranked ladder with medium-to-hard problems.
- Configurable timers: 1, 3, or 5 minutes.
- ELO-style gains and losses determine placement in tiered leagues from Bronze to Royale Champion.

### 🤖 Bot Battles
- Offline practice against AI opponents.
- Bots mimic human reaction times, mistakes, and varied strategies.
- Ideal for honing skills before stepping into ranked matches.

---

## Core Systems

### Real-Time PvP
- Matchmaking pairs fighters through Firebase services.
- Shared prompts, synchronized timers, and live scoreboards.
- Automatic verdicts and match results at the final buzzer.

### Player Profiles & Progression
- Firebase Auth (Google, email, GitHub, etc.).
- Persistent player stats: rank, win/loss, streaks, accuracy, fastest solves.
- XP boosts via daily and weekly quests.

### Leaderboards & Ranks
- Global and regional boards update in real time.
- Tiered ranks: Bronze → Silver → Gold → Diamond → Royale Champion.
- ELO balancing keeps competition fair and rewarding.

### Question Engine
- Curated bank of easy, medium, and hard problems.
- Each challenge bundles title, description, examples, and test cases.
- Optional hints available at a strategic score penalty.

### Judging Sandbox
- Secure backend execution (Firebase Cloud Functions to start; Docker microservices later).
- Evaluates correctness, runtime, and performance thresholds.
- Instant feedback with standardized verdicts: Pass, Fail, or Compilation Error.

---

## Tech Stack

### Frontend
- Next.js 14 (App Router) for hybrid SSR and client rendering.
- TypeScript for type-safe gameplay logic.
- Tailwind CSS for rapid UI iteration.
- Framer Motion for reactive animations and transitions.
- Monaco Editor for an in-browser VS Code feel.
- Firebase SDK v9 for auth, data sync, and live match updates.

### Backend & Infrastructure
- Firebase Firestore for core data persistence (users, matches, questions).
- Firebase Auth for secure identity and session flows.
- Firebase Cloud Functions to orchestrate matchmaking, judging, and leaderboard updates.
- Firebase Realtime Database for low-latency battle state synchronization.
- Firebase Hosting for global, CDN-backed delivery.

---

## Experience Goals
- Modern competitive vibe inspired by titles like Valorant and Chess.com.
- Frictionless onboarding with subtle animations and delightful micro-interactions.
- Minimal UI clutter—keep the focus on coding and real-time feedback.

---

## High-Level Architecture
```
Player Client (Next.js + Monaco)
        │
        ├── Firebase Auth ──┐
        │                  │
        ├── Firestore ◄────┼── Player profiles, matches, question metadata
        │                  │
        ├── Realtime DB ───┘── Live match state & timers
        │
        └── Cloud Functions ── Judging sandbox, ELO updates, matchmaking
```

---

## Roadmap
- [ ] Scaffold Next.js 14 app with Tailwind and Firebase integration.
- [ ] Implement authentication flow and basic player profiles.
- [ ] Build the matchmaking queue and real-time duel interface.
- [ ] Integrate question engine and judge sandbox for code execution.
- [ ] Ship leaderboards, ranks, and seasonal challenges.
- [ ] Polish animations, transitions, and audio cues.
- [ ] Launch private alpha, gather feedback, iterate.

---

## Contributing
Contributions are welcome once the core scaffolding lands. If you have ideas or want to help, feel free to open an issue or submit a pull request.

---

## License
TBD — project is currently in active planning.
