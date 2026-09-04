import { notFound } from "next/navigation";

import { DocumentForm } from "@/components/admin/document-form";
import { PageHeader } from "@/components/admin/ui";
import { createServerSupabase } from "@/lib/supabase/server";
import type { QuotationWithItems } from "@/lib/supabase/types";

export const metadata = { title: "Edit quotation" };

export default async function EditQuotationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabase();

  const { data } = await supabase
    .from("quotations")
    .select("*, quotation_items(*)")
    .eq("id", id)
    .maybeSingle<QuotationWithItems>();

  if (!data) notFound();

  return (
    <>
      <PageHeader
        title={`Edit ${data.quote_number}`}
        lede="The reference number stays as it is — it may already be on a document the client has."
      />
      <DocumentForm kind="quotation" existing={data} />
    </>
  );
}
