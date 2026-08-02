import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
  className?: string;
}

export const FIELD_CLASSES = cn(
  "w-full rounded-lg border bg-surface-overlay px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint",
  "focus-ring transition-colors duration-[var(--duration-fast)]",
);

export function FormField({
  id,
  label,
  error,
  optional,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {optional ? (
          <span className="ml-1.5 text-xs font-normal text-ink-faint">
            (opcional)
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs font-medium text-danger"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function fieldBorderClass(hasError?: string) {
  return hasError ? "border-danger" : "border-line-strong";
}
