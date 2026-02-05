"use client";

import { formatMoney } from "@/lib/money";
import type { Listing } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { buyNow } from "@/lib/api";

interface ConfirmPurchaseModalProps {
    listing: Listing;
    onClose: () => void;
}

export function ConfirmPurchaseModal({ listing, onClose }: ConfirmPurchaseModalProps) {
    const router = useRouter();
    const [buyerEmail, setBuyerEmail] = useState("");
    const [buyerName, setBuyerName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const buyNowPrice = listing.buy_now_price_cents;
    if (!buyNowPrice) return null;

    async function handleConfirm() {
        if (!/.+@.+\..+/.test(buyerEmail)) {
            setError("البريد الإلكتروني غير صحيح");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const result = await buyNow(listing.slug, buyerEmail, buyerName || undefined);
            // Redirect to payment page with payment info
            router.push(`/payment/${listing.slug}?payment_id=${result.payment_id}&type=buynow`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "حدث خطأ أثناء الشراء");
            setIsSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-md mx-4">
                {/* Modal Content */}
                <div className="rounded-3xl bg-white dark:bg-gray-900 shadow-2xl overflow-hidden border border-black/10 dark:border-white/10">
                    {/* Header with Image */}
                    <div className="relative h-48 bg-gradient-to-br from-purple-600 to-pink-600">
                        {listing.image_url && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={listing.image_url}
                                alt={listing.name}
                                className="h-full w-full object-cover opacity-50"
                            />
                        )}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                            <div className="text-sm font-medium opacity-90">تأكيد الشراء</div>
                            <h2 className="text-xl font-bold text-center mt-1 line-clamp-2">{listing.name}</h2>
                        </div>
                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={onClose}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Price Display */}
                    <div className="p-6 text-center border-b border-black/10 dark:border-white/10">
                        <div className="text-sm text-black/60 dark:text-white/60">سعر الشراء الفوري</div>
                        <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                            {formatMoney(buyNowPrice, listing.currency)}
                        </div>
                    </div>

                    {/* Form */}
                    <div className="p-6 space-y-4">
                        {error && (
                            <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium mb-1">البريد الإلكتروني *</label>
                            <input
                                type="email"
                                value={buyerEmail}
                                onChange={(e) => setBuyerEmail(e.target.value)}
                                placeholder="email@example.com"
                                className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-transparent px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">الاسم (اختياري)</label>
                            <input
                                type="text"
                                value={buyerName}
                                onChange={(e) => setBuyerName(e.target.value)}
                                placeholder="اسمك الكامل"
                                className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-transparent px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="flex-1 py-3 rounded-xl border border-black/10 dark:border-white/10 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 transition disabled:opacity-50"
                            >
                                إلغاء
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirm}
                                disabled={isSubmitting}
                                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold hover:opacity-90 transition disabled:opacity-50"
                            >
                                {isSubmitting ? "جاري الشراء..." : "تأكيد الشراء"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
