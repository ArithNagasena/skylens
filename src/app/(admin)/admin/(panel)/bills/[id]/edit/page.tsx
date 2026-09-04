import { notFound } from "next/navigation";

import { DocumentForm } from "@/components/admin/document-form";
import { PageHeader } from "@/components/admin/ui";
import { createServerSupabase } from "@/lib/supabase/server";
import type { BillWithItems } from "@/lib/supabase/types";

export const metadata = { title: "Edit bill" };

export default async function EditBillPage({ params }: { params: Promise<{ id: string }> }) {
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
      <PageHeader
        title={`Edit ${data.bill_number}`}
        lede="Record a payment here and the status follows from it — unpaid, part paid, or paid."
      />
      <DocumentForm kind="bill" existing={data} />
    </>
  );
}
