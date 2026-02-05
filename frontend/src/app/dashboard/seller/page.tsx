"use client";

import { useState, useEffect } from "react";
import { createListing } from "@/lib/api";
import { formatMoney } from "@/lib/money";
import type { Listing } from "@/lib/types";
import Link from "next/link";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export default function SellerDashboard() {
  const [sellerEmail, setSellerEmail] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // نموذج إضافة منتج سريع
  const [quickProduct, setQuickProduct] = useState({
    name: "",
    price: "",
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadSellerData();
  }, []);

  async function loadSellerData() {
    setIsLoading(true);
    setError(null);

    try {
      // جلب بيانات البائع من localStorage
      const email = localStorage.getItem("seller_email") || "";
      const name = localStorage.getItem("seller_name") || "";
      setSellerEmail(email);
      setSellerName(name);

      // محاكاة منتجات البائع (في التطبيق الحقيقي ستأتي من API)
      const mockListings: Listing[] = [
        {
          id: 1,
          name: "لابتوب Dell XPS 13",
          slug: "dell-xps-13",
          description: "لابتوب مستعمل بحالة ممتازة",
          starting_price_cents: 80000,
          current_price_cents: 85000,
          currency: "USD",
          image_url: null,
          status: "approved",
          approved_at: "2024-01-15T10:00:00Z",
          created_at: "2024-01-14T10:00:00Z",
          seller_email: email,
          seller_name: name,
          bids_count: 3
        },
        {
          id: 2,
          name: "iPhone 14 Pro",
          slug: "iphone-14-pro",
          description: "هاتف جديد بالكرتونة",
          starting_price_cents: 120000,
          current_price_cents: 120000,
          currency: "USD",
          image_url: null,
          status: "pending",
          approved_at: null,
          created_at: "2024-01-16T10:00:00Z",
          seller_email: email,
          seller_name: name,
          bids_count: 0
        }
      ];

      setMyListings(email ? mockListings : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل في تحميل البيانات");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleQuickSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!sellerEmail) {
      setError("يرجى إدخال بريدك الإلكتروني أولاً");
      return;
    }

    const parsed = Number.parseFloat(quickProduct.price);
    const cents = Number.isFinite(parsed) ? Math.round(parsed * 100) : 0;

    if (quickProduct.name.trim().length < 3) {
      setError("اسم المنتج قصير جداً");
      return;
    }

    if (cents < 1) {
      setError("يرجى إدخال سعر البداية");
      return;
    }

    setIsSubmitting(true);

    try {
      await createListing({
        name: quickProduct.name,
        description: quickProduct.description || undefined,
        starting_price_cents: cents,
        currency: "USD",
        seller_name: sellerName || undefined,
        seller_email: sellerEmail,
      });

      setQuickProduct({ name: "", price: "", description: "" });
      setSuccess("تم إرسال المنتج للمراجعة بنجاح!");
      setTimeout(() => setSuccess(null), 3000);
      await loadSellerData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل في إرسال المنتج");
    } finally {
      setIsSubmitting(false);
    }
  }

  const stats = {
    totalListings: myListings.length,
    approved: myListings.filter(l => l.status === "approved").length,
    pending: myListings.filter(l => l.status === "pending").length,
    rejected: myListings.filter(l => l.status === "rejected").length,
    totalBids: myListings.reduce((sum, l) => sum + (l.bids_count || 0), 0),
    totalValue: myListings.reduce((sum, l) => sum + l.current_price_cents, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar userType="seller" />
      
      <div className="flex-1 mr-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">لوحة تحكم البائع</h1>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
              {success}
            </div>
          )}

          {/* معلومات البائع */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">معلومات البائع</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">الاسم</label>
                <input
                  type="text"
                  value={sellerName}
                  onChange={(e) => {
                    setSellerName(e.target.value);
                    localStorage.setItem("seller_name", e.target.value);
                  }}
                  placeholder="أدخل اسمك"
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={sellerEmail}
                  onChange={(e) => {
                    setSellerEmail(e.target.value);
                    localStorage.setItem("seller_email", e.target.value);
                  }}
                  placeholder="أدخل بريدك الإلكتروني"
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* الإحصائيات */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">منتجاتي</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalListings}</p>
                  <p className="text-xs text-gray-500">
                    {stats.approved} معتمد، {stats.pending} في الانتظار
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3" />
                  </svg>
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">إجمالي العروض</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBids}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">القيمة الإجمالية</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatMoney(stats.totalValue, "USD")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* إضافة منتج سريع */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold">إضافة منتج سريع</h2>
              </div>
              <div className="p-6">
                <form onSubmit={handleQuickSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">اسم المنتج</label>
                    <input
                      type="text"
                      value={quickProduct.name}
                      onChange={(e) => setQuickProduct({...quickProduct, name: e.target.value})}
                      className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">سعر البداية (USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={quickProduct.price}
                      onChange={(e) => setQuickProduct({...quickProduct, price: e.target.value})}
                      className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">الوصف (اختياري)</label>
                    <textarea
                      value={quickProduct.description}
                      onChange={(e) => setQuickProduct({...quickProduct, description: e.target.value})}
                      rows={3}
                      className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSubmitting ? "جاري الإرسال..." : "إضافة منتج"}
                  </button>
                </form>
                
                <div className="mt-4 pt-4 border-t">
                  <Link
                    href="/sell"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    أو استخدم النموذج المفصل →
                  </Link>
                </div>
              </div>
            </div>

            {/* منتجاتي */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold">منتجاتي</h2>
              </div>
              <div className="p-6">
                {isLoading ? (
                  <p className="text-center text-gray-600">جاري التحميل...</p>
                ) : myListings.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">لم تضف أي منتجات بعد</p>
                    <Link
                      href="/sell"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      إضافة منتج
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {myListings.map((listing) => (
                      <div key={listing.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-semibold">{listing.name}</h3>
                          <p className="text-sm text-gray-600">
                            {formatMoney(listing.current_price_cents, listing.currency)} - {listing.bids_count} عرض
                          </p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                            listing.status === 'approved' ? 'bg-green-100 text-green-800' :
                            listing.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {listing.status === 'approved' ? 'معتمد' :
                             listing.status === 'pending' ? 'في الانتظار' : 'مرفوض'}
                          </span>
                        </div>
                        {listing.status === 'approved' && (
                          <Link
                            href={`/listing/${listing.slug}`}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                          >
                            عرض
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}