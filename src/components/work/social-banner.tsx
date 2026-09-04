import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SocialGlyph } from "@/components/ui/social-glyph";
import { socials } from "@/content/site";

/**
 * The closing banner on the projects page: everything we have flown lives on
 * the social channels, so send people there rather than ending the page on a
 * dead stop.
 *
 * Entries with an empty `href` are filtered out, so a platform we have not set
 * up yet is simply absent instead of rendering a link that goes nowhere. Add
 * the URL in src/content/site.ts and the tile appears here, in the header and
 * in the footer at the same time.
 */
const blurb: Record<string, string> = {
  YouTube: "Full films and project edits",
  Facebook: "Shoot updates and client posts",
  Instagram: "Frames from the week's flying",
};

export function SocialBanner() {
  const channels = socials.filter((s) => s.href);
  if (channels.length === 0) return null;

  return (
    <section className="pb-20 md:pb-24">
      <div className="container-page">
        <Reveal>
          <div className="on-deep relative overflow-hidden rounded-3xl px-6 py-14 shadow-[0_36px_80px_-36px_rgba(11,37,64,0.55)] md:px-14 md:py-16">
            <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-40 left-1/2 h-[26rem] w-[52rem] -translate-x-1/2 rounded-full blur-[120px]"
              style={{ background: "radial-gradient(closest-side, rgba(43,130,216,0.28), transparent 75%)" }}
            />

            <div className="relative flex flex-col items-center gap-4 text-center">
              <h2 className="text-balance text-3xl leading-[1.08] sm:text-4xl md:text-[2.6rem]">
                Every project we fly ends up <span className="text-gradient">on our channels</span>
              </h2>
              <p className="max-w-2xl text-pretty text-body leading-relaxed text-ink-muted md:text-lead">
                The case studies here are a selection. The full run of films, shoot updates and
                frames from the week goes out on YouTube, Facebook and Instagram — follow whichever
                one you actually read.
              </p>
            </div>

            <div className="relative mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {channels.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group/tile flex items-center gap-4 rounded-2xl bg-white/[0.06] p-5 ring-1 ring-inset ring-white/12 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:bg-white/[0.11] hover:ring-signal/50"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-signal/15 text-signal transition-colors duration-500 group-hover/tile:bg-signal group-hover/tile:text-deep">
                    <SocialGlyph label={c.label} className="size-5" />
                  </span>

                  <span className="flex min-w-0 flex-col">
                    <span className="font-display text-title tracking-tight text-ink">
                      {c.label}
                    </span>
                    <span className="truncate text-meta text-ink-dim">{blurb[c.label]}</span>
                  </span>

                  <ArrowUpRight
                    className="ml-auto size-4 shrink-0 text-ink-dim transition-all duration-300 group-hover/tile:translate-x-0.5 group-hover/tile:-translate-y-0.5 group-hover/tile:text-signal"
                    strokeWidth={2.2}
                  />
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
