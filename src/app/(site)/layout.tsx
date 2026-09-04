import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Grain } from "@/components/visuals/atmosphere";
import { OrganizationJsonLd } from "@/components/seo/json-ld";

/**
 * The public site's frame: header, footer, grain, and the Organization
 * JSON-LD that describes the business to search engines.
 *
 * A route group, so none of it appears in the URL — `/about` is still
 * `/about`. Splitting it out of the root layout is what keeps the admin panel
 * free of the marketing chrome, and keeps the structured data off pages that
 * are not about the business at all.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <OrganizationJsonLd />
      <Grain />
      <SiteHeader />
      <main id="main" className="relative">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
