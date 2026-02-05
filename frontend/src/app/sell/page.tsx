"use client";

import { createListing, createListingWithImages } from "@/lib/api";
import { RequireAuth } from "@/components/RequireAuth";
import { useState } from "react";

function SellPageContent() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [startingPrice, setStartingPrice] = useState("");
  const [buyNowPrice, setBuyNowPrice] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [sellerEmail, setSellerEmail] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function addImages(files: File[]) {
    const next = [...imageFiles, ...files];
    if (next.length > 20) {
      setImageFiles(next.slice(0, 20));
      setError("يمكنك رفع 20 صورة كحد أقصى.");
      return;
    }
    setImageFiles(next);
  }

  function removeImage(index: number) {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const parsed = Number.parseFloat(startingPrice);
    const cents = Number.isFinite(parsed) ? Math.round(parsed * 100) : 0;

    if (name.trim().length < 3) {
      setError("اسم المنتج قصير جدا");
      return;
    }

    if (!/.+@.+\..+/.test(sellerEmail)) {
      setError("عنوان البريد الإلكتروني غير صحيح");
      return;
    }

    if (cents < 1) {
      setError("يرجى إدخال سعر البداية");
      return;
    }

    setIsSubmitting(true);

    try {
      const buyNowParsed = Number.parseFloat(buyNowPrice);
      const buyNowCents = Number.isFinite(buyNowParsed) && buyNowParsed > 0 ? Math.round(buyNowParsed * 100) : undefined;

      const payload = {
        name,
        description: description || undefined,
        image_url: imageUrl || undefined,
        starting_price_cents: cents,
        buy_now_price_cents: buyNowCents,
        currency: "USD",
        seller_name: sellerName || undefined,
        seller_email: sellerEmail,
      };

      if (imageFiles.length > 0) {
        await createListingWithImages(payload, imageFiles);
      } else {
        await createListing(payload);
      }

      setName("");
      setDescription("");
      setImageUrl("");
      setImageFiles([]);
      setStartingPrice("");
      setBuyNowPrice("");
      setSellerName("");
      setSellerEmail("");

      setSuccess(
        "تم إرسال المنتج للمراجعة. سيظهر في الموقع بعد موافقة المدير.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل في إرسال المنتج");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">بيع منتج (مزاد)</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-black">
          <label className="block text-sm font-medium">اسم المنتج</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/30 dark:border-white/10 dark:focus:ring-white/30"
          />

          <label className="mt-4 block text-sm font-medium">الوصف</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-1 w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/30 dark:border-white/10 dark:focus:ring-white/30"
          />

          <label className="mt-4 block text-sm font-medium">
            رابط الصورة (اختياري)
          </label>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            className="mt-1 w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/30 dark:border-white/10 dark:focus:ring-white/30"
          />

          <label className="mt-4 block text-sm font-medium">
            رفع صور المنتج (اختياري) — حتى 20 صورة
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              if (files.length > 0) addImages(files);
              e.currentTarget.value = "";
            }}
            className="mt-1 w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm outline-none dark:border-white/10"
          />

          {imageFiles.length > 0 ? (
            <div className="mt-3 space-y-2">
              <div className="text-xs text-black/60 dark:text-white/60">
                تم اختيار {imageFiles.length} صورة
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {imageFiles.map((file, idx) => (
                  <div
                    key={`${file.name}-${idx}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-black/10 px-3 py-2 text-sm dark:border-white/10"
                  >
                    <div className="min-w-0 truncate">{file.name}</div>
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="shrink-0 rounded-full border border-black/10 px-3 py-1 text-xs hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
                    >
                      حذف
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium">سعر البداية</label>
              <input
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
                inputMode="decimal"
                placeholder="10.00"
                className="mt-1 w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/30 dark:border-white/10 dark:focus:ring-white/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                سعر اشتري الآن (اختياري)
              </label>
              <input
                value={buyNowPrice}
                onChange={(e) => setBuyNowPrice(e.target.value)}
                inputMode="decimal"
                placeholder="50.00"
                className="mt-1 w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/30 dark:border-white/10 dark:focus:ring-white/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">العملة</label>
              <input
                value="USD"
                readOnly
                className="mt-1 w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm text-black/60 dark:border-white/10 dark:text-white/60"
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">
                اسمك (اختياري)
              </label>
              <input
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/30 dark:border-white/10 dark:focus:ring-white/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                البريد الإلكتروني
              </label>
              <input
                value={sellerEmail}
                onChange={(e) => setSellerEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/30 dark:border-white/10 dark:focus:ring-white/30"
              />
            </div>
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-200">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-800 dark:text-emerald-200">
            {success}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-full bg-black px-5 py-2 text-sm font-medium text-white disabled:opacity-50 hover:bg-black/85 dark:bg-white dark:text-black dark:hover:bg-white/85"
        >
          {isSubmitting ? "..." : "إرسال للمراجعة"}
        </button>
      </form>
    </div>
  );
}

export default function SellPage() {
  return (
    <RequireAuth>
      <SellPageContent />
    </RequireAuth>
  );
}

