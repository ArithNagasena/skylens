/**
 * A portfolio entry as the gallery renders it — the shape shared by the
 * detailed case studies in `content/projects.ts` and the lighter entries an
 * admin adds through the panel.
 *
 * `href` is what separates them: a case study links to its own page, an
 * admin-added project has no page to link to and renders its title as plain
 * text rather than pointing at a 404.
 */
export type WorkCard = {
  key: string;
  title: string;
  category: string;
  location: string;
  excerpt: string;
  images: string[];
  youtubeUrl: string;
  href: string | null;
};

/**
 * The filter chips on /work, derived from whatever categories are actually in
 * use rather than from a fixed list. An admin can invent a category when
 * adding a project, and it needs a chip; a category nobody has used any more
 * should not leave a chip that filters to nothing.
 *
 * "All" leads; the rest are alphabetical so the row does not reshuffle every
 * time a project is added.
 */
export function workCategories(cards: WorkCard[]): string[] {
  const seen: string[] = [];
  for (const c of cards) if (c.category && !seen.includes(c.category)) seen.push(c.category);
  return ["All", ...seen.sort((a, b) => a.localeCompare(b))];
}
