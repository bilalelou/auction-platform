"use client";

import {
  adminApproveListing,
  adminFetchListings,
  adminRejectListing,
} from "@/lib/api";
import { formatMoney } from "@/lib/money";
import type { Listing } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";

const tokenKey = "admin_token_v1";

export default function AdminPage() {
  const [adminToken, setAdminToken] = useState("");
  const [status, setStatus] = useState<"pending" | "approved" | "rejected">(
    "pending",
  );
  const [items, setItems] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canLoad = useMemo(() => adminToken.trim().length > 0, [adminToken]);

  useEffect(() => {
    const stored = window.localStorage.getItem(tokenKey);
    if (stored) setAdminToken(stored);
  }, []);

  async function load() {
    if (!canLoad) return;
    setError(null);
    setIsLoading(true);

    try {
      const data = await adminFetchListings(status, adminToken.trim());
      setItems(data);
      window.localStorage.setItem(tokenKey, adminToken.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setIsLoading(false);
    }
  }

  async function approve(id: number) {
    setError(null);
    try {
      await adminApproveListing(id, adminToken.trim());
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Approve failed");
    }
  }

  async function reject(id: number) {
    const reason = window.prompt("سبب الرفض؟ (اختياري)") ?? "";
    setError(null);
    try {
      await adminRejectListing(id, reason, adminToken.trim());
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reject failed");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">مراجعة المدير</h1>
        <a
          href="/admin/email-templates"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
        >
          إدارة رسائل البريد الإلكتروني
        </a>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-black">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium">رمز المدير</label>
            <input
              value={adminToken}
              onChange={(e) => setAdminToken(e.target.value)}
              placeholder="change-me"
              className="mt-1 w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/30 dark:border-white/10 dark:focus:ring-white/30"
            />
            <div className="mt-1 text-xs text-black/60 dark:text-white/60">
              نفس القيمة في `ADMIN_TOKEN` في `backend/.env`.
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">الحالة</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
              className="mt-1 w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm outline-none dark:border-white/10"
            >
              <option value="pending">في الانتظار</option>
              <option value="approved">معتمد</option>
              <option value="rejected">مرفوض</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={load}
            disabled={!canLoad || isLoading}
            className="inline-flex items-center justify-center rounded-full bg-black px-5 py-2 text-sm font-medium text-white disabled:opacity-50 hover:bg-black/85 dark:bg-white dark:text-black dark:hover:bg-white/85"
          >
            {isLoading ? "..." : "تحميل"}
          </button>

          {error ? (
            <div className="text-sm text-red-700 dark:text-red-200">{error}</div>
          ) : null}
        </div>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-black/10 p-6 text-sm dark:border-white/10">
            لا توجد منتجات.
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-black"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{item.name}</div>
                    <div className="mt-1 text-sm text-black/60 dark:text-white/60">
                      {formatMoney(item.starting_price_cents, item.currency)} — {item.status}
                    </div>
                    <div className="mt-1 text-xs text-black/60 dark:text-white/60">
                      البائع: {item.seller_email}
                    </div>
                    {item.rejection_reason ? (
                      <div className="mt-1 text-xs text-red-700 dark:text-red-200">
                        سبب الرفض: {item.rejection_reason}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => approve(item.id)}
                      className="rounded-full border border-black/10 px-4 py-2 text-sm hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
                    >
                      قبول
                    </button>
                    <button
                      type="button"
                      onClick={() => reject(item.id)}
                      className="rounded-full border border-black/10 px-4 py-2 text-sm hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
                    >
                      رفض
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}