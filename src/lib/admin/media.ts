import type { SupabaseClient } from "@supabase/supabase-js";
import { MEDIA_BUCKET } from "@/lib/supabase/config";

/**
 * Uploading and removing images from the `media` bucket.
 *
 * Uploads go straight from the browser to Supabase Storage rather than through
 * a Next.js route. A photograph off a camera is routinely 8–20 MB, which a
 * server action would reject outright, and proxying it would mean holding the
 * whole file in the app server's memory for no benefit — the storage API
 * already enforces the same row-level policies the rest of the panel runs
 * under.
 */

export type UploadedImage = {
  /** Public URL, ready to store on the row and render with next/image. */
  url: string;
  /** Path inside the bucket, kept so the file can be deleted with the row. */
  path: string;
};

/** Anything a browser can decode and Supabase will accept. */
export const ACCEPTED_IMAGE_TYPES = "image/jpeg,image/png,image/webp,image/avif";

/** 15 MB. Comfortably above a full-frame JPEG, below anything pathological. */
export const MAX_IMAGE_BYTES = 15 * 1024 * 1024;

function extensionFor(file: File): string {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]{2,5}$/.test(fromName)) return fromName;
  return file.type.split("/")[1] ?? "jpg";
}

/**
 * Puts one file in the bucket under `folder/` and returns its public URL.
 *
 * The stored name is a fresh UUID, not the original filename: two people
 * uploading `DJI_0042.JPG` would otherwise collide, and an uploaded name can
 * carry spaces, accents and slashes that then have to be escaped everywhere
 * the URL appears. The human-readable name lives in the row's `alt` text,
 * where it is actually useful.
 */
export async function uploadImage(
  supabase: SupabaseClient,
  file: File,
  folder: string,
): Promise<UploadedImage> {
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error(
      `${file.name} is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is ${MAX_IMAGE_BYTES / 1024 / 1024} MB.`,
    );
  }

  const path = `${folder}/${crypto.randomUUID()}.${extensionFor(file)}`;

  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type || undefined,
    upsert: false,
  });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

/**
 * Removes files from the bucket, ignoring anything that is not ours.
 *
 * Rows seeded from `public/images` carry a null path — they reference a file
 * that ships with the site, and deleting the row must leave that file alone.
 * Failures are swallowed on purpose: the caller has already deleted the row it
 * belonged to, and an orphaned object in storage is a tidiness problem, not a
 * reason to show the admin an error about work that did succeed.
 */
export async function removeImages(
  supabase: SupabaseClient,
  paths: (string | null | undefined)[],
): Promise<void> {
  const real = paths.filter((p): p is string => Boolean(p));
  if (real.length === 0) return;

  try {
    await supabase.storage.from(MEDIA_BUCKET).remove(real);
  } catch {
    // Deliberately ignored — see above.
  }
}
