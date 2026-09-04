import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/primitives";
import type { LegalSection } from "@/content/legal";

export function LegalBody({ sections }: { sections: LegalSection[] }) {
  return (
    <Section tight>
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-[16rem_minmax(0,44rem)] lg:gap-16">
          <nav aria-label="On this page" className="lg:sticky lg:top-32 lg:self-start">
            <h2 className="font-mono text-micro uppercase tracking-[0.22em] text-signal">
              On this page
            </h2>
            <ol className="mt-4 flex flex-col gap-2.5">
              {sections.map((s, i) => (
                <li key={s.heading}>
                  <a
                    href={`#s-${i}`}
                    className="flex gap-2.5 text-meta leading-snug text-ink-muted transition-colors hover:text-signal"
                  >
                    <span className="font-mono text-micro text-ink-dim">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="flex flex-col gap-12">
            {sections.map((s, i) => (
              <Reveal key={s.heading}>
                <section id={`s-${i}`} className="scroll-mt-32">
                  <h2 className="text-title tracking-tight md:text-2xl">
                    <span className="mr-3 font-mono text-meta tracking-[0.16em] text-signal">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s.heading}
                  </h2>

                  <div className="mt-4 flex flex-col gap-4">
                    {s.paragraphs?.map((p) => (
                      <p key={p} className="text-pretty text-body leading-[1.75] text-ink-muted">
                        {p}
                      </p>
                    ))}

                    {s.bullets && (
                      <ul className="flex flex-col gap-2.5">
                        {s.bullets.map((b) => (
                          <li key={b} className="flex items-start gap-3 text-body leading-relaxed text-ink-muted">
                            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-signal" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>
              </Reveal>
            ))}
          </article>
        </div>
      </div>
    </Section>
  );
}
