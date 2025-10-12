import { ReactNode } from "react";

interface GlowCardProps {
  title?: string;
  description?: string;
  children?: ReactNode;
  accent?: "cyan" | "blue" | "purple";
}

const accentClass: Record<Required<GlowCardProps>["accent"], string> = {
  cyan: "from-sky-500/60 via-sky-500/20 to-sky-500/0",
  blue: "from-blue-500/60 via-blue-500/20 to-blue-500/0",
  purple: "from-violet-500/60 via-violet-500/20 to-violet-500/0",
};

export function GlowCard({
  title,
  description,
  children,
  accent = "cyan",
}: GlowCardProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/40 p-[1px] shadow-[0_0_45px_rgba(56,189,248,0.12)] backdrop-blur-xl">
      <div className="absolute inset-0 -z-10 bg-slate-900/70" />
      <div
        className={`absolute -inset-px -z-20 bg-gradient-to-br ${accentClass[accent]} opacity-40`}
      />
      <div className="relative flex h-full flex-col gap-4 rounded-[28px] bg-slate-950/70 p-8">
        {title && (
          <h3 className="text-xl font-semibold text-sky-100 md:text-2xl">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-sm text-sky-100/70 md:text-base">
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
