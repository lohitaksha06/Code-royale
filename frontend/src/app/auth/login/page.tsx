"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { NeonButton, NeonLink } from "../../../components/neon-button";
import { supabase } from "../../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (!data.session) {
      setError("No active session returned. Try again.");
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push("/home");
  };

  return (
    <div className="mx-auto grid max-w-3xl gap-8">
      <div className="rounded-[32px] border border-sky-500/20 bg-slate-950/70 p-8 shadow-[0_0_45px_rgba(56,189,248,0.12)] backdrop-blur-xl sm:p-12">
        <div className="flex flex-col gap-6 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-400/70">
            Welcome back, Agent
          </span>
          <h1 className="text-3xl font-semibold text-sky-100 md:text-4xl">
            Reconnect to the Royale grid
          </h1>
          <p className="text-sm text-sky-100/70">
            Authenticate to resume your league climb. Need an account?{" "}
            <Link
              href="/auth/signup"
              className="text-sky-300 underline decoration-sky-500/50 decoration-dashed underline-offset-4"
            >
              Enlist here
            </Link>
            .
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 grid gap-6">
          <label className="grid gap-2 text-left text-sm text-sky-100/75">
            Email Address
            <input
              type="email"
              required
              placeholder="you@coderoyale.gg"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-2xl border border-sky-500/30 bg-slate-900/80 px-4 py-3 text-sky-100 placeholder:text-sky-400/40 focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
            />
          </label>
          <label className="grid gap-2 text-left text-sm text-sky-100/75">
            Secret Key
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-2xl border border-sky-500/30 bg-slate-900/80 px-4 py-3 text-sky-100 placeholder:text-sky-400/40 focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
            />
          </label>
          <div className="flex items-center justify-between text-xs text-sky-100/60">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border border-sky-500/50 bg-slate-900/80 text-sky-400 accent-sky-500"
              />
              Trust this terminal
            </label>
            <Link
              href="#"
              className="text-sky-300 underline decoration-sky-500/40 underline-offset-4"
            >
              Forgot key?
            </Link>
          </div>

          <NeonButton
            type="submit"
            disabled={loading || !email || !password}
            className="mt-2"
          >
            {loading ? "Synchronizing..." : "Enter the Arena"}
          </NeonButton>
          {error && (
            <p className="text-sm text-rose-300/90">
              {error}
            </p>
          )}
          <Link
            href="#"
            className="justify-self-start text-xs text-sky-300 underline decoration-sky-500/40 underline-offset-4"
          >
            Reset password
          </Link>
        </form>

        <div className="mt-10 grid gap-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-sky-400/60">
            <span className="h-px flex-1 bg-sky-500/20" />
            Or link instantly
            <span className="h-px flex-1 bg-sky-500/20" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: "Google", href: "#" },
              { label: "GitHub", href: "#" },
            ].map((provider) => (
              <NeonLink
                key={provider.label}
                href={provider.href}
                className="justify-center border-sky-500/30 bg-transparent text-sky-200 hover:border-sky-400 hover:bg-sky-500/10"
              >
                Connect with {provider.label}
              </NeonLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
