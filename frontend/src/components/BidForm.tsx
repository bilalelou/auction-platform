"use client";

import { placeBid } from "@/lib/api";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export function BidForm({
  slug,
  currency,
  minAmountCents,
}: {
  slug: string;
  currency: string;
  minAmountCents: number;
}) {
  const { t } = useTranslation();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const minAmount = useMemo(() => (minAmountCents / 100).toFixed(2), [minAmountCents]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const parsed = Number.parseFloat(amount);
    const cents = Number.isFinite(parsed) ? Math.round(parsed * 100) : 0;

    if (!/.+@.+\..+/.test(email)) {
      setError(t('errors.invalidEmail'));
      return;
    }

    if (cents < minAmountCents) {
      setError(`${t('listing.placeBid')} - أقل مبلغ: ${minAmount} ${currency}`);
      return;
    }

    setIsSubmitting(true);

    try {
      await placeBid(slug, email, cents);
      setSuccess(true);
      setEmail("");
      setAmount("");
      setTimeout(() => {
        router.refresh();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.serverError'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2 text-black dark:text-white">
            {t('auth.email')}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-black/40 dark:text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="example@email.com"
              required
              className="w-full rounded-2xl border-2 border-purple-200 dark:border-purple-800 bg-white dark:bg-black pl-11 pr-4 py-3 text-sm outline-none focus:border-purple-600 dark:focus:border-purple-400 transition-colors placeholder:text-black/40 dark:placeholder:text-white/40"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-black dark:text-white">
            مبلغ العرض ({currency})
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-black/40 dark:text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              step="0.01"
              min={minAmount}
              placeholder={minAmount}
              required
              className="w-full rounded-2xl border-2 border-purple-200 dark:border-purple-800 bg-white dark:bg-black pl-11 pr-4 py-3 text-sm outline-none focus:border-purple-600 dark:focus:border-purple-400 transition-colors placeholder:text-black/40 dark:placeholder:text-white/40"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border-2 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 p-4 flex items-start gap-3 animate-shake">
          <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-2xl border-2 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20 p-4 flex items-start gap-3 animate-bounce-once">
          <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-sm text-green-700 dark:text-green-300 font-medium">
            تم تقديم عرضك بنجاح!
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || success}
        className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>جاري الإرسال...</span>
          </>
        ) : success ? (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>تم بنجاح!</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>{t('listing.placeBid')}</span>
          </>
        )}
      </button>
    </form>
  );
}