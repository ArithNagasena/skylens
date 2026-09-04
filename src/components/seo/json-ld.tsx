import { contact, site, socials } from "@/content/site";
import { services } from "@/content/services";

function Script({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is generated from local content, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "@id": `${site.domain}#organization`,
        name: site.name,
        legalName: site.legalName,
        description: site.description,
        url: site.domain,
        email: contact.email,
        telephone: contact.phone,
        foundingDate: String(site.founded),
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          streetAddress: contact.address.street,
          addressLocality: contact.address.city,
          addressRegion: contact.address.region,
          postalCode: contact.address.postal,
          addressCountry: contact.address.country,
        },
        areaServed: { "@type": "Country", name: "Sri Lanka" },
        sameAs: socials.map((s) => s.href),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Drone services",
          itemListElement: services.map((s) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: s.title,
              description: s.summary,
              url: `${site.domain}/services/${s.slug}`,
            },
          })),
        },
      }}
    />
  );
}

export function BreadcrumbJsonLd({ trail }: { trail: { name: string; href: string }[] }) {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: trail.map((t, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: t.name,
          item: `${site.domain}${t.href}`,
        })),
      }}
    />
  );
}

export function ServiceJsonLd({
  name,
  description,
  slug,
}: {
  name: string;
  description: string;
  slug: string;
}) {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        name,
        description,
        url: `${site.domain}/services/${slug}`,
        serviceType: name,
        provider: { "@id": `${site.domain}#organization` },
        areaServed: { "@type": "Country", name: "Sri Lanka" },
      }}
    />
  );
}

export function FaqJsonLd({ items }: { items: { q: string; a: string }[] }) {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((i) => ({
          "@type": "Question",
          name: i.q,
          acceptedAnswer: { "@type": "Answer", text: i.a },
        })),
      }}
    />
  );
}

