import "server-only";
import { unstable_cache } from "next/cache";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createPublicSupabase } from "@/lib/supabase/public";
import type { ImageRow, ProjectRow, ServiceRow, ShowreelVideoRow } from "@/lib/supabase/types";
import { heroFrames, latestWorkFrames, type MediaFrame } from "@/content/media";
import { serviceCards, type ServiceCard } from "@/content/service-cards";
import { showreel, type ShowreelFilm } from "@/content/showreel";
import { projects as staticProjects } from "@/content/projects";
import type { WorkCard } from "@/lib/cms/work-card";

/**
 * Everything the public pages read out of the admin panel.
 *
 * Two rules hold across every function here:
 *
 *   1. It never throws. A missing environment variable, an unreachable
 *      database or an empty table all resolve to the static content in
 *      `src/content/*`, so the marketing site renders on a fresh clone with
 *      no Supabase project at all.
 *   2. It never returns an empty section. An admin who deletes the last hero
 *      image gets the shipped frames back rather than a blank panel, because
 *      an empty carousel is a broken-looking page, not an editorial choice.
 *
 * Results are cached for a minute and tagged `site-content`. The admin panel
 * calls `revalidateSiteContent()` after every write, so edits appear at once;
 * the minute is only the ceiling for a change made straight in the Supabase
 * dashboard.
 */

export const SITE_CONTENT_TAG = "site-content";

const CACHE = { revalidate: 60, tags: [SITE_CONTENT_TAG] };

/* --------------------------------------------------------------- images */

async function fetchImages(table: "hero_images" | "latest_work_images"): Promise<MediaFrame[]> {
  if (!isSupabaseConfigured()) return [];

  const { data, error } = await createPublicSupabase()
    .from(table)
    .select("url, alt, sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .returns<Pick<ImageRow, "url" | "alt" | "sort_order">[]>();

  if (error || !data) return [];
  return data.map((row) => ({ src: row.url, alt: row.alt }));
}

export const getHeroFrames = unstable_cache(
  async (): Promise<MediaFrame[]> => {
    const rows = await fetchImages("hero_images");
    return rows.length > 0 ? rows : heroFrames;
  },
  ["hero-frames"],
  CACHE,
);

export const getLatestWorkFrames = unstable_cache(
  async (): Promise<MediaFrame[]> => {
    const rows = await fetchImages("latest_work_images");
    return rows.length > 0 ? rows : latestWorkFrames;
  },
  ["latest-work-frames"],
  CACHE,
);

/* -------------------------------------------------------------- showreel */

/**
 * The films under "Recently completed projects". Capped at four: the section
 * is a single grid row on a wide screen, and a fifth tile would wrap into a
 * row of one.
 */
export const MAX_SHOWREEL_FILMS = 4;

export const getShowreelFilms = unstable_cache(
  async (): Promise<ShowreelFilm[]> => {
    if (!isSupabaseConfigured()) return showreel;

    const { data, error } = await createPublicSupabase()
      .from("showreel_videos")
      .select("youtube_id, title, sort_order")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .limit(MAX_SHOWREEL_FILMS)
      .returns<Pick<ShowreelVideoRow, "youtube_id" | "title" | "sort_order">[]>();

    if (error || !data || data.length === 0) return showreel;

    return data
      .filter((row) => row.youtube_id)
      .map((row) => ({ youtubeId: row.youtube_id, title: row.title }));
  },
  ["showreel-films"],
  CACHE,
);

/* -------------------------------------------------------------- services */

export const getServiceCards = unstable_cache(
  async (): Promise<ServiceCard[]> => {
    if (!isSupabaseConfigured()) return serviceCards;

    const { data, error } = await createPublicSupabase()
      .from("services")
      .select("id, slug, title, description, starting_price, price_note, icon, tier, sort_order")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .returns<Omit<ServiceRow, "created_at" | "updated_at" | "is_active">[]>();

    if (error || !data || data.length === 0) return serviceCards;

    return data.map((row) => ({
      key: row.id,
      slug: row.slug,
      title: row.title,
      description: row.description,
      startingPrice: row.starting_price === null ? null : Number(row.starting_price),
      priceNote: row.price_note,
      icon: row.icon,
      tier: row.tier === "specialist" ? "specialist" : "core",
    }));
  },
  ["service-cards"],
  CACHE,
);

/* ----------------------------------------------------------------- work */

const staticWorkCards: WorkCard[] = staticProjects.map((p) => ({
  key: p.slug,
  title: p.title,
  category: p.category,
  location: p.location,
  excerpt: p.excerpt,
  images: p.images,
  youtubeUrl: p.youtubeUrl,
  href: `/work/${p.slug}`,
}));

export const getWorkCards = unstable_cache(
  async (): Promise<WorkCard[]> => {
    if (!isSupabaseConfigured()) return staticWorkCards;

    const { data, error } = await createPublicSupabase()
      .from("projects")
      .select("id, slug, title, category, location, description, youtube_url, images, sort_order")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .returns<Omit<ProjectRow, "created_at" | "updated_at" | "is_active">[]>();

    if (error || !data) return staticWorkCards;

    const added: WorkCard[] = data.map((row) => ({
      key: row.id,
      title: row.title,
      category: row.category,
      location: row.location,
      excerpt: row.description,
      images: (row.images ?? []).map((img) => img.url).filter(Boolean),
      youtubeUrl: row.youtube_url,
      href: null,
    }));

    // Newly added work leads; the shipped case studies follow it. They are not
    // replaced — each one has a page of its own that would otherwise become
    // unreachable from the gallery the moment the first admin project lands.
    return [...added, ...staticWorkCards];
  },
  ["work-cards"],
  CACHE,
);
