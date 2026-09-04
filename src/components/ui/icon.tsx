import {
  Building2,
  Clapperboard,
  HardHat,
  Map,
  PartyPopper,
  ScanSearch,
  Sprout,
  Thermometer,
  Camera,
  Landmark,
  Palmtree,
  Megaphone,
  Mountain,
  Flower2,
  Flag,
  Smartphone,
  Crosshair,
  Package,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

const registry: Record<string, LucideIcon> = {
  Building2,
  Clapperboard,
  HardHat,
  Map,
  PartyPopper,
  ScanSearch,
  Sprout,
  Thermometer,
  Camera,
  Landmark,
  Palmtree,
  Megaphone,
  Mountain,
  Flower2,
  Flag,
  Smartphone,
  Crosshair,
  Package,
  ShieldCheck,
};

export function ServiceIcon({
  name,
  className,
  strokeWidth = 1.5,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Cmp = registry[name] ?? ScanSearch;
  return <Cmp className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}

/**
 * Every icon a service can be given, for the picker in the admin panel.
 *
 * Read off the registry rather than typed out a second time, so an icon added
 * above is immediately choosable and one removed cannot be selected into a
 * service that then renders the fallback.
 */
export const serviceIconNames = Object.keys(registry).sort();
