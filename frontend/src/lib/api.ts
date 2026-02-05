import type { CreateListingInput, EmailTemplate, Listing, UpdateEmailTemplateInput, User } from "@/lib/types";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ||
  "http://localhost:8000";

async function readJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return (await res.json()) as T;
}

export async function fetchListings(): Promise<Listing[]> {
  const res = await fetch(`${apiBaseUrl}/api/listings`, { cache: "no-store" });
  const json = await readJson<{ data: Listing[] }>(res);
  return json.data;
}

export async function fetchListing(slug: string): Promise<Listing> {
  const res = await fetch(`${apiBaseUrl}/api/listings/${slug}`, {
    cache: "no-store",
  });
  const json = await readJson<{ data: Listing }>(res);
  return json.data;
}

export async function createListing(input: CreateListingInput) {
  const res = await fetch(`${apiBaseUrl}/api/listings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const json = await readJson<{ data: Listing }>(res);
  return json.data;
}

export async function createListingWithImages(
  input: CreateListingInput,
  images: File[],
) {
  const form = new FormData();
  form.append("name", input.name);
  if (input.description) form.append("description", input.description);
  if (input.image_url) form.append("image_url", input.image_url);
  form.append("starting_price_cents", String(input.starting_price_cents));
  if (input.currency) form.append("currency", input.currency);
  if (input.seller_name) form.append("seller_name", input.seller_name);
  form.append("seller_email", input.seller_email);
  if (input.buy_now_price_cents) form.append("buy_now_price_cents", String(input.buy_now_price_cents));

  for (const file of images) {
    form.append("images[]", file);
  }

  const res = await fetch(`${apiBaseUrl}/api/listings`, {
    method: "POST",
    body: form,
  });

  const json = await readJson<{ data: Listing }>(res);
  return json.data;
}

export async function placeBid(
  slug: string,
  bidderEmail: string,
  amountCents: number,
) {
  const res = await fetch(`${apiBaseUrl}/api/listings/${slug}/bids`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ bidder_email: bidderEmail, amount_cents: amountCents }),
  });

  const json = await readJson<{ data: unknown }>(res);
  return json.data;
}

export async function buyNow(
  slug: string,
  buyerEmail: string,
  buyerName?: string,
) {
  const res = await fetch(`${apiBaseUrl}/api/listings/${slug}/buy-now`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ buyer_email: buyerEmail, buyer_name: buyerName }),
  });

  const json = await readJson<{ data: { payment_id: number; product_id: number; product_name: string; amount_cents: number; currency: string; status: string; message: string } }>(res);
  return json.data;
}

export async function adminFetchListings(
  status: "pending" | "approved" | "rejected",
  adminToken: string,
): Promise<Listing[]> {
  const res = await fetch(`${apiBaseUrl}/api/admin/listings?status=${status}`, {
    cache: "no-store",
    headers: {
      "X-Admin-Token": adminToken,
    },
  });

  const json = await readJson<{ data: Listing[] }>(res);
  return json.data;
}

export async function adminApproveListing(id: number, adminToken: string) {
  const res = await fetch(`${apiBaseUrl}/api/admin/listings/${id}/approve`, {
    method: "POST",
    headers: {
      "X-Admin-Token": adminToken,
    },
  });

  const json = await readJson<{ data: Listing }>(res);
  return json.data;
}

export async function adminRejectListing(
  id: number,
  reason: string,
  adminToken: string,
) {
  const res = await fetch(`${apiBaseUrl}/api/admin/listings/${id}/reject`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Token": adminToken,
    },
    body: JSON.stringify({ reason }),
  });

  const json = await readJson<{ data: Listing }>(res);
  return json.data;
}

// ============= Authentication API =============

export async function login(email: string, password: string): Promise<{ user: User; token: string }> {
  const res = await fetch(`${apiBaseUrl}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const json = await readJson<{ user: User; token: string }>(res);
  return json;
}

export async function register(
  name: string,
  email: string,
  password: string,
  passwordConfirmation: string
): Promise<{ user: User; token: string }> {
  const res = await fetch(`${apiBaseUrl}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    }),
  });

  const json = await readJson<{ user: User; token: string }>(res);
  return json;
}

export async function getCurrentUser(token: string): Promise<User> {
  const res = await fetch(`${apiBaseUrl}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  const json = await readJson<{ data: User }>(res);
  return json.data;
}

export async function logout(token: string): Promise<void> {
  const res = await fetch(`${apiBaseUrl}/api/auth/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  await readJson<{ message: string }>(res);
}

// ============= Email Templates API =============
