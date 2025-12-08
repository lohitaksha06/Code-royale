"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/auth/login", label: "Login" },
  { href: "/auth/signup", label: "Sign up" },
];

export function Navigation() {
  const pathname = usePathname();

  if (pathname?.startsWith("/home")) {
    return null;
  }

  const activeMap = useMemo(() => {
    return navItems.reduce<Record<string, boolean>>((acc, item) => {
      const isActive = item.href === "/"
        ? pathname === "/"
        : pathname?.startsWith(item.href);
      acc[item.href] = Boolean(isActive);
      return acc;
    }, {});
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="group inline-flex items-center gap-3">
          <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-sky-500/50 bg-slate-900/80 shadow-[0_0_24px_rgba(56,189,248,0.3)] transition group-hover:border-sky-300 group-hover:shadow-[0_0_32px_rgba(56,189,248,0.45)]">
            <Image
              src="/images/crimage.png"
              alt="Code Royale logo"
              fill
              className="object-cover"
              sizes="40px"
              priority
            />
          </span>
          <span className="text-lg font-semibold tracking-widest text-sky-100 group-hover:text-sky-200">
            CODE ROYALE
          </span>
        </Link>
        <nav className="flex items-center gap-1 rounded-full border border-sky-500/20 bg-slate-900/50 px-2 py-1 shadow-[0_0_35px_rgba(56,189,248,0.15)]">
          {navItems.map((item) => {
            const isActive = activeMap[item.href];
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative overflow-hidden rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-sky-500/20 text-sky-100"
                    : "text-sky-200/70 hover:bg-sky-500/10 hover:text-sky-100"
                }`}
              >
                {isActive && (
                  <span className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_65%)]" />
                )}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
