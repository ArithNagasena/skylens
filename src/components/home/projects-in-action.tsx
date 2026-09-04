import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/primitives";
import { showreel, type ShowreelFilm } from "@/content/showreel";

/**
 * Recently completed projects, as a plain grid of YouTube embeds.
 *
 * Deliberately no captions under the tiles: the YouTube player already draws
 * the video's title and channel over the thumbnail, so a caption repeating
 * them just competes with the player's own chrome. The titles still reach
 * assistive tech through each iframe's `title`, which otherwise announces
 * three indistinguishable "video" frames.
 *
 * Framing these as *recent* rather than as a general showreel does more work:
 * a prospective client reading "selected work" learns only that we can shoot,
 * while "recently completed" also says we are busy now and that the standard
 * on show is current. Keep the four newest jobs at the top of /admin/videos.
 *
 * Entries without a `youtubeId` are skipped rather than rendered as an empty
 * tile, so a half-filled list degrades to a shorter row instead of a hole.
 *
 * The four links are managed at /admin/videos and resolved by the page. The
 * grid is built for four across on a wide screen and drops to two, then one —
 * so a shorter list still fills whole rows rather than leaving a gap on the
 * right.
 */
export function ProjectsInAction({ films: supplied = showreel }: { films?: ShowreelFilm[] }) {
  const films = supplied.filter((f) => f.youtubeId);

  if (films.length === 0) return null;

  return (
    <Section tight className="bg-void">
      <div className="container-page">
        <SectionHeading
          align="center"
          className="mx-auto"
          title="Recently completed projects"
          lede="The most recent jobs we have delivered, start to finish."
        />

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {films.map((film, i) => (
            <Reveal key={film.youtubeId} delay={Math.min(i * 0.08, 0.24)}>
              <div className="card relative aspect-video w-full overflow-hidden rounded-xl bg-obsidian">
                <iframe
                  className="absolute inset-0 size-full"
                  /* -nocookie so the embed sets no tracking cookies until the
                     visitor actually presses play. */
                  src={`https://www.youtube-nocookie.com/embed/${film.youtubeId}?rel=0`}
                  title={film.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-12 flex justify-center">
            <Button href="/work" size="lg" arrow>
              Browse the full portfolio
            </Button>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
