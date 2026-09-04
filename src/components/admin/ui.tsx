"use client";

import { AlertTriangle, Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * The admin panel's building blocks.
 *
 * Everything here is built from the site's own tokens — `card`, `bg-void`,
 * `text-ink`, `signal` — rather than a second design language bolted on for
 * the back office. The panel is part of the same product, and an admin who
 * spends an hour in it and then looks at the public site should not feel like
 * they changed applications.
 *
 * The form controls repeat one input style rather than importing the site's,
 * because the marketing forms are laid out for a two-column page at 18px and
 * the panel needs a denser row that survives a table.
 */

export const inputClass =
  "w-full rounded-xl bg-void px-3.5 py-2.5 text-body text-ink placeholder:text-ink-dim shadow-[inset_0_0_0_1px_rgba(17,23,34,0.14)] outline-none transition-all duration-200 hover:shadow-[inset_0_0_0_1px_rgba(17,23,34,0.22)] focus:shadow-[inset_0_0_0_2px_rgba(13,77,138,0.65)] disabled:opacity-60";

export function Field({
  label,
  hint,
  required,
  children,
  className,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-meta font-medium text-ink">
        {label}
        {required && <span className="text-signal"> *</span>}
      </span>
      {children}
      {hint && <span className="text-micro text-ink-dim">{hint}</span>}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputClass, props.className)} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(inputClass, "min-h-24 resize-y", props.className)} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(inputClass, props.className)} />;
}

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white hover:brightness-110",
  secondary: "bg-ink/[0.06] text-ink hairline hover:bg-ink/[0.12]",
  ghost: "text-ink-muted hover:bg-ink/[0.07] hover:text-ink",
  danger: "bg-rose-600/10 text-rose-700 hairline hover:bg-rose-600/20",
};

/**
 * `type` defaults to "button", not the HTML default of "submit".
 *
 * Several of these sit inside forms while doing something else entirely — the
 * "Add images" control on the project form uploads a file. With the HTML
 * default, pressing one submits the half-filled form around it. Every button
 * that really is a submit says so explicitly.
 */
export function Button({
  variant = "primary",
  busy = false,
  type = "button",
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; busy?: boolean }) {
  return (
    <button
      {...props}
      type={type}
      disabled={props.disabled || busy}
      className={cn(
        "inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full px-4 text-meta font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50",
        buttonVariants[variant],
        className,
      )}
    >
      {busy && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  );
}

export function Panel({
  title,
  description,
  actions,
  children,
  className,
}: {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("card rounded-2xl p-5 md:p-6", className)}>
      {(title || actions) && (
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            {title && (
              <h2 className="font-display text-title tracking-tight text-ink">{title}</h2>
            )}
            {description && <p className="text-meta text-ink-muted">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

export function PageHeader({
  title,
  lede,
  actions,
}: {
  title: string;
  lede?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl tracking-tight text-ink md:text-3xl">{title}</h1>
        {lede && <p className="max-w-2xl text-meta text-ink-muted">{lede}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl bg-void px-4 py-8 text-center text-meta text-ink-dim hairline">
      {children}
    </p>
  );
}

/**
 * The one-line result of the last save, delete or upload.
 *
 * A panel that writes to a remote database has to say whether the write landed
 * — silence after pressing Save is the single most common way an admin ends up
 * making the same edit three times. Errors persist until the next action;
 * successes clear themselves after a few seconds so the page does not
 * accumulate stale green ticks.
 */
export type Status = { kind: "ok" | "error"; message: string } | null;

export function StatusLine({ status }: { status: Status }) {
  const [visible, setVisible] = useState(status);

  useEffect(() => {
    setVisible(status);
    if (status?.kind !== "ok") return;
    const t = setTimeout(() => setVisible(null), 4000);
    return () => clearTimeout(t);
  }, [status]);

  if (!visible) return null;

  return (
    <p
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-meta",
        visible.kind === "ok"
          ? "bg-signal-soft text-signal"
          : "bg-rose-600/10 text-rose-700",
      )}
    >
      {visible.kind === "ok" ? (
        <Check className="size-4 shrink-0" strokeWidth={2.4} />
      ) : (
        <AlertTriangle className="size-4 shrink-0" strokeWidth={2.2} />
      )}
      {visible.message}
    </p>
  );
}

/**
 * A delete button that asks first, inline.
 *
 * A `window.confirm` would do the job, but it blocks the whole tab and reads
 * as a browser error rather than as part of the page. This swaps itself for a
 * "Sure? / Cancel" pair in place, which is dismissible by carrying on with
 * anything else.
 */
export function ConfirmButton({
  onConfirm,
  label = "Delete",
  confirmLabel = "Confirm",
  busy,
  className,
}: {
  onConfirm: () => void;
  label?: string;
  confirmLabel?: string;
  busy?: boolean;
  className?: string;
}) {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 5000);
    return () => clearTimeout(t);
  }, [armed]);

  if (!armed) {
    return (
      <Button variant="ghost" className={className} onClick={() => setArmed(true)} type="button">
        {label}
      </Button>
    );
  }

  return (
    <span className="inline-flex items-center gap-1">
      <Button variant="danger" busy={busy} type="button" onClick={onConfirm}>
        {confirmLabel}
      </Button>
      <Button variant="ghost" type="button" onClick={() => setArmed(false)}>
        Cancel
      </Button>
    </span>
  );
}

/** LKR with thousands separators — the panel's only money format. */
export function formatMoney(amount: number, currency = "LKR"): string {
  return `${currency} ${amount.toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** A coloured status chip, used for quotation and bill states. */
export function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "paid" || status === "accepted"
      ? "bg-emerald-600/10 text-emerald-700"
      : status === "declined" || status === "cancelled" || status === "expired"
        ? "bg-rose-600/10 text-rose-700"
        : status === "partial" || status === "sent"
          ? "bg-amber-500/15 text-amber-700"
          : "bg-ink/[0.07] text-ink-muted";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 font-mono text-micro uppercase tracking-[0.14em]",
        tone,
      )}
    >
      {status}
    </span>
  );
}
