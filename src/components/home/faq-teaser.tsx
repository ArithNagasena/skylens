import { Accordion } from "@/components/ui/accordion";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { Eyebrow, Section } from "@/components/ui/primitives";
import { faqs } from "@/content/faq";

/**
 * The five questions that decide whether an enquiry gets sent. They are the
 * ones prospective clients ask on the phone before anything else — lead time,
 * weather, permissions, coverage and turnaround — so answering them on the
 * page removes the reason to leave and think about it.
 *
 * Content is pulled from the same source as /faq so the two never drift.
 */
const featured = [
  "How far ahead do I need to book?",
  "What happens if the weather turns?",
  "Who handles the flight permissions?",
  "Which parts of the island do you cover?",
  "How quickly do I get the files?",
];

const items = featured
  .map((q) => faqs.find((f) => f.q === q))
  .filter((f): f is NonNullable<typeof f> => Boolean(f))
  .map(({ q, a }) => ({ q, a }));

export function FaqTeaser() {
  return (
    <Section tight id="faq">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <div className="flex flex-col gap-5">
              <Eyebrow>Before you ask</Eyebrow>
              <h2 className="text-balance text-3xl leading-[1.08] sm:text-4xl">
                The five questions everybody calls about.
              </h2>
              <p className="text-body leading-relaxed text-ink-muted">
                Answered here so you do not have to ring to find out. If yours is not on the list,
                the full FAQ covers another twenty — and a direct question gets a same-day reply.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <Button href="/contact" arrow>
                  Ask us directly
                </Button>
                <Button href="/faq" variant="secondary">
                  Read the full FAQ
                </Button>
              </div>
            </div>
          </div>

          <Reveal delay={0.1}>
            <Accordion items={items} defaultOpen={0} />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
