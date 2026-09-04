/**
 * Live Google reviews, read from the Places API on the server.
 *
 * ─── SETUP ───────────────────────────────────────────────────────────────
 * Three steps, in this order. Nothing renders until all three are done, and
 * the site degrades gracefully in the meantime (see `getGoogleReviews` below).
 *
 *   1. Create a Google Business Profile for Sky Lens and get it verified:
 *      https://business.google.com — free, and the single biggest factor in
 *      appearing for "drone photography Colombo" and on Google Maps. Reviews
 *      cannot exist until this profile does.
 *
 *   2. Find the Place ID for the verified profile:
 *      https://developers.google.com/maps/documentation/places/web-service/place-id
 *      It looks like `ChIJN1t_tDeuEmsRUsoyG83frY4`.
 *
 *   3. Create a Google Cloud project, enable the **Places API (New)**, create
 *      an API key and attach a billing account. There is a recurring free
 *      usage tier; restrict the key to the Places API to avoid surprises.
 *
 * Then set both values in `.env.local` (see `.env.example`):
 *
 *      GOOGLE_PLACE_ID=...
 *      GOOGLE_PLACES_API_KEY=...
 *
 * ─── LIMITS, so nobody is surprised later ────────────────────────────────
 * The Places API returns at most **five** reviews and picks them itself —
 * they are the ones Google deems most relevant, and there is no way to choose
 * them, reorder them, or fetch more. Google's terms also require that a review
 * is shown with its author's name and, where displayed, their profile photo,
 * and that it links back to Google. `ReviewsSection` does all of that.
 *
 * Facebook has no equivalent. Meta removed reviews from the embeddable Page
 * Plugin, and the Graph API's `ratings` edge needs an app through App Review
 * plus Business Verification. The site links out to Facebook instead.
 */

export type GoogleReview = {
  id: string;
  author: string;
  /** The reviewer's Google Maps contributor page. Required attribution. */
  authorUrl?: string;
  photoUrl?: string;
  rating: number;
  text: string;
  /** Google's own phrasing, e.g. "2 months ago". */
  relativeTime: string;
};

export type GooglePlaceReviews = {
  /** Average rating across every review, e.g. 4.9. */
  rating: number;
  /** Total number of ratings, which is usually far more than the 5 returned. */
  total: number;
  /** Link to the place on Google Maps, where all reviews can be read. */
  mapsUri: string;
  reviews: GoogleReview[];
};

/** Shape of the slice of the Places API response we ask for. */
type PlacesResponse = {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: {
    name?: string;
    rating?: number;
    relativePublishTimeDescription?: string;
    text?: { text?: string };
    originalText?: { text?: string };
    authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
  }[];
};

/**
 * Returns the place's reviews, or `null` when the integration is not
 * configured, the request fails, or the profile has no reviews yet.
 *
 * `null` is a normal state, not an error: the section falls back to curated
 * quotes and a link out, so an unconfigured or rate-limited API never takes
 * the page down or leaves a hole in it.
 */
export async function getGoogleReviews(): Promise<GooglePlaceReviews | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) return null;

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews",
      },
      // Twelve hours. Reviews arrive slowly and every call is billable, so
      // there is nothing to gain from fetching this on each request.
      next: { revalidate: 60 * 60 * 12 },
    });

    if (!res.ok) {
      console.error(`[google-reviews] Places API returned ${res.status}`);
      return null;
    }

    const data = (await res.json()) as PlacesResponse;

    const reviews: GoogleReview[] = (data.reviews ?? [])
      .map((r, i) => ({
        id: r.name ?? `review-${i}`,
        author: r.authorAttribution?.displayName ?? "Google reviewer",
        authorUrl: r.authorAttribution?.uri,
        photoUrl: r.authorAttribution?.photoUri,
        rating: r.rating ?? 0,
        text: (r.text?.text ?? r.originalText?.text ?? "").trim(),
        relativeTime: r.relativePublishTimeDescription ?? "",
      }))
      .filter((r) => r.text.length > 0);

    if (reviews.length === 0) return null;

    return {
      rating: data.rating ?? 0,
      total: data.userRatingCount ?? reviews.length,
      mapsUri: data.googleMapsUri ?? `https://www.google.com/maps/place/?q=place_id:${placeId}`,
      reviews,
    };
  } catch (err) {
    console.error("[google-reviews] fetch failed", err);
    return null;
  }
}
