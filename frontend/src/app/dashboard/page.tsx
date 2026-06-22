"use client";

import Link from "next/link";

export default function DashboardPage() {
  const dashboardOptions = [
    {
      href: "/dashboard/admin",
      title: "لوحة المدير",
      description: "إدارة المنتجات والمستخدمين والإعدادات",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      gradient: "from-red-500 to-red-700",
      bgLight: "bg-red-50",
      iconColor: "text-red-600",
      hoverShadow: "hover:shadow-red-500/20"
    },
    {
      href: "/dashboard/user",
      title: "لوحة المستخدم",
      description: "عرض العروض والمزادات المشارك بها",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      gradient: "from-blue-500 to-blue-700",
      bgLight: "bg-blue-50",
      iconColor: "text-blue-600",
      hoverShadow: "hover:shadow-blue-500/20"
    },
    {
      href: "/dashboard/seller",
      title: "لوحة البائع",
      description: "إدارة المنتجات والمبيعات",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8h1m-1-4h1m4 4h1m-1-4h1" />
        </svg>
      ),
      gradient: "from-green-500 to-green-700",
      bgLight: "bg-green-50",
      iconColor: "text-green-600",
      hoverShadow: "hover:shadow-green-500/20"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/25 mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">اختر لوحة التحكم</h1>
          <p className="text-gray-500 text-lg">حدد نوع الحساب للوصول إلى لوحة التحكم المناسبة</p>
        </div>

        {/* Dashboard Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {dashboardOptions.map((option) => (
            <Link href={option.href} key={option.href} className="group">
              <div className={`bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${option.hoverShadow} border border-gray-100`}>
                <div className="text-center">
                  {/* Icon */}
                  <div className={`w-20 h-20 ${option.bgLight} rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <span className={option.iconColor}>{option.icon}</span>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                    {option.title}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    {option.description}
                  </p>

                  {/* Button */}
                  <div className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${option.gradient} text-white rounded-xl shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:gap-3`}>
                    <span className="font-medium">الدخول</span>
                    <svg className="w-4 h-4 transition-transform duration-300 rotate-180 group-hover:-rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            اختر الدور المناسب لعرض لوحة التحكم الخاصة به
          </p>
        </div>
      </div>
    </div>
  );
}