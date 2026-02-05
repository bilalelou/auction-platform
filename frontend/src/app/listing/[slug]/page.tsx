"use client";

import { useEffect, useState } from "react";
import { BidForm } from "@/components/BidForm";
import { fetchListing } from "@/lib/api";
import { formatMoney } from "@/lib/money";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import Link from "next/link";
import type { Listing } from "@/lib/types";
import { ConfirmPurchaseModal } from "@/components/ConfirmPurchaseModal";

export default function ListingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { t } = useTranslation();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [slug, setSlug] = useState<string>("");
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [showBuyNowModal, setShowBuyNowModal] = useState(false);

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    if (!slug) return;

    async function loadListing() {
      try {
        const data = await fetchListing(slug);
        setListing(data);
      } catch (error) {
        console.error("Failed to load listing:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadListing();
  }, [slug]);

  useEffect(() => {
    const first = listing?.images?.[0] ?? listing?.image_url ?? null;
    setActiveImage(first);
  }, [listing]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-black/60 dark:text-white/60">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="text-center py-20">
        <div className="mx-auto w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">{t('errors.notFound')}</h2>
        <Link href="/" className="text-purple-600 hover:underline">
          {t('common.back')} {t('nav.home')}
        </Link>
      </div>
    );
  }

  const maxBid = Math.max(
    listing.starting_price_cents,
    ...(listing.bids ?? []).map((b) => b.amount_cents),
  );
  const minAmountCents = maxBid + 1;
  const totalBids = (listing.bids ?? []).length;

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-black/60 dark:text-white/60">
        <Link href="/" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
          {t('nav.home')}
        </Link>
        <span>/</span>
        <Link href="/" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
          {t('listing.title')}
        </Link>
        <span>/</span>
        <span className="text-black dark:text-white font-medium truncate max-w-xs">
          {listing.name}
        </span>
      </nav>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-2xl relative group">
            {activeImage ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeImage}
                  alt={listing.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </>
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <div className="text-center space-y-3">
                  <svg className="w-20 h-20 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-black/40 dark:text-white/40">{t('listing.description')}</p>
                </div>
              </div>
            )}

            {/* Floating Badge */}
            <div className="absolute top-6 right-6 px-4 py-2 bg-white/95 dark:bg-black/95 backdrop-blur-sm rounded-full shadow-lg border border-black/10 dark:border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold">{t('listing.status')}: {t('listing.approved')}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-black text-center shadow-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalBids}</div>
              <div className="text-xs text-black/60 dark:text-white/60 mt-1">{t('listing.bidsCount')}</div>
            </div>
            <div className="rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-black text-center shadow-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatMoney(listing.starting_price_cents, listing.currency)}
              </div>
              <div className="text-xs text-black/60 dark:text-white/60 mt-1">{t('listing.startingPrice')}</div>
            </div>
            <div className="rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-black text-center shadow-lg">
              <div className="flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-xs text-black/60 dark:text-white/60 mt-1">Hot Deal</div>
            </div>
          </div>

          {listing.images && listing.images.length > 1 ? (
            <div className="grid grid-cols-5 gap-3">
              {listing.images.slice(0, 10).map((url) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => setActiveImage(url)}
                  className={`aspect-square overflow-hidden rounded-2xl border shadow-sm transition ${url === activeImage
                    ? "border-purple-500"
                    : "border-black/10 dark:border-white/10 hover:border-purple-300"
                    }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {/* Product Info & Bid Form */}
        <div className="space-y-6">
          {/* Title & Price */}
          <div className="rounded-3xl border border-black/10 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black p-8 dark:border-white/10 shadow-xl">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {listing.name}
            </h1>

            {listing.description && (
              <p className="text-black/70 dark:text-white/70 leading-relaxed mb-6 border-l-4 border-purple-600 pl-4">
                {listing.description}
              </p>
            )}

            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-black/60 dark:text-white/60">{t('listing.currentPrice')}</span>
                {totalBids > 0 && (
                  <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full dark:bg-red-900/30 dark:text-red-400">
                    +{totalBids} {t('listing.bidsCount')}
                  </span>
                )}
              </div>
              <div className="text-4xl md:text-5xl font-bold text-purple-600 dark:text-purple-400">
                {formatMoney(listing.current_price_cents, listing.currency)}
              </div>
            </div>

            {listing.seller_name && (
              <div className="mt-6 pt-6 border-t border-black/10 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                    {listing.seller_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs text-black/50 dark:text-white/50">{t('listing.seller')}</div>
                    <div className="font-semibold">{listing.seller_name}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bid Form */}
          <div className="rounded-3xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-8 dark:border-purple-800 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold">{t('listing.placeBid')}</h3>
                <p className="text-sm text-black/60 dark:text-white/60">
                  قدم عرضك وكن الفائز بهذا المنتج
                </p>
              </div>
            </div>

            <BidForm
              slug={listing.slug}
              currency={listing.currency}
              minAmountCents={minAmountCents}
            />

            <div className="mt-4 p-4 bg-white/50 dark:bg-black/30 rounded-2xl border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-black/70 dark:text-white/70">
                  الحد الأدنى للعرض: <span className="font-bold text-purple-600 dark:text-purple-400">
                    {formatMoney(minAmountCents, listing.currency)}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Buy Now Section */}
          {listing.buy_now_price_cents && (
            <div className="rounded-3xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-8 dark:border-green-800 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold">اشتري الآن</h3>
                  <p className="text-sm text-black/60 dark:text-white/60">
                    احصل على المنتج فوراً بسعر ثابت
                  </p>
                </div>
              </div>

              <div className="text-center mb-6">
                <div className="text-sm text-black/60 dark:text-white/60">السعر الفوري</div>
                <div className="text-4xl font-bold text-green-600 dark:text-green-400 mt-1">
                  {formatMoney(listing.buy_now_price_cents, listing.currency)}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowBuyNowModal(true)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg shadow-lg hover:opacity-90 transition-all hover:scale-[1.02]"
              >
                🛒 اشتري الآن
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bids History */}
      <div className="rounded-3xl border border-black/10 bg-white dark:border-white/10 dark:bg-black p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">{t('listing.bidsCount')} ({totalBids})</h2>
          </div>
          {totalBids > 0 && (
            <div className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full flex items-center gap-2">
              <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                نشط الآن
              </span>
            </div>
          )}
        </div>

        {totalBids === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">{t('listing.noBids')}</h3>
            <p className="text-black/60 dark:text-white/60 mb-6">
              {t('listing.beFirstBidder')}
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold shadow-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              كن الأول
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {(listing.bids ?? []).map((bid, index) => (
              <div
                key={bid.id}
                className={`flex items-center justify-between p-5 rounded-2xl border transition-all hover:shadow-md ${index === 0
                  ? 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-200 dark:border-yellow-800 shadow-md'
                  : 'bg-gray-50 dark:bg-gray-900 border-black/10 dark:border-white/10'
                  }`}
              >
                <div className="flex items-center gap-4">
                  {index === 0 && (
                    <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  )}
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                    {bid.bidder_email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-black dark:text-white">
                      {bid.bidder_email}
                    </div>
                    <div className="text-xs text-black/50 dark:text-white/50">
                      {new Date(bid.created_at).toLocaleDateString('ar-MA', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-2xl font-bold ${index === 0
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : 'text-purple-600 dark:text-purple-400'
                    }`}>
                    {formatMoney(bid.amount_cents, listing.currency)}
                  </div>
                  {index === 0 && (
                    <div className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold mt-1">
                      أعلى عرض
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related or CTA */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 p-8 md:p-12 text-white text-center shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          اكتشف المزيد من المزادات
        </h2>
        <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
          تصفح آلاف المنتجات وقدم عروضك الآن
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-full font-bold hover:bg-gray-100 transition-all hover:scale-105 shadow-xl"
        >
          {t('listing.viewDetails')} المزيد
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>

      {/* Buy Now Confirmation Modal */}
      {showBuyNowModal && listing && (
        <ConfirmPurchaseModal
          listing={listing}
          onClose={() => setShowBuyNowModal(false)}
        />
      )}
    </div>
  );
}
