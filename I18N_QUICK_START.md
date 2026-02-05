# 🚀 دليل البدء السريع - نظام تعدد اللغات

## ⚡ البدء السريع (5 دقائق)

### 1️⃣ استعرض الصفحة التجريبية

```
http://localhost:3000/i18n-demo
```

هاد الصفحة فيها أمثلة على كل الترجمات المتاحة.

### 2️⃣ استخدم في أي صفحة

```tsx
"use client";

import { useTranslation } from '@/lib/i18n/LanguageContext';

export default function MyPage() {
  const { t } = useTranslation();
  
  return <h1>{t('common.welcome')}</h1>;
}
```

### 3️⃣ أضف مبدل اللغة

```tsx
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

<LanguageSwitcher />
```

## 📦 ما تم إنجازه

✅ **3 لغات كاملة:**
- العربية (RTL)
- الإنجليزية (LTR)
- الفرنسية (LTR)

✅ **أكثر من 60 مفتاح ترجمة** جاهز للاستخدام

✅ **Components محدّثة:**
- Header (مع مبدل اللغة)
- Admin Email Templates Page
- Demo Page

✅ **مميزات:**
- تخزين تلقائي في localStorage
- دعم RTL/LTR
- Context API للوصول السهل
- دعم المتغيرات في النصوص

## 🎯 استخدامات شائعة

### عرض نص بسيط
```tsx
{t('nav.home')}
```

### نص مع متغيرات
```tsx
{t('errors.minLength', { min: '8' })}
```

### الحصول على اللغة الحالية
```tsx
const { locale } = useTranslation();
// locale = 'ar' | 'en' | 'fr'
```

### تغيير اللغة برمجياً
```tsx
const { setLocale } = useLanguage();

<button onClick={() => setLocale('en')}>English</button>
```

## 📝 مفاتيح الترجمة الشائعة

### الأزرار والعمليات
- `common.save` - حفظ
- `common.cancel` - إلغاء
- `common.submit` - إرسال
- `common.delete` - حذف
- `common.edit` - تعديل
- `common.back` - رجوع

### القوائم
- `nav.home` - الرئيسية
- `nav.listings` - المزادات
- `nav.sell` - بيع
- `nav.admin` - لوحة التحكم
- `nav.login` - تسجيل الدخول
- `nav.register` - إنشاء حساب

### النماذج
- `auth.name` - الاسم
- `auth.email` - البريد الإلكتروني
- `auth.password` - كلمة المرور

### الحالات
- `listing.pending` - قيد المراجعة
- `listing.approved` - مقبول
- `listing.rejected` - مرفوض

### رسائل الخطأ
- `errors.required` - هذا الحقل مطلوب
- `errors.invalidEmail` - البريد الإلكتروني غير صحيح
- `errors.networkError` - خطأ في الاتصال

## 🔄 تحديث صفحة موجودة

### قبل:
```tsx
export default function MyPage() {
  return (
    <div>
      <h1>العنوان</h1>
      <button>حفظ</button>
    </div>
  );
}
```

### بعد:
```tsx
"use client";

import { useTranslation } from '@/lib/i18n/LanguageContext';

export default function MyPage() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('common.title')}</h1>
      <button>{t('common.save')}</button>
    </div>
  );
}
```

## ➕ إضافة ترجمة جديدة

### 1. افتح الملفات الثلاثة:
- `src/lib/i18n/locales/ar.json`
- `src/lib/i18n/locales/en.json`
- `src/lib/i18n/locales/fr.json`

### 2. أضف المفتاح في كل ملف:

**ar.json:**
```json
{
  "mySection": {
    "newKey": "النص بالعربية"
  }
}
```

**en.json:**
```json
{
  "mySection": {
    "newKey": "English text"
  }
}
```

**fr.json:**
```json
{
  "mySection": {
    "newKey": "Texte en français"
  }
}
```

### 3. استخدمها:
```tsx
{t('mySection.newKey')}
```

## 🎨 التصميم مع RTL

النظام يطبق RTL تلقائياً للعربية. استخدم Tailwind بشكل عادي:

```tsx
<div className="text-right"> {/* يصبح text-left في RTL */}
```

أو استخدم logical properties:
```tsx
<div className="ms-4"> {/* margin-start - يعمل مع RTL/LTR */}
```

## 🧪 اختبار

### 1. افتح الموقع
```
http://localhost:3000
```

### 2. انقر على مبدل اللغة في الـ Header

### 3. لاحظ:
- تغيير النصوص فوراً ✅
- تغيير الاتجاه (RTL/LTR) ✅
- حفظ اللغة المختارة ✅

## 📚 ملفات مهمة

```
frontend/src/
├── lib/i18n/
│   ├── config.ts              # إعدادات اللغات
│   ├── LanguageContext.tsx    # Context & Hooks
│   ├── index.ts              # Exports
│   └── locales/
│       ├── ar.json           # 🇸🇦
│       ├── en.json           # 🇬🇧
│       └── fr.json           # 🇫🇷
├── components/
│   └── LanguageSwitcher.tsx  # مبدل اللغة
└── app/
    ├── layout.tsx            # Provider
    └── i18n-demo/            # صفحة تجريبية
        └── page.tsx
```

## 💡 نصائح

1. **دائماً استخدم `"use client"`** في Components التي تستخدم `useTranslation()`

2. **استخدم مفاتيح واضحة:**
   ```tsx
   // ✅ جيد
   t('auth.loginButton')
   
   // ❌ سيء
   t('btn1')
   ```

3. **نظّم الترجمات في أقسام:**
   ```json
   {
     "auth": { ... },
     "listing": { ... },
     "admin": { ... }
   }
   ```

4. **استخدم المتغيرات للنصوص الديناميكية:**
   ```tsx
   t('errors.minLength', { min: '8' })
   ```

## 🐛 حل المشاكل

### النصوص لا تظهر؟
- تأكد من `"use client"` في أول السطر
- تحقق من صحة المفتاح في ملفات JSON

### الاتجاه لا يتغير؟
- افتح Console وتحقق من `document.dir`
- أعد تحميل الصفحة

### اللغة لا تُحفظ؟
- تحقق من localStorage في المتصفح
- تأكد من عدم استخدام Incognito Mode

## 📞 الدعم

راجع الملف الكامل: [I18N_SYSTEM_README.md](I18N_SYSTEM_README.md)

---

🎉 **جاهز للاستخدام!** ابدأ بترجمة صفحاتك الآن.
