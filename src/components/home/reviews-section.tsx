import { MessageSquareQuote, Star } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/primitives";
import { getGoogleReviews, type GoogleReview } from "@/lib/google-reviews";
import { curatedReviews, type CuratedReview } from "@/content/reviews";
import { socials } from "@/content/site";

/**
 * Social proof, in three tiers of decreasing strength:
 *
 *   1. Live Google reviews, when the Places API is configured. Strongest —
 *      a visitor can click through and verify every word on Google.
 *   2. Curated real reviews from src/content/reviews.ts. Real words, but the
 *      visitor is trusting us to have quoted them accurately.
 *   3. Neither available: an honest invitation to read the Facebook page,
 *      rather than a section of invented praise.
 *
 * This is a server component, so the API key never reaches the browser and
 * the reviews are baked into the cached HTML.
 */
export async function ReviewsSection() {
  const google = await getGoogleReviews();
  const facebook = socials.find((s) => s.label === "Facebook");

  // ── Tier 3: nothing real to show yet ──────────────────────────────────
  if (!google && curatedReviews.length === 0) {
    return (
      <Section tight className="border-y border-ink/[0.09] bg-obsidian">
        <div className="container-page">
          <Reveal>
            <div className="card mx-auto flex max-w-3xl flex-col items-center gap-5 rounded-2xl px-6 py-12 text-center">
              <span className="grid size-12 place-items-center rounded-xl bg-signal-soft text-signal">
                <MessageSquareQuote className="size-6" strokeWidth={1.6} />
              </span>
              <h2 className="text-balance text-2xl leading-[1.15] sm:text-3xl">
                Ask the people who have already flown with us.
              </h2>
              <p className="max-w-xl text-pretty text-body leading-relaxed text-ink-muted">
                We would rather point you at what clients have written in their own words than
                print testimonials on our own website. Read them where they were left, and we are
                happy to put you in touch with a past client directly.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                {facebook && (
                  <Button href={facebook.href} variant="secondary" arrow>
                    Read our Facebook page
                  </Button>
                )}
                <Button href="/contact">Ask for a reference</Button>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    );
  }

  const items = google ? google.reviews.slice(0, 3) : curatedReviews.slice(0, 3);

  return (
    <Section tight className="relative overflow-hidden border-y border-ink/[0.09] bg-obsidian">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[24rem] w-[48rem] -translate-x-1/2 rounded-full blur-[130px]"
        style={{ background: "radial-gradient(closest-side, rgba(43,130,216,0.14), transparent 74%)" }}
      />

      <div className="container-page relative">
        <SectionHeading
          align="center"
          className="mx-auto"
          eyebrow="Client reviews"
          title="What the people who hired us actually said."
          lede={
            google
              ? "Live from our Google Business Profile — every review below can be opened and verified on Google."
              : "Written by real clients about real shoots, and reproduced here with their permission."
          }
        />

        {google && (
          <Reveal>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              <Stars rating={Math.round(google.rating)} />
              <span className="font-display text-lead font-semibold text-ink">
                {google.rating.toFixed(1)}
              </span>
              <span className="text-meta text-ink-muted">
                from {google.total} Google {google.total === 1 ? "review" : "reviews"}
              </span>
            </div>
          </Reveal>
        )}

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={"id" in item ? item.id : item.author} delay={Math.min(i * 0.08, 0.24)}>
              <ReviewCard item={item} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {google && (
              <Button href={google.mapsUri} variant="secondary" arrow>
                Read all {google.total} reviews on Google
              </Button>
            )}
            {facebook && (
              <Button href={facebook.href} variant={google ? "ghost" : "secondary"} arrow>
                See our Facebook page
              </Button>
            )}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

function ReviewCard({ item }: { item: GoogleReview | CuratedReview }) {
  const isGoogle = "id" in item;
  const rating = item.rating ?? 0;
  const source = isGoogle ? "Google" : item.source;
  const meta = isGoogle ? item.relativeTime : item.location;

  return (
    <figure className="card card-interactive flex h-full flex-col gap-4 rounded-2xl p-6">
      <div className="flex items-center justify-between gap-3">
        {rating > 0 && <Stars rating={rating} />}
        <span className="font-mono text-micro uppercase tracking-[0.16em] text-ink-dim">
          {source}
        </span>
      </div>

      <blockquote className="text-pretty text-body leading-relaxed text-ink">
        {item.text}
      </blockquote>

      <figcaption className="mt-auto flex items-center gap-3 border-t border-ink/[0.1] pt-5">
        {/* Google's terms require the reviewer's name, and their photo where we
            show one, to be attributed back to them. A plain <img> rather than
            next/image: these are arbitrary googleusercontent URLs, and routing
            them through the optimiser would mean whitelisting that host and
            paying to transform a 40px avatar. */}
        {isGoogle && item.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.photoUrl}
            alt=""
            width={40}
            height={40}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="size-10 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="grid size-10 shrink-0 place-items-center rounded-full bg-signal-soft font-mono text-meta font-medium text-signal"
          >
            {initialsOf(item.author)}
          </span>
        )}

        <span className="flex min-w-0 flex-col">
          {isGoogle && item.authorUrl ? (
            <a
              href={item.authorUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="truncate text-meta font-medium text-ink transition-colors hover:text-signal"
            >
              {item.author}
            </a>
          ) : (
            <span className="truncate text-meta font-medium text-ink">{item.author}</span>
          )}
          {meta && <span className="truncate text-meta text-ink-dim">{meta}</span>}
        </span>
      </figcaption>
    </figure>
  );
}

function Stars({ rating }: { rating: number }) {
  const rounded = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rounded} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={i < rounded ? "size-3.5 fill-signal text-signal" : "size-3.5 text-ink/20"}
          strokeWidth={1.6}
        />
      ))}
    </span>
  );
}

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
