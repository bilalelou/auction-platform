# 🌍 نظام تعدد اللغات (i18n)

## نظرة عامة

تم إضافة نظام كامل لتعدد اللغات يدعم **3 لغات**:
- 🇸🇦 **العربية** (ar) - RTL
- 🇬🇧 **الإنجليزية** (en) - LTR  
- 🇫🇷 **الفرنسية** (fr) - LTR

## 📁 الهيكل

```
frontend/src/
├── lib/
│   └── i18n/
│       ├── config.ts                  # إعدادات اللغات
│       ├── LanguageContext.tsx        # Context & Hooks
│       └── locales/
│           ├── ar.json               # الترجمة العربية
│           ├── en.json               # الترجمة الإنجليزية
│           └── fr.json               # الترجمة الفرنسية
└── components/
    └── LanguageSwitcher.tsx          # مكون تبديل اللغة
```

## ✨ المميزات

### 1. **تبديل اللغة السلس**
- تغيير فوري للغة بدون إعادة تحميل الصفحة
- حفظ اللغة المفضلة في `localStorage`
- دعم RTL/LTR تلقائي

### 2. **Context API بسيط**
```tsx
import { useTranslation } from '@/lib/i18n/LanguageContext';

function MyComponent() {
  const { t, locale } = useTranslation();
  
  return <h1>{t('common.welcome')}</h1>;
}
```

### 3. **دعم المتغيرات**
```tsx
const { t } = useTranslation();

// مع متغيرات
t('errors.minLength', { min: '8' }); 
// النتيجة: "يجب أن يكون الطول 8 أحرف على الأقل"
```

### 4. **مكون تبديل اللغة**
```tsx
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

<LanguageSwitcher />
```

## 🚀 كيفية الاستخدام

### في Component عادي

```tsx
"use client";

import { useTranslation } from '@/lib/i18n/LanguageContext';

export function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('common.appName')}</h1>
      <p>{t('auth.loginTitle')}</p>
      <button>{t('common.submit')}</button>
    </div>
  );
}
```

### الوصول للغة الحالية

```tsx
import { useLanguage } from '@/lib/i18n/LanguageContext';

export function MyComponent() {
  const { locale, setLocale, t, dir } = useLanguage();
  
  return (
    <div>
      <p>اللغة الحالية: {locale}</p>
      <p>الاتجاه: {dir}</p>
      <button onClick={() => setLocale('en')}>English</button>
    </div>
  );
}
```

## 📝 إضافة ترجمات جديدة

### 1. تحديث ملفات JSON

في `src/lib/i18n/locales/ar.json`:
```json
{
  "myFeature": {
    "title": "العنوان",
    "description": "الوصف"
  }
}
```

في `src/lib/i18n/locales/en.json`:
```json
{
  "myFeature": {
    "title": "Title",
    "description": "Description"
  }
}
```

في `src/lib/i18n/locales/fr.json`:
```json
{
  "myFeature": {
    "title": "Titre",
    "description": "Description"
  }
}
```

### 2. استخدامها في الكود

```tsx
const { t } = useTranslation();

<h1>{t('myFeature.title')}</h1>
<p>{t('myFeature.description')}</p>
```

## 🎨 الصفحات المُحدّثة

✅ تم تحديث الصفحات التالية لدعم تعدد اللغات:

- **Header** - القائمة الرئيسية + مفتاح تبديل اللغة
- **Admin Email Templates** - صفحة إدارة البريد الإلكتروني

### الصفحات المتبقية (يمكن تحديثها بنفس الطريقة):

- Home page (`src/app/page.tsx`)
- Sell page (`src/app/sell/page.tsx`)
- Admin page (`src/app/admin/page.tsx`)
- Login/Register pages

## 🔧 الإعدادات المتقدمة

### تغيير اللغة الافتراضية

في `src/lib/i18n/LanguageContext.tsx`:
```tsx
const [locale, setLocaleState] = useState<Locale>('en'); // غيّر 'ar' إلى 'en'
```

### إضافة لغة جديدة

1. أضف ملف JSON جديد في `locales/` (مثلاً `es.json`)
2. حدّث `config.ts`:
```tsx
export type Locale = 'ar' | 'en' | 'fr' | 'es';

export const localeNames: Record<Locale, string> = {
  ar: 'العربية',
  en: 'English',
  fr: 'Français',
  es: 'Español',
};

export const translations = {
  ar,
  en,
  fr,
  es,
};
```

## 📋 مفاتيح الترجمة المتاحة

### Common
- `common.appName` - اسم التطبيق
- `common.welcome` - مرحباً
- `common.loading` - جاري التحميل
- `common.save` - حفظ
- `common.cancel` - إلغاء
- وغيرها...

### Navigation
- `nav.home` - الرئيسية
- `nav.listings` - المزادات
- `nav.sell` - بيع
- `nav.admin` - لوحة التحكم

### Auth
- `auth.loginTitle` - تسجيل الدخول
- `auth.registerTitle` - إنشاء حساب
- `auth.email` - البريد الإلكتروني
- `auth.password` - كلمة المرور

### Admin
- `admin.title` - لوحة التحكم
- `admin.emailTemplates` - إدارة رسائل البريد
- `admin.approve` - قبول
- `admin.reject` - رفض

### Listing
- `listing.title` - المزادات
- `listing.currentPrice` - السعر الحالي
- `listing.placeBid` - تقديم عرض

### Errors
- `errors.required` - هذا الحقل مطلوب
- `errors.invalidEmail` - البريد الإلكتروني غير صحيح
- `errors.networkError` - خطأ في الاتصال

راجع ملفات JSON الكاملة في `src/lib/i18n/locales/` لجميع المفاتيح المتاحة.

## 🎯 أمثلة عملية

### مثال 1: صفحة تسجيل الدخول

```tsx
"use client";

import { useTranslation } from '@/lib/i18n/LanguageContext';

export default function LoginPage() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('auth.loginTitle')}</h1>
      <form>
        <label>{t('auth.email')}</label>
        <input type="email" placeholder={t('auth.email')} />
        
        <label>{t('auth.password')}</label>
        <input type="password" placeholder={t('auth.password')} />
        
        <button>{t('auth.loginButton')}</button>
      </form>
      <p>{t('auth.noAccount')}</p>
    </div>
  );
}
```

### مثال 2: رسائل الأخطاء

```tsx
const { t } = useTranslation();

if (password.length < 8) {
  setError(t('errors.minLength', { min: '8' }));
}

if (!email.includes('@')) {
  setError(t('errors.invalidEmail'));
}
```

### مثال 3: قائمة منسدلة

```tsx
"use client";

import { useLanguage } from '@/lib/i18n/LanguageContext';

export function StatusSelect() {
  const { t } = useTranslation();
  
  return (
    <select>
      <option value="pending">{t('listing.pending')}</option>
      <option value="approved">{t('listing.approved')}</option>
      <option value="rejected">{t('listing.rejected')}</option>
    </select>
  );
}
```

## 🌐 اتجاه النص (RTL/LTR)

النظام يدير RTL/LTR تلقائياً:
- العربية → RTL
- الإنجليزية والفرنسية → LTR

يتم تطبيق `dir` على `<html>` تلقائياً عند تغيير اللغة.

## 💾 التخزين

- اللغة المختارة تُحفظ في `localStorage` بمفتاح `preferred_locale`
- يتم استرجاعها تلقائياً عند فتح الموقع

## 🔄 التحديث المستقبلي

يمكن توسيع النظام لدعم:
- ✅ ترجمة المحتوى الديناميكي (من Backend)
- ✅ تحديد اللغة حسب المتصفح (`navigator.language`)
- ✅ URL-based locale (`/en/`, `/ar/`, `/fr/`)
- ✅ SEO multi-language

## 🐛 استكشاف الأخطاء

### المشكلة: النصوص لا تتغير
**الحل**: تأكد أن Component يستخدم `"use client"` في الأعلى

### المشكلة: اتجاه النص لا يتغير
**الحل**: تحقق من `document.documentElement.dir` في الـ console

### المشكلة: اللغة لا تُحفظ
**الحل**: تأكد أن localStorage مفعل في المتصفح

## 📚 الموارد

- [React Context API](https://react.dev/reference/react/useContext)
- [i18n Best Practices](https://www.i18next.com/principles/fallback)
- [RTL Styling](https://rtlstyling.com/)

---

✨ **تم تطوير النظام بالكامل وجاهز للاستخدام!**
