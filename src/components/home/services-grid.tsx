import Link from "next/link";

import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { CornerTicks, Section, SectionHeading } from "@/components/ui/primitives";
import { ServiceIcon } from "@/components/ui/icon";
import {
  formatStartingPrice,
  serviceCards,
  serviceHasPage,
  type ServiceCard,
} from "@/content/service-cards";

/**
 * The service grid on the landing page.
 *
 * One list, shared with /services and managed at /admin/services, so a price
 * or a name only has to be changed in one place. The card carries its starting
 * price here too — the grid used to name ten services without a single number
 * on it, which left the most common question of the page unanswered until the
 * visitor clicked through.
 */
export function ServicesGrid({ services = serviceCards }: { services?: ServiceCard[] }) {
  if (services.length === 0) return null;

  return (
    <Section id="services" tight>
      <div className="container-page">
        <SectionHeading
          eyebrow="Our Services"
          title="Featured Drone Services"
          lede="Professional drone capture tailored to your specific industry. We provide high-end, reliable aerial media that elevates your project from the ground up."
        />

        <div className="mt-12 grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {services.map((s, i) => (
            <Reveal key={s.key} delay={Math.min(i * 0.05, 0.4)}>
              <div className="card card-interactive group relative flex h-full min-h-[13rem] flex-col overflow-hidden rounded-2xl p-6">
                <CornerTicks />

                <div className="mb-6 flex items-start justify-between gap-4">
                  <span className="grid size-12 place-items-center rounded-xl bg-signal-soft text-signal transition-colors duration-300 group-hover:bg-signal group-hover:text-raised">
                    <ServiceIcon name={s.icon} className="size-6" />
                  </span>
                </div>

                <div className="mt-auto flex flex-col gap-2">
                  <h3 className="font-display text-title leading-tight tracking-tight text-ink transition-colors duration-300 group-hover:text-signal">
                    {serviceHasPage(s.slug) ? (
                      <Link href={`/services/${s.slug}`} className="after:absolute after:inset-0">
                        {s.title}
                      </Link>
                    ) : (
                      s.title
                    )}
                  </h3>
                  <p className="text-meta leading-relaxed text-ink-muted">{s.description}</p>
                  <p className="font-mono text-micro uppercase tracking-[0.16em] text-signal">
                    {formatStartingPrice(s.startingPrice, s.priceNote)}
                  </p>
                </div>

                {/* Subtle bottom gradient on hover */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-signal/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-12 flex justify-center">
            <Button href="/services" size="lg" arrow>
              View All Services
            </Button>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
