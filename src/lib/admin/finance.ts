import { round } from "@/lib/admin/documents";
import type { FinanceEntryRow } from "@/lib/supabase/types";

/**
 * Turning a list of money movements into the numbers the studio actually asks
 * about: what a job made, and what the business made after overhead.
 *
 * The distinction the whole section rests on is `scope`. Money attached to a
 * job — the fee taken, the crew, the fuel, the permit — belongs to that job and
 * decides whether it was worth flying. Management time, advertising, equipment
 * and the rest belong to the company and are paid for out of every job
 * together. Adding them into one pot would make each project look unprofitable
 * and the business look better than it is; keeping them apart is what lets
 * both questions be answered from the same ledger.
 */

export type ProjectSummary = {
  income: number;
  expenses: number;
  /** Income less the expenses booked against this job, before overhead. */
  profit: number;
};

export type CompanySummary = {
  projectIncome: number;
  projectExpenses: number;
  /** Income from entries not attached to a job — a licensing fee, a refund. */
  otherIncome: number;
  companyExpenses: number;
  /** By category, largest first — where the overhead actually went. */
  companyExpensesByCategory: { category: string; amount: number }[];
  /** Project income less project expenses, before overhead. */
  grossProfit: number;
  totalIncome: number;
  totalExpenses: number;
  /** What the business kept, after overhead. This is the bottom line. */
  netProfit: number;
};

const sum = (entries: FinanceEntryRow[]) =>
  round(entries.reduce((total, entry) => total + Number(entry.amount || 0), 0));

export function summariseProject(entries: FinanceEntryRow[], projectId: string): ProjectSummary {
  const mine = entries.filter((e) => e.project_id === projectId);
  const income = sum(mine.filter((e) => e.kind === "income"));
  const expenses = sum(mine.filter((e) => e.kind === "expense"));
  return { income, expenses, profit: round(income - expenses) };
}

export function summariseCompany(entries: FinanceEntryRow[]): CompanySummary {
  const projectIncome = sum(entries.filter((e) => e.scope === "project" && e.kind === "income"));
  const projectExpenses = sum(entries.filter((e) => e.scope === "project" && e.kind === "expense"));
  const otherIncome = sum(entries.filter((e) => e.scope === "company" && e.kind === "income"));
  const companyExpenseEntries = entries.filter(
    (e) => e.scope === "company" && e.kind === "expense",
  );
  const companyExpenses = sum(companyExpenseEntries);

  const byCategory = new Map<string, number>();
  for (const entry of companyExpenseEntries) {
    byCategory.set(entry.category, round((byCategory.get(entry.category) ?? 0) + Number(entry.amount)));
  }

  const totalIncome = round(projectIncome + otherIncome);
  const totalExpenses = round(projectExpenses + companyExpenses);

  return {
    projectIncome,
    projectExpenses,
    otherIncome,
    companyExpenses,
    companyExpensesByCategory: [...byCategory.entries()]
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount),
    grossProfit: round(projectIncome - projectExpenses),
    totalIncome,
    totalExpenses,
    netProfit: round(totalIncome - totalExpenses),
  };
}

/**
 * The overhead categories the studio spends under.
 *
 * A fixed list rather than free text, because the point of the breakdown is
 * comparing one month's advertising against another's — and "Advertising",
 * "advertising" and "Ads" typed on three different days do not compare. The
 * description field is where the specifics go.
 */
export const COMPANY_EXPENSE_CATEGORIES = [
  "Management",
  "Advertising & marketing",
  "Equipment & maintenance",
  "Salaries",
  "Office & rent",
  "Insurance & licences",
  "Software & subscriptions",
  "Travel",
  "Other",
] as const;

/** The same idea for money spent on a specific job. */
export const PROJECT_EXPENSE_CATEGORIES = [
  "Crew",
  "Travel & transport",
  "Accommodation",
  "Permits & approvals",
  "Equipment hire",
  "Editing & post",
  "Other",
] as const;
