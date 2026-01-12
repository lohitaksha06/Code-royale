"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";

const sidebarItems = [
  {
    id: "home",
    label: "Dashboard",
    href: "/home",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: "practice",
    label: "Practice",
    href: "/practice",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
      </svg>
    ),
  },
  {
    id: "game-modes",
    label: "Game Modes",
    href: "/game-modes",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>
    ),
  },
  {
    id: "leaderboard",
    label: "Leaderboard",
    href: "/leaderboard",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
      </svg>
    ),
  },
  {
    id: "clubs",
    label: "Clubs",
    href: "/clubs",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
];

const bottomItems = [
  {
    id: "friends",
    label: "Friends",
    href: "/friends",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    id: "profile",
    label: "Profile",
    href: "/profile",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    href: "/settings",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

type AppShellProps = {
  children: ReactNode;
  showSidebar?: boolean;
};

export function AppShell({ children, showSidebar = true }: AppShellProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === "/home") return pathname === "/home";
    return pathname?.startsWith(href);
  };

  return (
    <div className="flex min-h-screen bg-[var(--cr-bg)]">
      {/* Sidebar */}
      {showSidebar && (
        <aside
          className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] transition-all duration-300 ${
            isCollapsed ? "w-16" : "w-60"
          }`}
        >
          {/* Logo */}
          <div className="flex h-14 items-center border-b border-[var(--cr-border)] px-3">
            <Link href="/home" className="flex items-center gap-3">
              <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[rgba(var(--cr-accent-rgb),0.15)]">
                <Image
                  src="/images/crimage.png"
                  alt="Code Royale"
                  fill
                  className="object-cover"
                  sizes="32px"
                  priority
                />
              </div>
              {!isCollapsed && (
                <span className="text-sm font-semibold tracking-wider text-[var(--cr-fg)]">
                  CODE ROYALE
                </span>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-2">
            <ul className="space-y-1">
              {sidebarItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                        active
                          ? "bg-[rgba(var(--cr-accent-rgb),0.15)] text-[rgb(var(--cr-accent-rgb))]"
                          : "text-[var(--cr-fg-muted)] hover:bg-[var(--cr-bg-tertiary)] hover:text-[var(--cr-fg)]"
                      }`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <span className={active ? "text-[rgb(var(--cr-accent-rgb))]" : ""}>
                        {item.icon}
                      </span>
                      {!isCollapsed && <span>{item.label}</span>}
                      {active && !isCollapsed && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[rgb(var(--cr-accent-rgb))]" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom items */}
          <div className="border-t border-[var(--cr-border)] p-2">
            <ul className="space-y-1">
              {bottomItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                        active
                          ? "bg-[rgba(var(--cr-accent-rgb),0.15)] text-[rgb(var(--cr-accent-rgb))]"
                          : "text-[var(--cr-fg-muted)] hover:bg-[var(--cr-bg-tertiary)] hover:text-[var(--cr-fg)]"
                      }`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <span className={active ? "text-[rgb(var(--cr-accent-rgb))]" : ""}>
                        {item.icon}
                      </span>
                      {!isCollapsed && <span>{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Collapse toggle */}
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs text-[var(--cr-fg-muted)] transition-colors hover:bg-[var(--cr-bg-tertiary)] hover:text-[var(--cr-fg)]"
            >
              <svg
                className={`h-4 w-4 transition-transform ${isCollapsed ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              {!isCollapsed && <span>Collapse</span>}
            </button>
          </div>
        </aside>
      )}

      {/* Main content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          showSidebar ? (isCollapsed ? "ml-16" : "ml-60") : ""
        }`}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[var(--cr-border)] bg-[var(--cr-bg)]/95 px-6 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="flex items-center gap-2 rounded-lg border border-[var(--cr-border)] bg-[var(--cr-bg-secondary)] px-3 py-1.5">
              <svg className="h-4 w-4 text-[var(--cr-fg-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="search"
                placeholder="Search problems..."
                className="w-48 bg-transparent text-sm text-[var(--cr-fg)] placeholder:text-[var(--cr-fg-muted)] focus:outline-none lg:w-64"
              />
              <kbd className="hidden rounded border border-[var(--cr-border)] bg-[var(--cr-bg)] px-1.5 py-0.5 text-[10px] text-[var(--cr-fg-muted)] lg:inline-block">
                ⌘K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Status indicator */}
            <div className="flex items-center gap-2 text-xs text-[var(--cr-fg-muted)]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span className="hidden sm:inline">Online</span>
            </div>

            {/* Notifications */}
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--cr-fg-muted)] transition-colors hover:bg-[var(--cr-bg-secondary)] hover:text-[var(--cr-fg)]"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </button>

            {/* User avatar */}
            <Link
              href="/profile"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgba(var(--cr-accent-rgb),0.2)] text-xs font-semibold text-[rgb(var(--cr-accent-rgb))] transition-all hover:bg-[rgba(var(--cr-accent-rgb),0.3)]"
            >
              CR
            </Link>
          </div>
        </header>

        {/* Page content */}
        <div className="min-h-[calc(100vh-3.5rem)]">{children}</div>
      </main>
    </div>
  );
}
