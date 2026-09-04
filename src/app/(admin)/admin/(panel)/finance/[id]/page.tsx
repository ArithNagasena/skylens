import { FinanceProjectLedger } from "@/components/admin/finance-project";

export const metadata = { title: "Job accounts" };

export default async function FinanceProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <FinanceProjectLedger projectId={id} />;
}
