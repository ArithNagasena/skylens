import type { Metadata, Viewport } from "next";
import { Archivo, Inter, JetBrains_Mono } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

/**
 * The display face, used for every heading and the large stat numerals.
 *
 * Archivo is an editorial grotesk: tighter and more authoritative than the
 * rounded, geometric Sora it replaced, and it holds its shape from 12px specs
 * up to the 66px hero. It is bound to a face-agnostic variable so swapping the
 * display typeface later is this one declaration plus nothing else.
 */
const display = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display-face",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-hud",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: `${site.name} — Aerial Drone Services, Film & Survey`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "drone services",
    "aerial photography",
    "aerial cinematography",
    "drone survey",
    "photogrammetry",
    "drone inspection",
    "thermal drone survey",
    "real estate drone",
    "drone Sri Lanka",
    "aerial photography Sri Lanka",
    "drone videography Colombo",
    "CAASL registered drone operator",
  ],
  authors: [{ name: site.legalName }],
  creator: site.legalName,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.domain,
    siteName: site.name,
    title: `${site.name} — Aerial Drone Services, Film & Survey`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Aerial Drone Services`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#f5f8fc",
  colorScheme: "light",
};

/**
 * The document shell, and nothing else.
 *
 * The header, footer and grain overlay used to live here, which meant every
 * route in the app got the marketing chrome whether it wanted it or not. They
 * now sit in `(site)/layout.tsx`, so the admin panel under `(admin)` can have
 * its own frame while both halves still share the fonts, the metadata defaults
 * and one `<html>` element.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
