"use client";

import { useState, useEffect } from "react";
import { fetchListings } from "@/lib/api";
import { formatMoney } from "@/lib/money";
import type { Listing } from "@/lib/types";
import Link from "next/link";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export default function UserDashboard() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [userEmail, setUserEmail] = useState("");
  const [userBids, setUserBids] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  async function loadUserData() {
    setIsLoading(true);
    setError(null);

    try {
      const allListings = await fetchListings();
      setListings(allListings);

      const email = localStorage.getItem("user_email") || "";
      setUserEmail(email);

      const mockBids = allListings
        .filter(listing => listing.bids && listing.bids.some(bid => bid.bidder_email === email))
        .map(listing => ({
          listing,
          userBid: listing.bids?.find(bid => bid.bidder_email === email),
          isWinning: listing.bids && listing.bids.length > 0 && 
                    listing.bids[listing.bids.length - 1].bidder_email === email
        }));
      
      setUserBids(mockBids);
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل في تحميل البيانات");
    } finally {
      setIsLoading(false);
    }
  }

  const stats = {
    totalListings: listings.length,
    userBids: userBids.length,
    winningBids: userBids.filter(bid => bid.isWinning).length,
    totalSpent: userBids.reduce((sum, bid) => sum + (bid.userBid?.amount_cents || 0), 0)
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar userType="user" />
      
      <div className="flex-1 mr-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">لوحة تحكم المستخدم</h1>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* معلومات المستخدم */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">معلومات الحساب</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => {
                    setUserEmail(e.target.value);
                    localStorage.setItem("user_email", e.target.value);
                  }}
                  placeholder="أدخل بريدك الإلكتروني"
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* الإحصائيات */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">المنتجات المتاحة</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalListings}</p>
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
                  <p className="text-sm font-medium text-gray-600">عروضي</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.userBids}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">العروض الرابحة</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.winningBids}</p>
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
                  <p className="text-sm font-medium text-gray-600">إجمالي العروض</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatMoney(stats.totalSpent, "USD")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* عروضي الحالية */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">عروضي الحالية</h2>
            </div>
            <div className="p-6">
              {isLoading ? (
                <p className="text-center text-gray-600">جاري التحميل...</p>
              ) : userBids.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">لم تقدم أي عروض بعد</p>
                  <Link
                    href="/"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    تصفح المنتجات
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {userBids.map((bidInfo, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{bidInfo.listing.name}</h3>
                        <p className="text-sm text-gray-600">
                          عرضك: {formatMoney(bidInfo.userBid.amount_cents, bidInfo.listing.currency)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        {bidInfo.isWinning ? (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            العرض الأعلى
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                            تم تجاوزه
                          </span>
                        )}
                        <Link
                          href={`/listing/${bidInfo.listing.slug}`}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                        >
                          عرض
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}