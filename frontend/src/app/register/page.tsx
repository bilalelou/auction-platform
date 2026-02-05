"use client";

import { registerUser } from "@/lib/authApi";
import { saveSession } from "@/lib/authStorage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (name.trim().length < 2) {
      setError("يرجى إدخال الاسم");
      return;
    }

    if (!/.+@.+\..+/.test(email)) {
      setError("عنوان البريد الإلكتروني غير صحيح");
      return;
    }

    if (password.length < 8) {
      setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return;
    }

    setIsSubmitting(true);

    try {
      const session = await registerUser({ name, email, password });
      saveSession(session);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل في التسجيل");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">تسجيل حساب جديد</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-black">
          <label className="block text-sm font-medium">الاسم</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/30 dark:border-white/10 dark:focus:ring-white/30"
          />

          <label className="mt-4 block text-sm font-medium">البريد الإلكتروني</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1 w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/30 dark:border-white/10 dark:focus:ring-white/30"
          />

          <label className="mt-4 block text-sm font-medium">كلمة المرور</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="mt-1 w-full rounded-xl border border-black/10 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/30 dark:border-white/10 dark:focus:ring-white/30"
          />
          <div className="mt-1 text-xs text-black/60 dark:text-white/60">
            على الأقل 8 حروف.
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-200">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-full bg-black px-5 py-2 text-sm font-medium text-white disabled:opacity-50 hover:bg-black/85 dark:bg-white dark:text-black dark:hover:bg-white/85"
        >
          {isSubmitting ? "..." : "تسجيل"}
        </button>

        <div className="text-center text-sm text-black/60 dark:text-white/60">
          تملك حساباً؟{" "}
          <Link href="/login" className="underline">
            سجل الدخول
          </Link>
        </div>
      </form>
    </div>
  );
}