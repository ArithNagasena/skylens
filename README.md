# Sky Lens

Marketing site for **Sky Lens Aerial Services** — a drone studio offering aerial
cinematography, survey-grade mapping, asset inspection and thermal audit.

Built with **Next.js 15 (App Router)**, **TypeScript** and **Tailwind CSS v4**.

---

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
npm run lint
```

---

## Site structure

| Route | Purpose |
| --- | --- |
| `/` | Home — hero, capabilities, service bento, featured work, process, fleet, testimonials, insights, CTA |
| `/services` | Index of all eight disciplines, plus cross-discipline bundling |
| `/services/[slug]` | Service detail: capabilities, deliverables, specs, related case studies |
| `/work` | Filterable case-study gallery |
| `/work/[slug]` | Case study: challenge, approach, deliverables, measured results |
| `/fleet` | Five airframes, six sensor payloads, airworthiness practice |
| `/pricing` | Three tiers, comparison table, add-ons, booking FAQ |
| `/about` | Story, values, crew, timeline, coverage |
| `/insights` | Article index |
| `/insights/[slug]` | Article |
| `/contact` | Quote form (server action), direct contact, coverage |
| `/faq` | Full FAQ, grouped |
| `/privacy`, `/terms` | Legal |
| `sitemap.xml`, `robots.txt`, `opengraph-image` | Generated automatically |

Everything except `/contact` is statically prerendered. `/contact` is dynamic
because it reads `?service=` to preselect the form's discipline.

---

## Where the content lives

All copy is typed data in [`src/content/`](src/content/) — no CMS required, and
changing text never means touching a component.

| File | Contains |
| --- | --- |
| `site.ts` | Brand, **contact details**, navigation, credentials, client list, hero stats |
| `services.ts` | The eight services and everything on their detail pages |
| `projects.ts` | Case studies |
| `fleet.ts` | Aircraft, sensors, safety systems |
| `pricing.ts` | Tiers, add-ons, comparison table, notes |
| `company.ts` | Process, values, team, timeline, coverage |
| `posts.ts` | Articles, as structured blocks |
| `faq.ts`, `testimonials.ts`, `legal.ts` | As named |

### Before launch

1. **`src/content/site.ts`** — replace `contact`, `socials` and `domain` with the real details.
2. **`src/content/legal.ts`** — have counsel review the privacy and terms text.
3. **`src/lib/actions.ts`** — wire `submitQuote` to a real inbox (Resend, Postmark, a CRM
   webhook). It currently validates and logs; the `TODO(launch)` comment marks the spot.
4. **Photography** — see below.

---

## The artwork is generated, not stock

The site ships with **no placeholder photography**. Every visual plate — case study
headers, service cards, article images, team cards — is a deterministic SVG
"survey plate" drawn by [`TerrainField`](src/components/visuals/terrain-field.tsx):
seeded topographic contours, a flight path, a reticle and survey grid, tinted per
subject.

Same seed, same output, so server and client render identically and nothing
shifts on hydration.

When real aerial photography is available, swap `TerrainField` for `next/image`
inside the card components (`project-card.tsx`, `post-card.tsx`, the fleet and
service pages). The layouts already reserve the correct aspect ratios.

---

## Design system

Defined as Tailwind v4 `@theme` tokens in [`src/app/globals.css`](src/app/globals.css).

- **Surfaces** — `void` → `obsidian` → `surface`, a near-black cockpit palette
- **Brand** — `signal` (instrument cyan), `beacon` (amber), `horizon` (indigo)
- **Type** — Sora (display), Inter (body), JetBrains Mono (HUD chrome and labels)
- **Motifs** — corner ticks, scan beams, altitude ladders, film grain, survey grid

Motion runs through `motion/react` and respects `prefers-reduced-motion`
throughout — every animation collapses to near-zero duration.

---

## Accessibility & SEO

- Skip link, focus-visible rings, `aria-current` on active nav, labelled form fields
  with inline error text, `aria-live` status region on the quote form
- Semantic landmarks and a single `h1` per page
- Per-page metadata and canonicals; JSON-LD for `ProfessionalService`, `Service`,
  `BreadcrumbList`, `FAQPage` and `BlogPosting`
- Generated sitemap, robots and Open Graph image
