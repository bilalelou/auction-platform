"use client";

import { useEffect, useState } from "react";
import { fetchListings } from "@/lib/api";
import { formatMoney } from "@/lib/money";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import Link from "next/link";
import type { Listing } from "@/lib/types";

export default function Home() {
  const { t } = useTranslation();
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "price-low" | "price-high" | "bids">("recent");

  useEffect(() => {
    async function loadListings() {
      try {
        const data = await fetchListings();
        setListings(data);
        setFilteredListings(data);
      } catch (error) {
        console.error("Failed to load listings:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadListings();
  }, []);

  // Filter and sort listings
  useEffect(() => {
    let result = [...listings];

    // Search filter
    if (searchQuery) {
      result = result.filter(listing =>
        listing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.current_price_cents - b.current_price_cents;
        case "price-high":
          return b.current_price_cents - a.current_price_cents;
        case "bids":
          return (b.bids_count || 0) - (a.bids_count || 0);
        case "recent":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    setFilteredListings(result);
  }, [listings, searchQuery, sortBy]);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
        <div className="relative z-10 space-y-4 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            {t('common.appName')}
          </h1>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed">
            {t('listing.title')} - منصة المزادات الأولى للبيع والشراء بأفضل الأسعار
          </p>
          <div className="flex flex-wrap gap-3 pt-4">
            <Link
              href="/sell"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-full font-semibold hover:bg-gray-100 transition-all hover:scale-105 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
              </svg>
              {t('nav.sell')}
            </Link>
            <Link
              href="#listings"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md text-white rounded-full font-semibold hover:bg-white/30 transition-all border border-white/40"
            >
              {t('listing.viewDetails')}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
              </svg>
            </Link>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-black/10 bg-gradient-to-br from-white to-gray-50 p-6 dark:border-white/10 dark:from-gray-900 dark:to-black shadow-lg hover:shadow-xl transition-shadow">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {listings.length}
          </div>
          <div className="text-sm text-black/60 dark:text-white/60 mt-1">
            {t('listing.title')} {t('listing.approved')}
          </div>
        </div>
        <div className="rounded-2xl border border-black/10 bg-gradient-to-br from-white to-gray-50 p-6 dark:border-white/10 dark:from-gray-900 dark:to-black shadow-lg hover:shadow-xl transition-shadow">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {listings.reduce((sum, l) => sum + (l.bids_count || 0), 0)}
          </div>
          <div className="text-sm text-black/60 dark:text-white/60 mt-1">
            إجمالي العروض
          </div>
        </div>
        <div className="rounded-2xl border border-black/10 bg-gradient-to-br from-white to-gray-50 p-6 dark:border-white/10 dark:from-gray-900 dark:to-black shadow-lg hover:shadow-xl transition-shadow">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            24/7
          </div>
          <div className="text-sm text-black/60 dark:text-white/60 mt-1">
            خدمة متواصلة
          </div>
        </div>
      </div>

      {/* Listings Section */}
      <div id="listings" className="space-y-6">
        {/* Header with Filter */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {t('listing.title')} {t('listing.approved')}
              </h2>
              <p className="text-sm text-black/60 dark:text-white/60">
                استعرض أفضل المنتجات المعتمدة وقدم عروضك الآن
              </p>
            </div>
            <Link
              href="/sell"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 dark:border-purple-800 dark:bg-purple-900/20 dark:text-purple-300 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t('listing.newListing')}
            </Link>
          </div>

          {/* Search and Sort Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-black/40 dark:text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('common.search') + "..."}
                className="w-full rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-black pl-11 pr-4 py-3 outline-none focus:border-purple-600 dark:focus:border-purple-400 transition-colors"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative min-w-[200px]">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-black px-4 py-3 outline-none focus:border-purple-600 dark:focus:border-purple-400 transition-colors appearance-none cursor-pointer"
              >
                <option value="recent">الأحدث</option>
                <option value="price-low">السعر: الأقل - الأعلى</option>
                <option value="price-high">السعر: الأعلى - الأقل</option>
                <option value="bids">الأكثر عروضاً</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-black/40 dark:text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Results Count */}
          {searchQuery && (
            <div className="text-sm text-black/60 dark:text-white/60">
              عثر على {filteredListings.length} من أصل {listings.length} منتج
            </div>
          )}
        </div>
          {/*
              {t('listing.title')} {t('listing.approved')}
            </h2>
            <p className="text-sm text-black/60 dark:text-white/60">
              استعرض أفضل المنتجات المعتمدة وقدم عروضك الآن
            </p>
          </div>
          <Link
            href="/sell"
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 dark:border-purple-800 dark:bg-purple-900/20 dark:text-purple-300 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t('listing.newListing')}
          </Link>
        </div>

          */}

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
              <p className="text-sm text-black/60 dark:text-white/60">{t('common.loading')}</p>
            </div>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-black/10 p-12 text-center dark:border-white/10 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
            <div className="mx-auto w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {searchQuery ? "لم يتم العثور على نتائج" : "لا توجد مزادات حالياً"}
            </h3>
            <p className="text-sm text-black/60 dark:text-white/60 mb-4">
              {searchQuery ? "جرب استخدام كلمات مختلفة في البحث" : "كن أول من يبدأ بإضافة منتج للمزاد"}
            </p>
            {!searchQuery && (
              <Link
                href="/sell"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg transition-all hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                </svg>
                {t('nav.sell')} الآن
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredListings.map((listing) => (
              <Link
                key={listing.id}
                href={`/listing/${listing.slug}`}
                className="group overflow-hidden rounded-3xl border border-black/10 bg-white shadow-lg hover:shadow-2xl transition-all duration-300 dark:border-white/10 dark:bg-black hover:-translate-y-1"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
                  {(listing.images?.[0] ?? listing.image_url) ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={listing.images?.[0] ?? listing.image_url ?? ""}
                        alt={listing.name}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </>
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                  )}
                  
                  {/* Badge */}
                  {(listing.bids_count || 0) > 0 && (
                    <div className="absolute top-4 right-4 px-3 py-1.5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"/>
                      </svg>
                      Hot
                    </div>
                  )}
                </div>
                
                <div className="p-5 space-y-3">
                  <div className="space-y-2">
                    <h2 className="text-lg font-bold leading-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                      {listing.name}
                    </h2>
                    
                    {listing.description && (
                      <p className="text-xs text-black/60 dark:text-white/60 line-clamp-2">
                        {listing.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-black/10 dark:border-white/10">
                    <div className="space-y-1">
                      <div className="text-xs text-black/50 dark:text-white/50">
                        {t('listing.currentPrice')}
                      </div>
                      <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                        {formatMoney(listing.current_price_cents, listing.currency)}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-black/60 dark:text-white/60">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        <span>{listing.bids_count ?? 0}</span>
                      </div>
                      <div className="text-xs text-black/50 dark:text-white/50 mt-1">
                        {t('listing.bidsCount')}
                      </div>
                    </div>
                  </div>

                  <button className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2">
                    {t('listing.placeBid')}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                    </svg>
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 p-8 md:p-12 text-white text-center shadow-2xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          هل لديك منتج للبيع؟
        </h2>
        <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
          انضم لآلاف البائعين واعرض منتجاتك على أكبر منصة مزادات في المنطقة
        </p>
        <Link
          href="/sell"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-full font-bold hover:bg-gray-100 transition-all hover:scale-105 shadow-xl"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t('nav.sell')} الآن
        </Link>
      </div>
    </div>
  );
}
