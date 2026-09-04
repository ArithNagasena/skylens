import { DocumentForm } from "@/components/admin/document-form";
import { PageHeader } from "@/components/admin/ui";

export const metadata = { title: "New bill" };

/**
 * `?from=<quotation id>` arrives from the "Create bill from …" button on a
 * quotation. The form then loads that quotation and copies the client, the
 * job, the lines and the terms across, and records its number on the bill.
 */
export default async function NewBillPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const from = typeof sp.from === "string" ? sp.from : undefined;

  return (
    <>
      <PageHeader
        title="New bill"
        lede={
          from
            ? "Raised against a quotation — the client, the lines and the terms are copied across."
            : "The bill number is assigned on save. Cite a quotation below to link the two."
        }
      />
      <DocumentForm kind="bill" fromQuotationId={from} />
    </>
  );
}
