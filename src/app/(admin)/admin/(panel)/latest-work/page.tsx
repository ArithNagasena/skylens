import { ImageManager } from "@/components/admin/image-manager";
import { PageHeader } from "@/components/admin/ui";

export const metadata = { title: "Latest work strip" };

export default function AdminLatestWorkPage() {
  return (
    <>
      <PageHeader
        title="Our Latest Work"
        lede="The scrolling strip of recent frames further down the landing page. Wide, finished shots read best here — three across on a desktop screen."
      />
      <ImageManager
        table="latest_work_images"
        folder="latest-work"
        emptyHint="No images yet — the strip is showing the ones that ship with the site. Add one to take over."
      />
    </>
  );
}
