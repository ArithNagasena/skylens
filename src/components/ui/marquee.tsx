import { cn } from "@/lib/utils";

function Track({ items, separator }: { items: readonly string[]; separator: string }) {
  return (
    <div className="flex shrink-0 items-center gap-10 pr-10" aria-hidden="true">
      {items.map((item, i) => (
        <span
          key={`${item}-${i}`}
          className="flex shrink-0 items-center gap-10 whitespace-nowrap font-mono text-micro uppercase tracking-[0.28em] text-ink-muted"
        >
          {item}
          <span className="text-signal/70">{separator}</span>
        </span>
      ))}
    </div>
  );
}

export function Marquee({
  items,
  className,
  separator = "•",
  label,
}: {
  items: readonly string[];
  className?: string;
  separator?: string;
  label?: string;
}) {
  return (
    <div className={cn("mask-fade-edges relative overflow-hidden", className)} role="group" aria-label={label}>
      <div className="animate-marquee flex w-max">
        <Track items={items} separator={separator} />
        <Track items={items} separator={separator} />
      </div>
      <span className="sr-only">{items.join(", ")}</span>
    </div>
  );
}
