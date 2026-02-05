"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { loadSession, clearSession } from "@/lib/authStorage";
import { logoutUser } from "@/lib/authApi";

interface SidebarProps {
  userType: "admin" | "user" | "seller";
}

export function DashboardSidebar({ userType }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const session = loadSession();
      if (session?.token) {
        await logoutUser(session.token);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearSession();
      router.push("/login");
    }
  };

  const adminMenuItems = [
    { href: "/dashboard/admin", label: "الرئيسية", icon: "🏠" },
    { href: "/dashboard/profile", label: "الملف الشخصي", icon: "👤" },
    { href: "/admin", label: "مراجعة المنتجات", icon: "📋" },
    { href: "/admin/email-templates", label: "قوالب البريد", icon: "📧" },
    { href: "/support", label: "الدعم الفني", icon: "🎧" },
    { href: "/dashboard", label: "تغيير الدور", icon: "🔄" }
  ];

  const userMenuItems = [
    { href: "/dashboard/user", label: "الرئيسية", icon: "🏠" },
    { href: "/dashboard/profile", label: "الملف الشخصي", icon: "👤" },
    { href: "/", label: "تصفح المزادات", icon: "🛍️" },
    { href: "/contact", label: "تواصل معنا", icon: "📞" },
    { href: "/dashboard", label: "تغيير الدور", icon: "🔄" }
  ];

  const sellerMenuItems = [
    { href: "/dashboard/seller", label: "الرئيسية", icon: "🏠" },
    { href: "/dashboard/profile", label: "الملف الشخصي", icon: "👤" },
    { href: "/sell", label: "إضافة منتج", icon: "➕" },
    { href: "/", label: "عرض المنتجات", icon: "👁️" },
    { href: "/contact", label: "تواصل معنا", icon: "📞" },
    { href: "/dashboard", label: "تغيير الدور", icon: "🔄" }
  ];

  const menuItems =
    userType === "admin" ? adminMenuItems :
      userType === "seller" ? sellerMenuItems :
        userMenuItems;

  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed right-0 top-0 z-40">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">
          {userType === "admin" ? "لوحة المدير" :
            userType === "seller" ? "لوحة البائع" :
              "لوحة المستخدم"}
        </h2>
      </div>

      <nav className="mt-6">
        <ul className="space-y-2 px-4">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === item.href
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-6 left-4 right-4 space-y-3">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-lg">🚪</span>
          <span>{isLoggingOut ? "جاري الخروج..." : "تسجيل الخروج"}</span>
        </button>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            نظام إدارة المزادات
          </p>
        </div>
      </div>
    </div>
  );
}