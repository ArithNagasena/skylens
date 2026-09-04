/**
 * Row shapes for every table in supabase/migrations/0001_init.sql.
 *
 * These are hand-written rather than generated so the repo has no dependency
 * on the Supabase CLI being installed. Keep them in step with the migration —
 * queries are typed at the call site with `.returns<Row[]>()`, so a drift here
 * shows up as wrong types rather than as a runtime error, which is exactly the
 * failure mode worth avoiding.
 */

export type ImageRow = {
  id: string;
  url: string;
  /** Path inside the `media` bucket. Null for images shipped in `public/`. */
  storage_path: string | null;
  alt: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ShowreelVideoRow = {
  id: string;
  youtube_id: string;
  title: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ServiceRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  /** Numeric so it can be formatted and totalled; null means "on request". */
  starting_price: number | null;
  /** Qualifier printed after the price, e.g. "per visit". */
  price_note: string;
  /** lucide-react icon name, resolved in components/ui/icon.tsx. */
  icon: string;
  /** Which block of the /services page the card sits in. */
  tier: "core" | "specialist";
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProjectImage = {
  url: string;
  /** Path inside the `media` bucket, so the file can be removed with the row. */
  path?: string | null;
  alt?: string;
};

export type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string;
  description: string;
  youtube_url: string;
  images: ProjectImage[];
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

/* ------------------------------------------------------------- documents */

export type DocumentItem = {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  sort_order: number;
};

export type QuotationStatus = "draft" | "sent" | "accepted" | "declined" | "expired";

export type QuotationRow = {
  id: string;
  quote_number: string;
  client_name: string;
  client_company: string;
  client_email: string;
  client_phone: string;
  client_address: string;
  project_title: string;
  location: string;
  issue_date: string;
  valid_until: string | null;
  currency: string;
  discount: number;
  tax_rate: number;
  notes: string;
  terms: string;
  status: QuotationStatus;
  created_at: string;
  updated_at: string;
};

export type QuotationWithItems = QuotationRow & {
  quotation_items: (DocumentItem & { quotation_id: string })[];
};

export type BillStatus = "unpaid" | "partial" | "paid" | "cancelled";

export type BillRow = {
  id: string;
  bill_number: string;
  quotation_id: string | null;
  /** The quotation's number, kept verbatim so the printed bill survives its deletion. */
  quote_reference: string;
  client_name: string;
  client_company: string;
  client_email: string;
  client_phone: string;
  client_address: string;
  project_title: string;
  location: string;
  issue_date: string;
  due_date: string | null;
  currency: string;
  discount: number;
  tax_rate: number;
  amount_paid: number;
  payment_method: string;
  notes: string;
  terms: string;
  status: BillStatus;
  created_at: string;
  updated_at: string;
};

export type BillWithItems = BillRow & {
  bill_items: (DocumentItem & { bill_id: string })[];
};

/* --------------------------------------------------------------- finance */

export type FinanceProjectStatus = "active" | "completed" | "cancelled";

export type FinanceProjectRow = {
  id: string;
  name: string;
  client: string;
  reference: string;
  status: FinanceProjectStatus;
  start_date: string;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type FinanceEntryRow = {
  id: string;
  kind: "income" | "expense";
  scope: "project" | "company";
  project_id: string | null;
  category: string;
  description: string;
  amount: number;
  entry_date: string;
  created_at: string;
};

export type AdminRow = {
  user_id: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
};
