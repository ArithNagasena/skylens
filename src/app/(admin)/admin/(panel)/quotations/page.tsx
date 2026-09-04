import Link from "next/link";
import { Plus } from "lucide-react";

import { DocumentList } from "@/components/admin/document-list";
import { PageHeader } from "@/components/admin/ui";

export const metadata = { title: "Quotations" };

export default function QuotationsPage() {
  return (
    <>
      <PageHeader
        title="Quotations"
        lede="Every estimate raised, with its reference number. A bill can be raised against any of them, which is what keeps the two documents agreeing."
        actions={
          <Link
            href="/admin/quotations/new"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-brand px-4 text-meta font-medium text-white transition-[filter] hover:brightness-110"
          >
            <Plus className="size-4" strokeWidth={2.2} />
            New quotation
          </Link>
        }
      />
      <DocumentList kind="quotation" />
    </>
  );
}
