"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil, Receipt } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { Button, ConfirmButton, StatusLine, type Status } from "@/components/admin/ui";

/**
 * Edit, raise a bill from, or delete one document.
 *
 * "Create bill" only appears on a quotation, and passes the quotation's id
 * rather than opening an empty form: a bill that has to be retyped from the
 * quotation beside it is how the two end up disagreeing about what was
 * actually agreed.
 *
 * Deleting cascades to the line items in the database, so there is nothing to
 * clean up here — but it is genuinely irreversible, which is why it asks.
 */
export function DocumentActions({
  kind,
  id,
  number,
}: {
  kind: "quotation" | "bill";
  id: string;
  number: string;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const base = kind === "quotation" ? "/admin/quotations" : "/admin/bills";

  const remove = async () => {
    setBusy(true);
    const { error } = await supabase
      .from(kind === "quotation" ? "quotations" : "bills")
      .delete()
      .eq("id", id);
    setBusy(false);

    if (error) return setStatus({ kind: "error", message: error.message });

    router.push(base);
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-3 print:hidden">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="secondary" onClick={() => router.push(`${base}/${id}/edit`)}>
          <Pencil className="size-4" strokeWidth={1.9} />
          Edit
        </Button>

        {kind === "quotation" && (
          <Link
            href={`/admin/bills/new?from=${id}`}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-brand px-4 text-meta font-medium text-white transition-[filter] hover:brightness-110"
          >
            <Receipt className="size-4" strokeWidth={1.9} />
            Create bill from {number}
          </Link>
        )}

        <ConfirmButton onConfirm={() => void remove()} busy={busy} className="ml-auto" />
      </div>

      <StatusLine status={status} />
    </div>
  );
}
