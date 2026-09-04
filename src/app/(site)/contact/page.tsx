import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { QuoteHero } from "@/components/contact/quote-hero";
import { ProjectEnquiryBox } from "@/components/contact/project-enquiry-box";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/primitives";
import { Accordion } from "@/components/ui/accordion";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { contact, credentials } from "@/content/site";
import { coverage } from "@/content/company";
import { faqs } from "@/content/faq";
import { toQuotable } from "@/content/service-cards";
import { getServiceCards } from "@/lib/cms/site-content";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Pick your categories, fill in a few details and get an instant estimate — then send it to us on WhatsApp or by email.",
  alternates: { canonical: "/contact" },
};

type Search = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const quickFaqs = faqs.filter((f) => ["Booking", "Legal & safety"].includes(f.group)).slice(0, 4);

export default async function ContactPage({ searchParams }: Search) {
  const [sp, cards] = await Promise.all([searchParams, getServiceCards()]);

  // A service's own page links here as /contact?service=<slug> expecting that
  // category to be pre-selected. Validated against the live list rather than
  // the shipped one, so a category added in the admin panel can be deep-linked
  // too — and an unknown slug is dropped instead of selecting nothing visible.
  const requested =
    typeof sp.service === "string" && cards.some((c) => c.slug === sp.service) ? sp.service : undefined;
  const services = cards.map(toQuotable);

  return (
    <>
      <BreadcrumbJsonLd trail={[{ name: "Contact", href: "/contact" }]} />

      <QuoteHero />

      <Section tight>
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
            {/* --------------------------------------------------- the form */}
            <Reveal>
              <ProjectEnquiryBox defaultCategory={requested} services={services} />
            </Reveal>

            {/* ---------------------------------------------------- details */}
            <div className="flex flex-col gap-4">
              <Reveal delay={0.08}>
                <div className="card rounded-2xl p-6">
                  <h2 className="font-mono text-micro uppercase tracking-[0.22em] text-signal">
                    Direct contact
                  </h2>
                  <ul className="mt-4 flex flex-col gap-4">
                    <li>
                      <a
                        href={`mailto:${contact.email}`}
                        className="group flex items-start gap-3 text-body text-ink transition-colors hover:text-signal"
                      >
                        <Mail className="mt-0.5 size-4 shrink-0 text-signal" strokeWidth={1.7} />
                        <span className="flex flex-col">
                          {contact.email}
                          <span className="text-meta text-ink-dim">Preferred for new enquiries</span>
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        href={contact.phoneHref}
                        className="group flex items-start gap-3 text-body text-ink transition-colors hover:text-signal"
                      >
                        <Phone className="mt-0.5 size-4 shrink-0 text-signal" strokeWidth={1.7} />
                        <span className="flex flex-col">
                          {contact.phone}
                          <span className="text-meta text-ink-dim">Urgent scheduling and live jobs</span>
                        </span>
                      </a>
                    </li>
                    <li className="flex items-start gap-3 text-body text-ink">
                      <Clock className="mt-0.5 size-4 shrink-0 text-signal" strokeWidth={1.7} />
                      <span className="flex flex-col">
                        {contact.hours}
                        <span className="text-meta text-ink-dim">{contact.responseTime}</span>
                      </span>
                    </li>
                    <li className="flex items-start gap-3 text-body text-ink">
                      <MapPin className="mt-0.5 size-4 shrink-0 text-signal" strokeWidth={1.7} />
                      <address className="flex flex-col not-italic">
                        {contact.address.street}
                        <span>
                          {contact.address.city}, {contact.address.region} {contact.address.postal}
                        </span>
                        <span className="text-meta text-ink-dim">Studio and hangar, visits by appointment</span>
                      </address>
                    </li>
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={0.14}>
                <div className="card rounded-2xl p-6">
                  <h2 className="font-mono text-micro uppercase tracking-[0.22em] text-signal">
                    Coverage
                  </h2>
                  <p className="mt-3 text-meta leading-relaxed text-ink-muted">{coverage.note}</p>
                  <ul className="mt-4 flex flex-col gap-2.5">
                    {coverage.regions.map((r) => (
                      <li key={r.name} className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-2.5 text-meta text-ink">
                          <span
                            className={cn(
                              "size-1.5 rounded-full",
                              r.status === "core" ? "bg-signal" : "bg-ink/25",
                            )}
                          />
                          {r.name}
                        </span>
                        <span className="font-mono text-micro uppercase tracking-[0.14em] text-ink-dim">
                          {r.detail}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="rounded-2xl bg-gradient-to-b from-signal/[0.09] to-transparent p-6 hairline">
                  <h2 className="font-mono text-micro uppercase tracking-[0.22em] text-signal">
                    Included in every engagement
                  </h2>
                  <ul className="mt-4 flex flex-col gap-3">
                    {credentials.map((c) => (
                      <li key={c.code} className="flex items-baseline gap-3">
                        <span className="font-mono text-meta font-medium tracking-wider text-signal">
                          {c.code}
                        </span>
                        <span className="text-meta text-ink-muted">{c.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </Section>

      <Section tight className="border-t border-ink/[0.09] bg-obsidian">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl tracking-tight md:text-3xl">Before you write</h2>
              <p className="text-body leading-relaxed text-ink-muted">
                The four questions that come up in almost every first conversation.
              </p>
            </div>
            <Accordion items={quickFaqs.map((f) => ({ q: f.q, a: f.a }))} defaultOpen={0} />
          </div>
        </div>
      </Section>
    </>
  );
}
