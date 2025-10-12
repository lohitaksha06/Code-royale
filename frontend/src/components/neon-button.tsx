"use client";

import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import Link from "next/link";

const baseClasses =
  "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border border-sky-500/40 bg-sky-500/10 px-6 py-2 text-sm font-semibold uppercase tracking-wide text-sky-100 transition-all duration-200 hover:border-sky-400 hover:bg-sky-500/20 hover:shadow-[0_0_35px_rgba(56,189,248,0.45)]";

const merge = (...classes: Array<string | undefined | false>) =>
  classes.filter(Boolean).join(" ");

export function NeonButton(
  props: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
) {
  const { className, children, ...rest } = props;
  return (
    <button
      {...rest}
      className={merge(
        baseClasses,
        rest.disabled && "opacity-60 hover:border-sky-500/40 hover:bg-sky-500/10 cursor-not-allowed",
        className,
      )}
    >
      <span className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.35),_transparent_70%)]" />
      {children}
    </button>
  );
}

interface NeonLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function NeonLink({ href, children, className }: NeonLinkProps) {
  return (
    <Link href={href} className={merge(baseClasses, className)}>
      <span className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.35),_transparent_70%)]" />
      {children}
    </Link>
  );
}
