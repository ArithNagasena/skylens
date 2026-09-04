import type { Metadata } from "next";

/**
 * The frame shared by the login screen and the panel behind it.
 *
 * Deliberately thin: it exists to keep the marketing header, footer and grain
 * overlay off these pages, and to mark the whole area `noindex`. The guard
 * lives one level down, in `admin/(panel)/layout.tsx`, so the login page can
 * sit outside it — a guard that also covered the sign-in form would redirect
 * a signed-out visitor to the page they were already on.
 */
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminAreaLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-void">{children}</div>;
}
