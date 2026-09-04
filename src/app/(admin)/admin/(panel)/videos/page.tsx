import { VideoManager } from "@/components/admin/video-manager";
import { PageHeader } from "@/components/admin/ui";

export const metadata = { title: "Recent projects" };

export default function AdminVideosPage() {
  return (
    <>
      <PageHeader
        title="Recently completed projects"
        lede="Four YouTube films, shown as a row of players on the landing page. The section claims the work as ours, so only publish films Sky Lens actually flew."
      />
      <VideoManager />
    </>
  );
}
