import { DocumentForm } from "@/components/admin/document-form";
import { PageHeader } from "@/components/admin/ui";

export const metadata = { title: "New quotation" };

export default function NewQuotationPage() {
  return (
    <>
      <PageHeader
        title="New quotation"
        lede="The reference number is assigned on save — SLQ-2026-0001 and up — and never reused."
      />
      <DocumentForm kind="quotation" />
    </>
  );
}
