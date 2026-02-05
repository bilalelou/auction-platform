const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ||
    "http://localhost:8000";

export interface PaymentInfo {
    product: {
        id: number;
        name: string;
        slug: string;
        image_url: string | null;
    };
    winning_bid: {
        id: number;
        bidder_email: string;
        amount_cents: number;
        currency: string;
    };
    payment_status: string;
    existing_payment: {
        id: number;
        payment_method: string;
        status: string;
    } | null;
}

export interface PaymentResult {
    id: number;
    transaction_id: string;
    payment_method: string;
    status: string;
    amount_cents: number;
    currency: string;
}

async function readJson<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`API ${res.status}: ${text || res.statusText}`);
    }
    return (await res.json()) as T;
}

export async function getPaymentInfo(slug: string): Promise<PaymentInfo> {
    const res = await fetch(`${apiBaseUrl}/api/payment/${slug}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    const json = await readJson<{ data: PaymentInfo }>(res);
    return json.data;
}

export async function processPayment(input: {
    product_id: number;
    bid_id: number;
    payment_method: "paypal" | "card" | "cod";
    card_number?: string;
    card_expiry?: string;
    card_cvv?: string;
    notes?: string;
}): Promise<{ data: PaymentResult; message: string }> {
    const res = await fetch(`${apiBaseUrl}/api/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });

    return await readJson<{ data: PaymentResult; message: string }>(res);
}
