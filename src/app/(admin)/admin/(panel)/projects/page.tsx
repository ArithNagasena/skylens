import { ProjectManager } from "@/components/admin/project-manager";
import { PageHeader } from "@/components/admin/ui";

export const metadata = { title: "Portfolio projects" };

export default function AdminProjectsPage() {
  return (
    <>
      <PageHeader
        title="Portfolio projects"
        lede="Work shown as cards on the work page. Anything added here appears above the case studies that ship with the site."
      />
      <ProjectManager />
    </>
  );
}
