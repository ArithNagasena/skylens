import { notFound } from "next/navigation";

import { DocumentActions } from "@/components/admin/document-actions";
import { DocumentPrint } from "@/components/admin/document-print";
import { createServerSupabase } from "@/lib/supabase/server";
import type { QuotationWithItems } from "@/lib/supabase/types";

export const metadata = { title: "Quotation" };

export default async function QuotationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabase();

  const { data } = await supabase
    .from("quotations")
    .select("*, quotation_items(*)")
    .eq("id", id)
    .maybeSingle<QuotationWithItems>();

  // A missing row and a row this user is not allowed to see are the same
  // response from PostgREST under row-level security, and the honest answer to
  // both is a 404 — anything more specific would confirm the document exists.
  if (!data) notFound();

  return (
    <>
      <DocumentActions kind="quotation" id={data.id} number={data.quote_number} />
      <div className="mt-4">
        <DocumentPrint kind="quotation" doc={data} />
      </div>
    </>
  );
}
