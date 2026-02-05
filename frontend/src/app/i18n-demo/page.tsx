"use client";

import { useTranslation, useLanguage } from '@/lib/i18n';
import { localeNames } from '@/lib/i18n/config';

export default function I18nDemoPage() {
  const { t, locale } = useTranslation();
  const { setLocale, dir } = useLanguage();

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-black">
        <h1 className="text-3xl font-bold mb-4">{t('common.appName')}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          نظام تعدد اللغات - Demo Page
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Language Info */}
        <div className="rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-black">
          <h2 className="text-xl font-semibold mb-4">معلومات اللغة</h2>
          <div className="space-y-2 text-sm">
            <p><strong>اللغة الحالية:</strong> {localeNames[locale]} ({locale})</p>
            <p><strong>الاتجاه:</strong> {dir === 'rtl' ? 'من اليمين لليسار' : 'من اليسار لليمين'}</p>
          </div>
        </div>

        {/* Common Translations */}
        <div className="rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-black">
          <h2 className="text-xl font-semibold mb-4">{t('common.language')}</h2>
          <div className="space-y-2">
            <button
              onClick={() => setLocale('ar')}
              className={`w-full px-4 py-2 rounded-lg text-left ${
                locale === 'ar' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800'
              }`}
            >
              العربية
            </button>
            <button
              onClick={() => setLocale('en')}
              className={`w-full px-4 py-2 rounded-lg text-left ${
                locale === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLocale('fr')}
              className={`w-full px-4 py-2 rounded-lg text-left ${
                locale === 'fr' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800'
              }`}
            >
              Français
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-black">
          <h2 className="text-xl font-semibold mb-4">Navigation</h2>
          <ul className="space-y-2 text-sm">
            <li>• {t('nav.home')}</li>
            <li>• {t('nav.listings')}</li>
            <li>• {t('nav.sell')}</li>
            <li>• {t('nav.admin')}</li>
            <li>• {t('nav.login')}</li>
            <li>• {t('nav.register')}</li>
          </ul>
        </div>

        {/* Auth */}
        <div className="rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-black">
          <h2 className="text-xl font-semibold mb-4">Auth</h2>
          <ul className="space-y-2 text-sm">
            <li>• {t('auth.loginTitle')}</li>
            <li>• {t('auth.registerTitle')}</li>
            <li>• {t('auth.name')}</li>
            <li>• {t('auth.email')}</li>
            <li>• {t('auth.password')}</li>
          </ul>
        </div>

        {/* Listing */}
        <div className="rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-black">
          <h2 className="text-xl font-semibold mb-4">Listing</h2>
          <ul className="space-y-2 text-sm">
            <li>• {t('listing.title')}</li>
            <li>• {t('listing.currentPrice')}</li>
            <li>• {t('listing.placeBid')}</li>
            <li>• {t('listing.status')}: {t('listing.pending')}</li>
            <li>• {t('listing.status')}: {t('listing.approved')}</li>
            <li>• {t('listing.status')}: {t('listing.rejected')}</li>
          </ul>
        </div>

        {/* Admin */}
        <div className="rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-black">
          <h2 className="text-xl font-semibold mb-4">Admin</h2>
          <ul className="space-y-2 text-sm">
            <li>• {t('admin.title')}</li>
            <li>• {t('admin.emailTemplates')}</li>
            <li>• {t('admin.approve')}</li>
            <li>• {t('admin.reject')}</li>
            <li>• {t('admin.active')}</li>
            <li>• {t('admin.inactive')}</li>
          </ul>
        </div>
      </div>

      {/* Buttons */}
      <div className="rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-black">
        <h2 className="text-xl font-semibold mb-4">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            {t('common.save')}
          </button>
          <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
            {t('common.cancel')}
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg">
            {t('common.submit')}
          </button>
          <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
            {t('common.back')}
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg">
            {t('common.delete')}
          </button>
        </div>
      </div>

      {/* Variable Replacement Example */}
      <div className="rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-black">
        <h2 className="text-xl font-semibold mb-4">Variable Replacement Example</h2>
        <div className="space-y-2 text-sm">
          <p className="text-red-600">
            {t('errors.minLength', { min: '8' })}
          </p>
          <p className="text-red-600">
            {t('errors.maxLength', { max: '100' })}
          </p>
        </div>
      </div>
    </div>
  );
}
