import { notFound } from "next/navigation";

import { DocumentActions } from "@/components/admin/document-actions";
import { DocumentPrint } from "@/components/admin/document-print";
import { createServerSupabase } from "@/lib/supabase/server";
import type { BillWithItems } from "@/lib/supabase/types";

export const metadata = { title: "Bill" };

export default async function BillPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabase();

  const { data } = await supabase
    .from("bills")
    .select("*, bill_items(*)")
    .eq("id", id)
    .maybeSingle<BillWithItems>();

  if (!data) notFound();

  return (
    <>
      <DocumentActions kind="bill" id={data.id} number={data.bill_number} />
      <div className="mt-4">
        <DocumentPrint kind="bill" doc={data} />
      </div>
    </>
  );
}
