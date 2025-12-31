import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navigation } from "../components/navigation";
import { ThemeSync } from "../components/theme-sync";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Code Royale",
  description:
    "Code Royale – a neon-drenched real-time coding arena. Experience the dashboard, battles, and authentication flows in a futuristic shell.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentYear = new Date().getFullYear();
  return (
    <html lang="en" className="bg-slate-950">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen selection:bg-[rgba(var(--cr-accent-rgb),0.35)] selection:text-[var(--cr-fg)]`}
      >
        <ThemeSync />
        <div className="relative isolate min-h-screen overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(var(--cr-accent-rgb),0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(var(--cr-accent-2-rgb),0.12),_transparent_60%)]" />
          <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(120deg,_rgba(10,21,40,0.8),_rgba(12,18,34,0.95))]" />
          <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 pb-12 pt-6 sm:px-8">
            <Navigation />
            <main className="flex-1 pb-16 pt-10">{children}</main>
            <footer className="mt-auto flex flex-col gap-3 border-t border-slate-800/70 py-6 text-[13px] text-sky-100/60 sm:flex-row sm:items-center sm:justify-between">
              <span>© {currentYear} Code Royale. All rights reserved.</span>
              <span className="flex items-center gap-3 text-sky-100/50">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[rgb(var(--cr-accent-rgb))] shadow-[0_0_20px_rgba(var(--cr-accent-rgb),0.6)]" />
                Systems nominal • Neon Ops online
              </span>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
