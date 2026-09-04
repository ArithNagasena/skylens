"use client";

import { Check, Plus } from "lucide-react";
import type { QuotableService } from "@/content/service-cards";
import { useServiceSelection } from "@/components/services/selection-context";
import { cn } from "@/lib/utils";

/**
 * The pick/unpick control on a service card.
 *
 * Renders nothing outside a `ServiceSelectionProvider` — a service card used
 * somewhere the selection feature was never wired up (there isn't one today,
 * but nothing stops it) degrades to just not offering the control, rather
 * than crashing.
 *
 * Carries `data-selected`, which is how the card around it (a server
 * component, so it cannot read this client-side state directly) knows to draw
 * its selected ring — see the `has-[[data-selected=true]]` rule on
 * `SelectableCard` in service-price-card.tsx.
 */
export function SelectToggle({ service }: { service: QuotableService }) {
  const selection = useServiceSelection();
  if (!selection) return null;

  const active = selection.isSelected(service.slug);

  return (
    <button
      type="button"
      data-selected={active}
      onClick={() => selection.toggle(service)}
      aria-pressed={active}
      aria-label={`${active ? "Remove" : "Add"} ${service.title} ${active ? "from" : "to"} your request`}
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-full transition-all duration-300",
        active
          ? "bg-signal text-raised shadow-[0_6px_16px_-6px_rgba(26,111,196,0.6)]"
          : "bg-ink/[0.06] text-ink-muted hover:bg-ink/[0.12] group-hover:bg-signal/15 group-hover:text-signal",
      )}
    >
      {active ? (
        <Check className="size-4" strokeWidth={2.6} />
      ) : (
        <Plus className="size-4" strokeWidth={2.4} />
      )}
    </button>
  );
}
