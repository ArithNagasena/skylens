import Link from "next/link";
import { ServiceIcon } from "@/components/ui/icon";
import { CornerTicks } from "@/components/ui/primitives";
import { RevealItem } from "@/components/ui/reveal";
import {
  formatStartingPrice,
  serviceHasPage,
  toQuotable,
  type ServiceCard,
} from "@/content/service-cards";
import { SelectToggle } from "@/components/services/select-toggle";

/**
 * A service, priced — and, on the services page, selectable.
 *
 * The card leads with the icon and title, then the price, because "what is it
 * and what does it cost" is the only question this page exists to answer. The
 * price is framed as a floor — "Starting from … +" — never as a rate: these
 * are mobilisation-dependent jobs and a number presented as fixed would either
 * lose work or have to be walked back on the call.
 *
 * It carries one short description line, because a card is scanned. Turnaround
 * used to sit opposite the price and was cut — a second number on a card whose
 * job is to communicate one only split the reader's attention. It still
 * appears on each service's own page.
 *
 * Structure: the card itself is not one big `<Link>`. Only the title links to
 * the service's detail page, and only when there is one — services added
 * through the admin panel have no write-up behind them, so their title renders
 * as plain text instead of pointing at a 404. The top-right corner is the
 * pick/unpick control. A `<button>` nested inside an `<a>` is invalid HTML and
 * confuses both click handling and screen readers, so the two affordances are
 * siblings rather than one nested in the other.
 */
export function ServicePriceCard({ service }: { service: ServiceCard }) {
  return (
    <RevealItem className="h-full">
      <SelectableCard service={service} />
    </RevealItem>
  );
}

function SelectableCard({ service: s }: { service: ServiceCard }) {
  const linked = serviceHasPage(s.slug);

  return (
    <article className="card card-interactive group relative flex h-full flex-col gap-5 overflow-hidden rounded-2xl p-6 transition-shadow duration-300 has-[[data-selected=true]]:shadow-[0_0_0_2px_var(--color-signal)]">
      <CornerTicks />

      {/* A wash that lifts on hover — cheap to animate, and it keeps the
          resting state calm rather than every card shouting at once. */}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-signal/[0.07] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative flex items-start justify-between gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-signal-soft text-signal transition-all duration-500 group-hover:-translate-y-0.5 group-hover:bg-signal group-hover:text-raised">
          <ServiceIcon name={s.icon} className="size-6" />
        </span>
        <SelectToggle service={toQuotable(s)} />
      </div>

      <div className="relative flex flex-col gap-2">
        <h3 className="font-display text-title leading-snug tracking-tight text-ink">
          {linked ? (
            <Link
              href={`/services/${s.slug}`}
              className="transition-colors duration-300 hover:text-signal focus-visible:text-signal"
            >
              {s.title}
            </Link>
          ) : (
            s.title
          )}
        </h3>
        <p className="text-body leading-relaxed text-ink-muted">{s.description}</p>
      </div>

      <div className="relative mt-auto flex flex-col gap-1 border-t border-ink/[0.1] pt-4">
        <span className="font-mono text-micro uppercase tracking-[0.18em] text-ink-dim">
          Starting from
        </span>
        <span className="font-display text-[1.4rem] font-semibold tracking-tight text-signal">
          {formatStartingPrice(s.startingPrice, s.priceNote)}
        </span>
      </div>
    </article>
  );
}
