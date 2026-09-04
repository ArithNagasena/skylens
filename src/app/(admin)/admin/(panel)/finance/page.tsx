import { FinanceOverview } from "@/components/admin/finance-overview";
import { PageHeader } from "@/components/admin/ui";

export const metadata = { title: "Finance" };

export default function FinancePage() {
  return (
    <>
      <PageHeader
        title="Accounts"
        lede="Income and costs per job, company overhead separately, and the profit that falls out of both."
      />
      <FinanceOverview />
    </>
  );
}
