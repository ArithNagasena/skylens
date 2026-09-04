"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { QuotableService } from "@/content/service-cards";

/**
 * Which services the visitor has picked, shared between every price card and
 * the sticky bar at the bottom of the page.
 *
 * Session-only, in-memory state: a visitor building a package is doing it in
 * one visit, and there is nothing here worth persisting across a reload or
 * exposing to another tab.
 */
type SelectionContextValue = {
  selected: QuotableService[];
  isSelected: (slug: string) => boolean;
  toggle: (service: QuotableService) => void;
  clear: () => void;
};

const SelectionContext = createContext<SelectionContextValue | null>(null);

export function ServiceSelectionProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<QuotableService[]>([]);

  const toggle = useCallback((service: QuotableService) => {
    setSelected((prev) =>
      prev.some((s) => s.slug === service.slug)
        ? prev.filter((s) => s.slug !== service.slug)
        : [...prev, service],
    );
  }, []);

  const clear = useCallback(() => setSelected([]), []);

  const isSelected = useCallback(
    (slug: string) => selected.some((s) => s.slug === slug),
    [selected],
  );

  const value = useMemo(
    () => ({ selected, isSelected, toggle, clear }),
    [selected, isSelected, toggle, clear],
  );

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}

/**
 * Reads the selection. Returns `null` outside a provider rather than throwing,
 * so a component like `ServicePriceCard` that is also used on pages without
 * the selection feature (a service's own detail page, say) can render its
 * plain form there without every caller needing to know which pages opted in.
 */
export function useServiceSelection() {
  return useContext(SelectionContext);
}
