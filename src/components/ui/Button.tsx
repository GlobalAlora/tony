import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "lg";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-accent-ink shadow-[0_0_0_1px_rgba(0,0,0,0.05)] hover:bg-ink hover:text-surface hover:shadow-[0_8px_24px_-8px_var(--color-accent)]",
  secondary:
    "border border-line-strong text-ink bg-transparent hover:border-accent hover:text-accent hover:shadow-[0_8px_20px_-10px_var(--color-accent)]",
  ghost: "text-ink-muted bg-transparent hover:text-ink",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

const BASE_CLASSES =
  "focus-ring inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-all duration-[var(--duration-fast)] ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:scale-100 disabled:hover:shadow-none";

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
}

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    BASE_CLASSES,
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    className,
  );

  if ("href" in props && props.href) {
    const { href, ...anchorProps } = props;
    const isExternal = href.startsWith("http") || href.startsWith("mailto:");

    if (isExternal) {
      return (
        <a
          href={href}
          className={classes}
          {...anchorProps}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...anchorProps}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
