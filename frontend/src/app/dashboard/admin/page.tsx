"use client";

import { useState, useEffect } from "react";
import { adminFetchListings, adminApproveListing, adminRejectListing } from "@/lib/api";
import { formatMoney } from "@/lib/money";
import type { Listing } from "@/lib/types";
import Link from "next/link";
import { DashboardSidebar } from "@/components/DashboardSidebar";

const tokenKey = "admin_token_v1";

export default function AdminDashboard() {
  const [adminToken, setAdminToken] = useState("");
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  });
  const [recentListings, setRecentListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(tokenKey);
    if (stored) setAdminToken(stored);
  }, []);

  useEffect(() => {
    if (adminToken.trim().length > 0) {
      loadDashboardData();
    }
  }, [adminToken]);

  async function loadDashboardData() {
    setIsLoading(true);
    setError(null);

    try {
      const [pending, approved, rejected] = await Promise.all([
        adminFetchListings("pending", adminToken.trim()),
        adminFetchListings("approved", adminToken.trim()),
        adminFetchListings("rejected", adminToken.trim())
      ]);

      setStats({
        pending: pending.length,
        approved: approved.length,
        rejected: rejected.length,
        total: pending.length + approved.length + rejected.length
      });

      setRecentListings(pending.slice(0, 5));
      window.localStorage.setItem(tokenKey, adminToken.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل في تحميل البيانات");
    } finally {
      setIsLoading(false);
    }
  }

  async function quickApprove(id: number) {
    try {
      await adminApproveListing(id, adminToken.trim());
      await loadDashboardData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل في الموافقة");
    }
  }

  async function quickReject(id: number) {
    const reason = window.prompt("سبب الرفض؟ (اختياري)") ?? "";
    try {
      await adminRejectListing(id, reason, adminToken.trim());
      await loadDashboardData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل في الرفض");
    }
  }

  if (!adminToken.trim()) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4">لوحة تحكم المدير</h1>
          <p className="text-gray-600 mb-4">الرجاء إدخال رمز المدير للمتابعة</p>
          <input
            type="text"
            value={adminToken}
            onChange={(e) => setAdminToken(e.target.value)}
            placeholder="أدخل رمز المدير"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar userType="admin" />
      
      <div className="flex-1 mr-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">لوحة تحكم المدير</h1>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* الإحصائيات */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">في الانتظار</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">معتمد</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">مرفوض</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">المجموع</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>
          </div>

          {/* المنتجات الحديثة في الانتظار */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">المنتجات في الانتظار</h2>
            </div>
            <div className="p-6">
              {isLoading ? (
                <p className="text-center text-gray-600">جاري التحميل...</p>
              ) : recentListings.length === 0 ? (
                <p className="text-center text-gray-600">لا توجد منتجات في الانتظار</p>
              ) : (
                <div className="space-y-4">
                  {recentListings.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-600">
                          {formatMoney(item.starting_price_cents, item.currency)} - {item.seller_email}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => quickApprove(item.id)}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                        >
                          قبول
                        </button>
                        <button
                          onClick={() => quickReject(item.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                        >
                          رفض
                        </button>
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