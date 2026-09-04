import Link from "next/link";
import { Plus } from "lucide-react";

import { DocumentList } from "@/components/admin/document-list";
import { PageHeader } from "@/components/admin/ui";

export const metadata = { title: "Bills" };

export default function BillsPage() {
  return (
    <>
      <PageHeader
        title="Bills"
        lede="Invoices raised, what has been received against each, and what is still outstanding."
        actions={
          <Link
            href="/admin/bills/new"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-brand px-4 text-meta font-medium text-white transition-[filter] hover:brightness-110"
          >
            <Plus className="size-4" strokeWidth={2.2} />
            New bill
          </Link>
        }
      />
      <DocumentList kind="bill" />
    </>
  );
}
