import { ServiceManager } from "@/components/admin/service-manager";
import { PageHeader } from "@/components/admin/ui";

export const metadata = { title: "Services & prices" };

export default function AdminServicesPage() {
  return (
    <>
      <PageHeader
        title="Services & prices"
        lede="One list, used by the landing page, the services page and the quote form. A price changed here is the price a customer is quoted."
      />
      <ServiceManager />
    </>
  );
}
