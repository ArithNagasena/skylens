import type { NextConfig } from "next";

/**
 * Images uploaded through the admin panel are served from Supabase Storage, on
 * the project's own `*.supabase.co` host. next/image refuses any remote host it
 * has not been told about, so without this every admin-uploaded photograph
 * renders as a broken image while the ones in `public/` keep working — a
 * confusing failure that only shows up after the first upload.
 *
 * The host is derived from the same environment variable the client uses, so
 * there is nothing to keep in step by hand. The wildcard entry covers a
 * project whose URL is not set at build time (a preview deploy that reads it
 * from the runtime environment, say); both are Supabase-only, so neither opens
 * the optimiser up to arbitrary third-party origins.
 */
const supabaseHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").hostname;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      ...(supabaseHost
        ? ([{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }] as const)
        : []),
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
      // YouTube thumbnails, shown only inside the admin panel so an admin can
      // see which film a pasted link actually resolved to before saving it.
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" },
    ],
  },
};

export default nextConfig;
