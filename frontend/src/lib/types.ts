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

export type Review = {
  id: number;
  reviewer_id: number;
  seller_id: number;
  product_id: number | null;
  rating: number; // 1-5
  comment: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  reviewer?: {
    id: number;
    name: string;
    email?: string;
  };
  seller?: {
    id: number;
    name: string;
    email?: string;
  };
  product?: {
    id: number;
    title: string;
    slug: string;
  };
};

export type ReviewStats = {
  average_rating: number;
  total_reviews: number;
  rating_distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
};

export type CreateReviewInput = {
  seller_id: number;
  product_id?: number | null;
  rating: number;
  comment?: string;
};

export type UpdateReviewInput = {
  rating?: number;
  comment?: string;
};
