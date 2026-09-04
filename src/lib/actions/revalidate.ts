"use server";

import { revalidateTag } from "next/cache";
import { getAdminUser } from "@/lib/supabase/server";
import { SITE_CONTENT_TAG } from "@/lib/cms/site-content";

/**
 * Drop the cached public content so an edit shows on the live site at once.
 *
 * Called by the admin screens after every write. Without it the landing page
 * would keep serving its cached copy for up to a minute after a save, which
 * reads as "the panel didn't work" long before it reads as "caching".
 *
 * Guarded by the same admin check the panel itself uses. A server action is a
 * public endpoint — anyone who knows its id can post to it — and while a cache
 * purge is not destructive, an unauthenticated one repeated in a loop is a way
 * to push load onto the database.
 */
export async function revalidateSiteContent(): Promise<void> {
  const { isAdmin } = await getAdminUser();
  if (!isAdmin) return;

  revalidateTag(SITE_CONTENT_TAG);
}
