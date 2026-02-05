export type ListingStatus = "pending" | "approved" | "rejected";

export type Bid = {
  id: number;
  bidder_email: string;
  amount_cents: number;
  created_at: string;
};

export type Listing = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  starting_price_cents: number;
  current_price_cents: number;
  currency: string;
  image_url: string | null;
  images?: string[];
  status: ListingStatus;
  approved_at: string | null;
  created_at: string;
  bids?: Bid[];
  bids_count?: number;
  seller_name?: string | null;
  seller_email?: string | null;
  rejected_at?: string | null;
  rejection_reason?: string | null;
  buy_now_price_cents?: number | null;
};

export type CreateListingInput = {
  name: string;
  description?: string;
  image_url?: string;
  starting_price_cents: number;
  currency?: string;
  seller_name?: string;
  seller_email: string;
  buy_now_price_cents?: number;
};

export type EmailTemplate = {
  id: number;
  key: string;
  subject: string;
  body: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type UpdateEmailTemplateInput = {
  subject: string;
  body: string;
  is_active?: boolean;
};

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
};
