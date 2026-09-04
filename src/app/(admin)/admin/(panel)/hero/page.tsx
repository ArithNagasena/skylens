import { ImageManager } from "@/components/admin/image-manager";
import { PageHeader } from "@/components/admin/ui";

export const metadata = { title: "Hero photos" };

export default function AdminHeroPage() {
  return (
    <>
      <PageHeader
        title="Hero photos"
        lede="The frames that rotate inside the viewfinder panel at the top of the landing page. They change every few seconds, so three to six works better than one."
      />
      <ImageManager
        table="hero_images"
        folder="hero"
        emptyHint="No hero photos yet — the landing page is showing the images that ship with the site. Add one to take over."
      />
    </>
  );
}
