

<!-- BEGIN DASHBOARD_SYSTEM_README.md -->

# نظام لوحات التحكم المتعددة

تم إنشاء 3 لوحات تحكم منفصلة لأنواع المستخدمين المختلفة:

## 1. لوحة تحكم المدير (`/dashboard/admin`)

### الميزات:
- **الإحصائيات**: عرض أعداد المنتجات (في الانتظار، معتمد، مرفوض، المجموع)
- **المراجعة السريعة**: عرض المنتجات في الانتظار مع إمكانية القبول/الرفض السريع
- **الإجراءات السريعة**: 
  - رابط لصفحة مراجعة المنتجات الكاملة
  - رابط لإدارة قوالب البريد الإلكتروني
  - إعدادات النظام
- **الأمان**: يتطلب رمز المدير للوصول

### الاستخدام:
```
http://localhost:3000/dashboard/admin
```

## 2. لوحة تحكم المستخدم العادي (`/dashboard/user`)

### الميزات:
- **الإحصائيات الشخصية**: 
  - عدد المنتجات المتاحة
  - عدد العروض المقدمة
  - العروض الرابحة
  - إجمالي المبلغ المعروض
- **إدارة الحساب**: تحديث البريد الإلكتروني
- **عروضي الحالية**: عرض جميع العروض مع حالة كل عرض (رابح/مُتجاوز)
- **الإجراءات السريعة**: تصفح المزادات، المفضلة، الإشعارات

### الاستخدام:
```
http://localhost:3000/dashboard/user
```

## 3. لوحة تحكم البائع (`/dashboard/seller`)

### الميزات:
- **إحصائيات المبيعات**:
  - عدد المنتجات (معتمد/في الانتظار)
  - إجمالي العروض المستلمة
  - القيمة الإجمالية للمنتجات
- **إضافة منتج سريع**: نموذج مبسط لإضافة منتج جديد
- **إدارة المنتجات**: عرض جميع منتجات البائع مع حالة كل منتج
- **معلومات البائع**: تحديث الاسم والبريد الإلكتروني

### الاستخدام:
```
http://localhost:3000/dashboard/seller
```

## الصفحة الرئيسية للوحات التحكم (`/dashboard`)

صفحة اختيار تعرض الخيارات الثلاثة:
- لوحة المدير (أحمر) - للإدارة والمراجعة
- لوحة المستخدم (أزرق) - للمزايدة والمتابعة  
- لوحة البائع (أخضر) - لإدارة المنتجات والمبيعات

## التحديثات على الملفات الموجودة:

### Header.tsx
- تم تغيير رابط "إدارة" إلى "لوحة التحكم" يوجه إلى `/dashboard`

## الملفات الجديدة:

```
frontend/src/app/dashboard/
├── page.tsx                 # الصفحة الرئيسية لاختيار نوع لوحة التحكم
├── admin/
│   └── page.tsx            # لوحة تحكم المدير
├── user/
│   └── page.tsx            # لوحة تحكم المستخدم العادي
└── seller/
    └── page.tsx            # لوحة تحكم البائع
```

## المميزات:

1. **تصميم موحد**: جميع اللوحات تستخدم نفس التصميم والألوان
2. **إحصائيات تفاعلية**: كل لوحة تعرض إحصائيات مناسبة للمستخدم
3. **إجراءات سريعة**: أزرار وروابط للمهام الشائعة
4. **تجربة مستخدم محسنة**: تنقل سهل بين اللوحات
5. **عربية فصحى**: جميع النصوص باللغة العربية الفصحى

## ملاحظات:

- البيانات حالياً محاكاة (mock data) - في التطبيق الحقيقي ستأتي من API
- يمكن إضافة المزيد من الميزات لكل لوحة حسب الحاجة
- التصميم responsive ويعمل على جميع الأجهزة

<!-- END DASHBOARD_SYSTEM_README.md -->



<!-- BEGIN DESIGN_UPDATE_README.md -->

# 🎨 تحديثات التصميم الراقي

## نظرة عامة

تم تحديث صفحات المزادات بتصميم راقي وأنيق مع دعم كامل للترجمة متعددة اللغات.

---

## 📄 الصفحات المُحدّثة

### 1️⃣ **الصفحة الرئيسية** (`/`)

#### ✨ المميزات الجديدة:

**🎯 Hero Section**
- تصميم gradient جذاب (أزرق → بنفسجي → وردي)
- عناصر decorative متحركة
- أزرار CTA واضحة مع أيقونات
- نص ترحيبي مترجم

**📊 قسم الإحصائيات**
- 3 بطاقات للإحصائيات الرئيسية
- عرض عدد المزادات
- عرض إجمالي العروض
- خدمة 24/7

**🖼️ عرض المزادات**
- Cards أنيقة مع hover effects
- صور مع zoom effect
- badges للمزادات النشطة (🔥 Hot)
- معلومات واضحة (السعر، عدد العروض)
- زر "تقديم عرض" يظهر عند الـ hover

**🎁 CTA Section**
- دعوة للبائعين الجدد
- تصميم gradient جذاب

**⚡ تحسينات الأداء**
- Loading state مع spinner
- Empty state جذابة
- Client-side rendering للتفاعل السريع

---

### 2️⃣ **صفحة تفاصيل المزاد** (`/listing/[slug]`)

#### ✨ المميزات الجديدة:

**🧭 Breadcrumb Navigation**
- مسار تنقل واضح
- روابط سريعة للعودة

**🖼️ معرض الصور**
- صورة كبيرة مع hover zoom
- badge حالة المنتج
- تصميم مربع أنيق

**📊 بطاقات الإحصائيات**
- 3 بطاقات صغيرة:
  - عدد العروض
  - سعر البداية
  - Hot Deal badge

**💳 معلومات المنتج**
- عنوان كبير مع gradient
- وصف مع border جانبي
- السعر الحالي بارز
- معلومات البائع مع avatar

**💰 نموذج تقديم العرض**
- تصميم gradient (بنفسجي → وردي)
- أيقونات في حقول الإدخال
- رسائل خطأ ونجاح واضحة
- زر بتأثيرات متحركة

**📜 سجل العروض**
- عرض جميع العروض مرتبة
- تمييز أعلى عرض بـ 👑
- معلومات العارض مع avatar
- تاريخ ووقت العرض
- تصميم خاص لأعلى عرض (ذهبي)

**🎯 Empty States**
- رسائل ودية عند عدم وجود عروض
- دعوة لتقديم أول عرض

---

### 3️⃣ **نموذج تقديم العرض** (BidForm Component)

#### ✨ التحسينات:

**🎨 التصميم**
- حقول إدخال مع أيقونات
- borders ملونة (بنفسجي)
- focus states واضحة
- placeholders مفيدة

**✅ حالات النجاح والفشل**
- رسالة نجاح خضراء مع ✓
- رسالة خطأ حمراء مع تحذير
- animations (shake للخطأ، bounce للنجاح)

**🔄 حالات الزر**
- حالة عادية: "تقديم عرض" مع ⚡
- حالة التحميل: spinner + "جاري الإرسال"
- حالة النجاح: ✓ + "تم بنجاح"
- gradient background

**🌐 الترجمة**
- دعم كامل للترجمة
- رسائل خطأ مترجمة

---

## 🎨 عناصر التصميم

### الألوان الرئيسية

```css
/* Primary Gradients */
from-purple-600 to-pink-600
from-blue-600 via-purple-600 to-pink-600
from-purple-600 via-pink-600 to-red-600

/* Status Colors */
Green: نجاح/نشط
Red: خطأ/تحذير
Yellow: أعلى عرض
Purple: رئيسي
```

### الـ Icons

استخدام SVG icons لـ:
- 📧 Email
- 💰 السعر
- ⚡ السرعة
- ✓ النجاح
- ⚠️ التحذير
- 👤 المستخدم
- ⏱️ الوقت

### الـ Shadows

```css
shadow-lg: للبطاقات العادية
shadow-xl: للعناصر المهمة
shadow-2xl: للـ hero sections
```

### الـ Animations

**CSS Animations:**
- `animate-spin` - Spinner
- `animate-shake` - رسائل الخطأ
- `animate-bounce-once` - رسائل النجاح
- `animate-fade-in` - ظهور العناصر
- `animate-slide-up` - تحريك للأعلى

**Hover Effects:**
- `hover:scale-105` - تكبير خفيف
- `hover:shadow-xl` - ظل أكبر
- `hover:-translate-y-1` - رفع للأعلى
- `group-hover:scale-110` - zoom للصور

---

## 📱 Responsive Design

### Breakpoints

```css
sm: 640px   /* Tablet */
md: 768px   /* Desktop Small */
lg: 1024px  /* Desktop Large */
xl: 1280px  /* Wide Screen */
```

### Grid Layouts

**Home Page:**
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns

**Listing Details:**
- Mobile: 1 column (stack)
- Desktop: 2 columns (side by side)

---

## 🌐 دعم الترجمة

جميع النصوص مترجمة باستخدام نظام i18n:

```tsx
const { t } = useTranslation();

{t('listing.title')}
{t('listing.placeBid')}
{t('common.loading')}
{t('errors.invalidEmail')}
```

---

## 🎯 تجربة المستخدم (UX)

### Loading States
- Spinner أنيق مع رسالة
- تجربة سلسة أثناء التحميل

### Empty States
- رسائل ودية
- أيقونات تعبيرية (emoji)
- دعوة للعمل واضحة

### Success States
- رسائل تأكيد واضحة
- أيقونات نجاح
- animations للفت الانتباه

### Error States
- رسائل خطأ مفهومة
- ألوان تحذيرية
- اقتراحات للحل

---

## 🚀 الأداء

### Optimizations

1. **Images:**
   - lazy loading
   - object-cover للحفاظ على النسب
   - aspect ratios محددة

2. **Animations:**
   - GPU-accelerated (transform, opacity)
   - smooth transitions
   - duration معقول

3. **Loading:**
   - client-side rendering للتفاعل
   - refresh بعد تقديم العرض

---

## 🎨 الملفات المعدلة

```
frontend/src/
├── app/
│   ├── page.tsx                      ✅ تحديث كامل
│   ├── listing/[slug]/page.tsx       ✅ تحديث كامل
│   └── globals.css                   ✅ إضافة animations
└── components/
    └── BidForm.tsx                   ✅ تحديث كامل
```

---

## 📸 Screenshots المتوقعة

### Home Page
- Hero section مع gradient
- 3 بطاقات إحصائيات
- Grid من المزادات
- CTA section في الأسفل

### Listing Details
- صورة كبيرة + معلومات
- 3 بطاقات صغيرة
- نموذج تقديم عرض
- سجل العروض

---

## 🎯 الخطوات التالية (اختياري)

1. إضافة **Image Gallery** (عدة صور)
2. إضافة **Countdown Timer** للمزادات
3. إضافة **Real-time Updates** (WebSocket)
4. إضافة **Wishlist/Favorites**
5. إضافة **Share Buttons**
6. إضافة **Product Categories**
7. إضافة **Search & Filters**

---

## 🔧 كيفية الاستخدام

### تشغيل المشروع:

```bash
cd frontend
npm run dev
```

### الصفحات:

- **Home:** `http://localhost:3000`
- **Listing:** `http://localhost:3000/listing/[slug]`

### اختبار:

1. افتح Home page
2. انقر على أي مزاد
3. جرب تقديم عرض
4. شاهد التحديثات

---

✨ **التصميم الآن راقي وأنيق بالكامل!**

🎨 ألوان جذابة | 🎯 UX ممتاز | 🌐 مترجم بالكامل | 📱 Responsive


<!-- END DESIGN_UPDATE_README.md -->



<!-- BEGIN EMAIL_SYSTEM_README.md -->

# نظام إرسال البريد الإلكتروني للعملاء الجدد

## الوظائف المضافة

### 1. Backend (Laravel)

#### الملفات المضافة/المعدلة:

- **Migration**: `2026_02_04_154829_create_email_templates_table.php`
  - جدول لتخزين قوالب البريد الإلكتروني
  - الحقول: id, key, subject, body, is_active, timestamps

- **Model**: `app/Models/EmailTemplate.php`
  - نموذج Laravel لإدارة قوالب البريد الإلكتروني

- **Notification**: `app/Notifications/WelcomeEmailNotification.php`
  - إشعار يُرسل عند تسجيل عميل جديد
  - يستخدم القالب من قاعدة البيانات
  - يدعم المتغيرات: `{name}`, `{email}`

- **Seeder**: `database/seeders/EmailTemplateSeeder.php`
  - بيانات أولية لقالب رسالة الترحيب بالعربية

- **Controller**: `app/Http/Controllers/Api/EmailTemplateController.php`
  - إدارة قوالب البريد الإلكتروني (عرض، تعديل، تفعيل/تعطيل)

- **Routes**: تم تحديث `routes/api.php`
  ```php
  Route::prefix('admin')->middleware('admin')->group(function () {
      Route::get('/email-templates', [EmailTemplateController::class, 'index']);
      Route::get('/email-templates/{key}', [EmailTemplateController::class, 'show']);
      Route::put('/email-templates/{key}', [EmailTemplateController::class, 'update']);
      Route::post('/email-templates/{key}/toggle', [EmailTemplateController::class, 'toggle']);
  });
  ```

- **AuthController**: تم تحديث `app/Http/Controllers/Api/AuthController.php`
  - إضافة إرسال البريد الإلكتروني عند التسجيل:
  ```php
  $user->notify(new WelcomeEmailNotification());
  ```

### 2. Frontend (Next.js)

#### الملفات المضافة/المعدلة:

- **Types**: `src/lib/types.ts`
  - إضافة أنواع TypeScript:
    - `EmailTemplate`
    - `UpdateEmailTemplateInput`

- **API Functions**: `src/lib/api-email.ts`
  - `fetchEmailTemplates()` - جلب جميع القوالب
  - `fetchEmailTemplate(key)` - جلب قالب معين
  - `updateEmailTemplate(key, data)` - تحديث قالب
  - `toggleEmailTemplate(key)` - تفعيل/تعطيل قالب

- **صفحة الإدارة**: `src/app/admin/email-templates/page.tsx`
  - واجهة بالعربية لتعديل قوالب البريد الإلكتروني
  - معاينة مباشرة للرسالة
  - تفعيل/تعطيل القالب
  - دعم المتغيرات: `{name}`, `{email}`

- **صفحة Admin الرئيسية**: تم تحديث `src/app/admin/page.tsx`
  - إضافة زر للوصول إلى صفحة إدارة البريد الإلكتروني

## كيفية الاستخدام

### 1. إعداد Backend

```bash
cd backend

# تشغيل الـ migrations
php artisan migrate

# إضافة البيانات الأولية للقالب
php artisan db:seed --class=EmailTemplateSeeder

# التأكد من إعدادات البريد في .env
# MAIL_MAILER=log  (للتطوير - يحفظ في logs/laravel.log)
# ADMIN_TOKEN=change-me
```

### 2. الوصول للصفحة الإدارية

1. افتح المتصفح على: `http://localhost:3000/admin`
2. أدخل `ADMIN_TOKEN` (نفس القيمة في `backend/.env`)
3. اضغط على زر "إدارة رسائل البريد الإلكتروني"

### 3. تعديل قالب الرسالة

في صفحة `/admin/email-templates`:

- **عنوان الرسالة**: موضوع البريد الإلكتروني
- **محتوى الرسالة**: نص الرسالة مع دعم المتغيرات
  - `{name}` - يتم استبداله باسم المستخدم
  - `{email}` - يتم استبداله ببريد المستخدم
- **معاينة**: تظهر كيف ستبدو الرسالة
- **التفعيل/التعطيل**: يمكن إيقاف إرسال الرسالة مؤقتاً

### 4. اختبار النظام

```bash
# في مجلد backend
php artisan queue:work  # إذا كنت تستخدم queue

# سجل عميل جديد عبر API:
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "أحمد",
    "email": "ahmad@example.com",
    "password": "password123"
  }'

# تحقق من الرسالة في: backend/storage/logs/laravel.log
```

## API Endpoints

### العملاء

- **POST** `/api/auth/register` - تسجيل عميل جديد (يرسل بريد ترحيب)

### المسؤول (تتطلب `X-Admin-Token`)

- **GET** `/api/admin/email-templates` - قائمة القوالب
- **GET** `/api/admin/email-templates/{key}` - عرض قالب معين
- **PUT** `/api/admin/email-templates/{key}` - تحديث قالب
- **POST** `/api/admin/email-templates/{key}/toggle` - تفعيل/تعطيل

## المتغيرات المدعومة في القوالب

- `{name}` - اسم المستخدم
- `{email}` - البريد الإلكتروني للمستخدم

## ملاحظات

- الرسائل تُرسل باستخدام Queue في الـ production للأداء الأفضل
- في بيئة التطوير، الرسائل تُحفظ في `storage/logs/laravel.log`
- يمكن تغيير إعدادات MAIL في `.env` لاستخدام SMTP حقيقي
- القوالب مخزنة في قاعدة البيانات ويمكن تعديلها بدون كود

## إعداد SMTP حقيقي (Production)

في `backend/.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io  # أو أي SMTP آخر
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="${APP_NAME}"
```

## الأمان

- جميع endpoints الإدارية محمية بـ `X-Admin-Token`
- تأكد من تغيير `ADMIN_TOKEN` في الـ production
- القوالب تُنظف من XSS تلقائياً


<!-- END EMAIL_SYSTEM_README.md -->



<!-- BEGIN I18N_QUICK_START.md -->

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


<!-- END I18N_QUICK_START.md -->



<!-- BEGIN I18N_SYSTEM_README.md -->

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


<!-- END I18N_SYSTEM_README.md -->



<!-- BEGIN PASSWORD_RESET_README.md -->

# نظام استعادة كلمة المرور

تم إنشاء نظام كامل لاستعادة كلمة المرور يتضمن Frontend و Backend مع الخوارزمية الآمنة.

## الخوارزمية والمنطق

### 1. طلب استعادة كلمة المرور
1. المستخدم يدخل بريده الإلكتروني
2. النظام يتحقق من وجود البريد في قاعدة البيانات
3. إنشاء رمز عشوائي آمن (64 حرف)
4. تشفير الرمز وحفظه في جدول `password_resets`
5. إرسال رابط الاستعادة عبر البريد الإلكتروني
6. الرمز صالح لمدة 60 دقيقة فقط

### 2. إعادة تعيين كلمة المرور
1. المستخدم يضغط على الرابط المرسل
2. النظام يتحقق من صحة الرمز وانتهاء صلاحيته
3. المستخدم يدخل كلمة المرور الجديدة
4. تشفير كلمة المرور الجديدة وحفظها
5. حذف رمز الاستعادة من قاعدة البيانات
6. توجيه المستخدم لصفحة تسجيل الدخول

## الملفات المُنشأة

### Frontend (Next.js)

#### 1. صفحة نسيان كلمة المرور
- **المسار**: `/forgot-password`
- **الملف**: `frontend/src/app/forgot-password/page.tsx`
- **الوظائف**:
  - نموذج إدخال البريد الإلكتروني
  - التحقق من صحة البريد
  - إرسال طلب الاستعادة للـ API
  - عرض رسائل النجاح والخطأ

#### 2. صفحة إعادة تعيين كلمة المرور
- **المسار**: `/reset-password?token=xxx`
- **الملف**: `frontend/src/app/reset-password/page.tsx`
- **الوظائف**:
  - استقبال الرمز من URL
  - نموذج إدخال كلمة المرور الجديدة
  - التحقق من تطابق كلمات المرور
  - إرسال طلب التحديث للـ API
  - التوجيه لصفحة تسجيل الدخول عند النجاح

### Backend (Laravel)

#### 1. Migration لجدول password_resets
- **الملف**: `backend/database/migrations/2024_01_20_000000_create_password_resets_table.php`
- **الحقول**:
  - `email`: البريد الإلكتروني
  - `token`: الرمز المُشفر
  - `created_at`: وقت الإنشاء

#### 2. Controller لاستعادة كلمة المرور
- **الملف**: `backend/app/Http/Controllers/Api/PasswordResetController.php`
- **الوظائف**:
  - `forgotPassword()`: معالجة طلب الاستعادة
  - `resetPassword()`: معالجة إعادة التعيين

#### 3. API Routes
- **POST** `/api/auth/forgot-password`: طلب استعادة كلمة المرور
- **POST** `/api/auth/reset-password`: إعادة تعيين كلمة المرور

## الأمان

### 1. تشفير الرموز
- الرموز مُشفرة باستخدام `Hash::make()`
- لا يمكن استرجاع الرمز الأصلي من قاعدة البيانات

### 2. انتهاء الصلاحية
- الرموز صالحة لمدة 60 دقيقة فقط
- يتم حذف الرموز القديمة تلقائياً

### 3. استخدام واحد فقط
- يتم حذف الرمز فور استخدامه
- لا يمكن استخدام نفس الرمز مرتين

### 4. عدم الكشف عن المعلومات
- لا يكشف النظام عما إذا كان البريد موجود أم لا
- رسالة موحدة للحماية من التعداد

## كيفية الاستخدام

### 1. إعداد Backend

```bash
cd backend

# تشغيل الـ migration
php artisan migrate

# إعداد متغيرات البيئة في .env
FRONTEND_URL=http://localhost:3000
```

### 2. اختبار النظام

1. **طلب الاستعادة**:
   ```bash
   curl -X POST http://localhost:8000/api/auth/forgot-password \
     -H "Content-Type: application/json" \
     -d '{"email": "user@example.com"}'
   ```

2. **التحقق من الـ Log**:
   ```bash
   tail -f backend/storage/logs/laravel.log
   ```

3. **إعادة التعيين**:
   ```bash
   curl -X POST http://localhost:8000/api/auth/reset-password \
     -H "Content-Type: application/json" \
     -d '{"token": "TOKEN_FROM_LOG", "password": "newpassword123"}'
   ```

### 3. الاستخدام عبر الواجهة

1. اذهب إلى `/login`
2. اضغط على "نسيت كلمة المرور؟"
3. أدخل بريدك الإلكتروني
4. تحقق من الـ log للحصول على الرابط
5. اذهب للرابط وأدخل كلمة المرور الجديدة

## إعداد البريد الإلكتروني الحقيقي

لإرسال رسائل حقيقية، أضف في `backend/.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="${APP_NAME}"
```

ثم استبدل الـ `\Log::info()` في Controller بـ:

```php
Mail::send('emails.password-reset', [
    'name' => $user->name,
    'resetUrl' => $resetUrl
], function ($message) use ($request) {
    $message->to($request->email)
            ->subject('استعادة كلمة المرور');
});
```

## الميزات

- ✅ واجهة مستخدم باللغة العربية
- ✅ تشفير آمن للرموز
- ✅ انتهاء صلاحية تلقائي
- ✅ حماية من إعادة الاستخدام
- ✅ رسائل خطأ واضحة
- ✅ تصميم متجاوب
- ✅ تكامل مع نظام المصادقة الموجود

النظام جاهز للاستخدام ويتبع أفضل الممارسات الأمنية!

<!-- END PASSWORD_RESET_README.md -->



<!-- BEGIN PROFESSIONAL_DESIGN_UPDATE.md -->

# 🎨 تحديث التصميم الاحترافي

## نظرة عامة

تم تحويل التصميم بالكامل من تصميم بسيط إلى **تصميم احترافي راقي** مع التركيز على:
- ✅ إزالة جميع الـ emoji واستبدالها بـ SVG icons احترافية
- ✅ Navbar حديث ومتجاوب
- ✅ تصميم minimalist وأنيق
- ✅ تجربة مستخدم احترافية

---

## 🎯 التغييرات الرئيسية

### 1️⃣ **Header/Navbar** - تصميم احترافي

#### المميزات:
- **Sticky header** مع backdrop blur
- Logo احترافي بـ SVG icon
- Navigation مع underline animation
- Mobile menu responsive
- Language switcher محسّن
- Gradient buttons
- SVG icons لجميع العناصر

#### قبل:
```tsx
// تصميم بسيط بدون icons
<Link href="/sell">بيع</Link>
```

#### بعد:
```tsx
// SVG icons احترافية مع animations
<Link href="/sell">
  <svg className="w-4 h-4" fill="none" stroke="currentColor">
    <path d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
  </svg>
  {t('nav.sell')}
</Link>
```

#### التأثيرات:
- ✨ Hover underline animation (gradient)
- 🎨 Smooth transitions
- 📱 Mobile menu مع icons
- 🌐 Language switcher مع flag icons SVG

---

### 2️⃣ **Language Switcher** - أعلام احترافية

#### التحسينات:
- استبدال globe icon بـ flag icons SVG
- أعلام ملونة للدول (عربي، إنجليزي، فرنسي)
- Dropdown محسّن مع checkmark
- Smooth animations

#### Flag Icons:
```tsx
const flagIcons = {
  ar: <svg>...</svg>,  // 🇦🇪 العلم العربي
  en: <svg>...</svg>,  // 🇬🇧 العلم البريطاني
  fr: <svg>...</svg>,  // 🇫🇷 العلم الفرنسي
};
```

---

### 3️⃣ **Home Page** - بدون emoji

#### ما تم إزالته:
- ❌ `🎯` من زر البيع
- ❌ `👇` من زر العرض
- ❌ `📦` من empty state
- ❌ `🎨` من placeholder الصورة
- ❌ `🔥` من hot badge
- ❌ `→` من زر place bid

#### ما تم إضافته:
- ✅ SVG icon للبيع (plus icon)
- ✅ SVG icon للسهم (arrow down)
- ✅ SVG icon للصندوق (box icon)
- ✅ SVG icon للصورة (image placeholder)
- ✅ SVG icon للنار (fire/flame icon)
- ✅ SVG icon للسهم (arrow right)

#### مثال - Hero Section:
```tsx
// قبل
<Link href="/sell">
  {t('nav.sell')} 🎯
</Link>

// بعد
<Link href="/sell">
  <svg className="w-5 h-5">
    <path d="M12 4v16m8-8H4"/>
  </svg>
  {t('nav.sell')}
</Link>
```

#### مثال - Hot Badge:
```tsx
// قبل
<div className="badge">
  🔥 Hot
</div>

// بعد
<div className="badge flex items-center gap-1.5">
  <svg className="w-3.5 h-3.5" fill="currentColor">
    <path d="M12.395 2.553a1 1 0 00-1.45-.385..."/>
  </svg>
  Hot
</div>
```

---

### 4️⃣ **Listing Detail Page** - SVG احترافية

#### التحسينات:
- ✅ استبدال `😕` بـ SVG sad face
- ✅ استبدال `🎨` بـ SVG image placeholder
- ✅ استبدال `🔥` في Hot Deal بـ SVG flame
- ✅ استبدال `💰` في no bids بـ SVG money icon
- ✅ استبدال `👑` في top bid بـ SVG crown/star
- ✅ استبدال emoji في active badge بـ SVG flame

#### مثال - No Bids State:
```tsx
// قبل
<div className="text-6xl mb-4">💰</div>
<h3>لا توجد عروض بعد</h3>

// بعد
<div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
  <svg className="w-10 h-10 text-purple-600">
    <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2..."/>
  </svg>
</div>
<h3>لا توجد عروض بعد</h3>
```

#### مثال - Top Bidder Badge:
```tsx
// قبل
{index === 0 && <div className="text-2xl">👑</div>}

// بعد
{index === 0 && (
  <svg className="w-8 h-8 text-yellow-500" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292..."/>
  </svg>
)}
```

---

### 5️⃣ **BidForm Component** - نظيف وبسيط

#### التحسينات:
- ✅ إزالة `🎉` من success message
- ✅ جميع الـ icons من SVG
- ✅ تصميم نظيف بدون distractions

#### قبل:
```tsx
<p>تم تقديم عرضك بنجاح! 🎉</p>
```

#### بعد:
```tsx
<div className="flex items-start gap-3">
  <svg className="w-5 h-5 text-green-600">
    <path d="M5 13l4 4L19 7"/>
  </svg>
  <p>تم تقديم عرضك بنجاح!</p>
</div>
```

---

## 🎨 SVG Icons المستخدمة

### Navigation Icons

| الوظيفة | Icon | الاستخدام |
|---------|------|-----------|
| Home | `M3 12l2-2m0 0l7-7...` | الصفحة الرئيسية |
| Sell/Add | `M12 6v6m0 0v6m0-6h6m-6 0H6` | إضافة منتج |
| Dashboard | `M4 6a2 2 0 012-2h2...` | لوحة التحكم |
| Menu | `M4 6h16M4 12h16M4 18h16` | قائمة الموبايل |
| Close | `M6 18L18 6M6 6l12 12` | إغلاق القائمة |

### Action Icons

| الوظيفة | Icon | الاستخدام |
|---------|------|-----------|
| Arrow Right | `M13 7l5 5m0 0l-5 5m5-5H6` | زر تقديم عرض |
| Arrow Down | `M19 9l-7 7-7-7` | مشاهدة المزيد |
| Check | `M5 13l4 4L19 7` | نجاح العملية |
| Warning | `M12 8v4m0 4h.01M21 12a9 9 0 11-18 0...` | تحذير/خطأ |

### Status Icons

| الوظيفة | Icon | الاستخدام |
|---------|------|-----------|
| Fire/Flame | `M12.395 2.553a1 1 0 00-1.45-.385...` | Hot Deal |
| Star/Crown | `M9.049 2.927c.3-.921 1.603-.921...` | أعلى عرض |
| Money | `M12 8c-1.657 0-3 .895-3 2s1.343 2...` | المال/السعر |
| Image | `M4 16l4.586-4.586a2 2 0 012.828 0...` | صورة |
| Box | `M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4...` | منتج |

### Flag Icons

| اللغة | Icon | الوصف |
|------|------|-------|
| 🇦🇪 العربية | SVG مخصص | ألوان العلم العربي |
| 🇬🇧 English | SVG مخصص | Union Jack |
| 🇫🇷 Français | SVG مخصص | الألوان الفرنسية |

---

## 📱 Responsive Design

### Mobile Menu
```tsx
{isMenuOpen && (
  <div className="md:hidden border-t py-4 space-y-2">
    <Link href="/" className="flex items-center gap-3">
      <svg className="w-5 h-5">...</svg>
      {t('nav.home')}
    </Link>
    {/* المزيد... */}
  </div>
)}
```

### Desktop Navigation
```tsx
<nav className="hidden md:flex items-center gap-1">
  <Link href="/" className="relative group">
    <span className="flex items-center gap-2">
      <svg>...</svg>
      {t('nav.home')}
    </span>
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all"></span>
  </Link>
</nav>
```

---

## 🎯 الملفات المعدّلة

```
frontend/src/
├── components/
│   ├── Header.tsx              ✅ تصميم كامل جديد
│   ├── LanguageSwitcher.tsx    ✅ flag icons SVG
│   └── BidForm.tsx             ✅ إزالة emoji
├── app/
│   ├── page.tsx                ✅ جميع emoji → SVG
│   └── listing/[slug]/
│       └── page.tsx            ✅ جميع emoji → SVG
└── lib/i18n/locales/
    ├── ar.json                 ✅ إضافة nav.dashboard
    ├── en.json                 ✅ إضافة nav.dashboard
    └── fr.json                 ✅ إضافة nav.dashboard
```

---

## ✨ المميزات الإضافية

### 1. Animations
- ✅ Underline animation في الـ nav
- ✅ Hover scale effects
- ✅ Smooth transitions
- ✅ Mobile menu slide

### 2. Accessibility
- ✅ aria-label للأزرار
- ✅ Semantic HTML
- ✅ Keyboard navigation
- ✅ Screen reader friendly

### 3. Performance
- ✅ SVG inline (no extra requests)
- ✅ Optimized icons
- ✅ Minimal CSS
- ✅ Fast rendering

---

## 🎨 Color Palette

### Gradients
```css
/* Primary */
from-purple-600 to-pink-600

/* Hero */
from-blue-600 via-purple-600 to-pink-600

/* Hot Badge */
from-red-500 to-orange-500

/* Active Badge */
from-green-100 to-emerald-100
```

### Icon Colors
```css
/* Neutral */
text-gray-400

/* Primary */
text-purple-600 dark:text-purple-400

/* Success */
text-green-600 dark:text-green-400

/* Warning/Hot */
text-red-500
text-yellow-500
```

---

## 🚀 كيفية الاستخدام

### تشغيل المشروع:
```bash
cd frontend
npm run dev
```

### الصفحات:
- **Home:** `http://localhost:3000`
- **Listing:** `http://localhost:3000/listing/[slug]`

---

## ✅ Checklist - ما تم إنجازه

- [x] تصميم navbar احترافي
- [x] SVG icons في جميع الأزرار
- [x] Flag icons للغات
- [x] إزالة جميع emoji من Home
- [x] إزالة جميع emoji من Listing Detail
- [x] إزالة emoji من BidForm
- [x] Mobile menu responsive
- [x] Hover animations
- [x] Dark mode support
- [x] Accessibility improvements
- [x] Translation updates (nav.dashboard)

---

## 🎯 النتيجة النهائية

### قبل:
- ✗ emoji في كل مكان (🎯👇📦🎨🔥💰👑)
- ✗ تصميم بسيط للأطفال
- ✗ navbar عادي بدون features
- ✗ بدون icons احترافية

### بعد:
- ✅ SVG icons احترافية
- ✅ تصميم راقي وأنيق
- ✅ navbar حديث مع animations
- ✅ تجربة مستخدم ممتازة
- ✅ responsive design كامل
- ✅ dark mode support
- ✅ accessibility محسّن

---

## 📊 الإحصائيات

| المقياس | قبل | بعد |
|---------|-----|-----|
| Emoji Count | 15+ | 0 |
| SVG Icons | 0 | 30+ |
| Professional Rating | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| User Experience | Basic | Professional |
| Accessibility | Medium | High |

---

✨ **التصميم الآن احترافي 100%!**

🎨 بدون emoji | 🎯 SVG احترافية | 📱 Responsive | 🌐 مترجم


<!-- END PROFESSIONAL_DESIGN_UPDATE.md -->



<!-- BEGIN README.md -->

# Laravel + Next.js Auction (مزاد)

This repo is a simple auction demo:
- `backend/`: Laravel API (SQLite) — listings, bids, admin moderation
- `frontend/`: Next.js UI — browse listings, bid, submit a listing, admin review

## Run locally

### 1) Backend (Laravel)

```powershell
cd backend

# reset + seed sample data
php artisan migrate:fresh --seed

# (once) expose uploaded images (storage -> public/storage)
php artisan storage:link

# start API
php artisan serve --port=8000
```

Backend: `http://localhost:8000`

**Admin token**
- Set `ADMIN_TOKEN` in `backend/.env` (default is `change-me`).
- Admin endpoints require header `X-Admin-Token`.

**CORS**
- `CORS_ALLOWED_ORIGINS` in `backend/.env` (default: `http://localhost:3000`).

### 2) Frontend (Next.js)

```powershell
cd frontend

copy .env.local.example .env.local
npm install
npm run dev
```

Frontend: `http://localhost:3000`

## Main pages

- `/` browse approved listings
- `/listing/[slug]` listing details + bid
- `/sell` submit a new listing (pending admin approval)
- `/admin` review/approve/reject listings (needs `ADMIN_TOKEN`)

## API endpoints

Public:
- `GET /api/health`
- `GET /api/listings`
- `GET /api/listings/{slug}`
- `POST /api/listings` (submit listing)
- `POST /api/listings/{slug}/bids` (place bid)

Admin (header `X-Admin-Token`):
- `GET /api/admin/listings?status=pending|approved|rejected`
- `POST /api/admin/listings/{id}/approve`
- `POST /api/admin/listings/{id}/reject` (body: `{ "reason": "..." }`)

## Notes

- This is an auction demo only (no payments, no user accounts).
- Sample listings + bids are seeded via `Database\Seeders\ProductSeeder`.


<!-- END README.md -->



<!-- BEGIN SELLER_RATING_SYSTEM_README.md -->

# نظام تقييم البائعين (Seller Rating System)

تم إنشاء نظام متكامل لتقييم البائعين بالنجوم (Stars Rating) في مشروع المزاد.

## 📋 المكونات المنفذة

### 🔧 Backend (Laravel)

#### 1. قاعدة البيانات

**Migration**: `2026_02_05_000000_create_reviews_table.php`

جدول `reviews` يحتوي على:
- `id`: المعرف الفريد
- `reviewer_id`: المستخدم الذي يقيّم
- `seller_id`: البائع الذي يتم تقييمه
- `product_id`: المنتج المرتبط (اختياري)
- `rating`: التقييم من 1 إلى 5 نجوم
- `comment`: تعليق نصي (اختياري)
- `is_verified`: هل التقييم موثوق (تم الشراء فعلاً)
- `created_at`, `updated_at`: أوقات الإنشاء والتحديث

**قيود:**
- Unique constraint لمنع تكرار التقييم (reviewer + seller + product)
- Foreign keys مع cascade delete
- Indexes للأداء العالي

#### 2. النموذج (Model)

**ملف**: `app/Models/Review.php`

**العلاقات:**
- `reviewer()`: المستخدم الذي أضاف التقييم
- `seller()`: البائع الذي تم تقييمه
- `product()`: المنتج المرتبط

**Scopes:**
- `verified()`: للحصول على التقييمات الموثوقة فقط
- `byRating(int $rating)`: فلترة حسب عدد النجوم

#### 3. المتحكم (Controller)

**ملف**: `app/Http/Controllers/Api/ReviewController.php`

**الوظائف:**

1. **index($sellerId)** - عرض جميع تقييمات بائع معين
   - دعم Pagination
   - فلترة حسب عدد النجوم
   - فلترة للتقييمات الموثوقة فقط
   - حساب الإحصائيات (متوسط التقييم، توزيع النجوم)

2. **store()** - إضافة تقييم جديد
   - التحقق من البيانات
   - منع المستخدم من تقييم نفسه
   - منع التقييم المكرر
   - التحقق من الشراء الفعلي (is_verified)

3. **update($review)** - تحديث تقييم موجود
   - التحقق من صلاحية المستخدم
   - تحديث التقييم والتعليق

4. **destroy($review)** - حذف تقييم
   - السماح لصاحب التقييم أو المدير فقط

5. **sellerSummary($sellerId)** - ملخص تقييمات البائع
   - متوسط التقييم
   - إجمالي التقييمات
   - توزيع النجوم (5 stars, 4 stars, ...)
   - آخر 5 تقييمات

#### 4. المسارات (Routes)

**ملف**: `routes/api.php`

```php
// Public routes
GET  /api/sellers/{seller}/reviews           // عرض تقييمات بائع
GET  /api/sellers/{seller}/reviews/summary   // ملخص التقييمات

// Protected routes (requires auth)
POST   /api/reviews                          // إضافة تقييم جديد
PUT    /api/reviews/{review}                 // تحديث تقييم
DELETE /api/reviews/{review}                 // حذف تقييم
```

#### 5. تحديث نموذج المستخدم

**ملف**: `app/Models/User.php`

إضافة العلاقات:
- `reviewsGiven()`: التقييمات التي أضافها المستخدم
- `reviewsReceived()`: التقييمات التي حصل عليها كبائع

---

### 💻 Frontend (Next.js)

#### 1. الأنواع (Types)

**ملف**: `src/lib/types.ts`

```typescript
export type Review = {
  id: number;
  reviewer_id: number;
  seller_id: number;
  product_id: number | null;
  rating: number;
  comment: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  reviewer?: { id: number; name: string; email?: string };
  seller?: { id: number; name: string; email?: string };
  product?: { id: number; title: string; slug: string };
};

export type ReviewStats = {
  average_rating: number;
  total_reviews: number;
  rating_distribution: {
    5: number; 4: number; 3: number; 2: number; 1: number;
  };
};

export type CreateReviewInput = {
  seller_id: number;
  product_id?: number | null;
  rating: number;
  comment?: string;
};

export type UpdateReviewInput = {
  rating?: number;
  comment?: string;
};
```

#### 2. مكون النجوم (StarRating Component)

**ملف**: `src/components/StarRating.tsx`

**المميزات:**
- ✨ عرض تفاعلي للنجوم (1-5)
- 🎨 3 أحجام: sm, md, lg
- 🖱️ دعم التفاعل للتقييم أو القراءة فقط
- ⭐ دعم التقييم الكسري (مثل 4.5 نجوم)
- 📊 عرض عدد التقييمات
- 🎭 تأثيرات Hover

**الاستخدام:**
```tsx
// للعرض فقط
<StarRating rating={4.5} readonly showCount count={120} />

// للتقييم التفاعلي
<StarRating 
  rating={rating} 
  onRatingChange={setRating}
  size="lg"
/>
```

#### 3. صفحة عرض التقييمات

**ملف**: `src/app/seller/[sellerId]/reviews/page.tsx`

**المميزات:**
- 📊 عرض الإحصائيات الكاملة (متوسط التقييم، توزيع النجوم)
- 🔍 فلترة حسب عدد النجوم
- 📄 Pagination للتقييمات
- ✓ إظهار التقييمات الموثوقة
- 📅 عرض التاريخ بالعربية
- 📈 رسم بياني لتوزيع التقييمات

**المسار:**
```
/seller/[sellerId]/reviews
```

#### 4. نموذج إضافة تقييم

**ملف**: `src/components/AddReviewForm.tsx`

**المميزات:**
- ⭐ اختيار عدد النجوم (1-5)
- 💬 تعليق نصي (اختياري، حد أقصى 1000 حرف)
- ✅ رسائل نجاح وخطأ
- 🔒 التحقق من تسجيل الدخول
- 📝 عداد الأحرف
- 🎨 تصميم جميل ومتجاوب

**الاستخدام:**
```tsx
<AddReviewForm
  sellerId={123}
  productId={456}  // اختياري
  onSuccess={() => console.log('تم!')}
  onCancel={() => console.log('إلغاء')}
/>
```

---

## 🚀 كيفية الاستخدام

### 1. تطبيق Migration

```bash
cd backend
php artisan migrate
```

### 2. تشغيل Backend

```bash
php artisan serve --port=8000
```

### 3. تشغيل Frontend

```bash
cd frontend
npm run dev
```

### 4. الوصول للصفحات

- **عرض تقييمات بائع**: `http://localhost:3000/seller/{sellerId}/reviews`
- **API للتقييمات**: `http://localhost:8000/api/sellers/{sellerId}/reviews`

---

## 📡 أمثلة على استدعاءات API

### 1. الحصول على تقييمات بائع

```bash
GET /api/sellers/1/reviews?page=1&rating=5
```

**Response:**
```json
{
  "reviews": {
    "data": [...],
    "current_page": 1,
    "last_page": 3,
    "total": 25
  },
  "stats": {
    "average_rating": 4.2,
    "total_reviews": 25,
    "rating_distribution": {
      "5": 10,
      "4": 8,
      "3": 5,
      "2": 1,
      "1": 1
    }
  }
}
```

### 2. إضافة تقييم جديد

```bash
POST /api/reviews
Authorization: Bearer {token}
Content-Type: application/json

{
  "seller_id": 1,
  "product_id": 5,
  "rating": 5,
  "comment": "بائع ممتاز، توصيل سريع!"
}
```

### 3. الحصول على ملخص تقييمات البائع

```bash
GET /api/sellers/1/reviews/summary
```

---

## ⚙️ إعدادات المتغيرات

تأكد من وجود المتغيرات في `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

---

## ✨ المميزات الرئيسية

### الأمان
- ✅ منع المستخدم من تقييم نفسه
- ✅ منع التقييم المكرر للبائع نفسه والمنتج
- ✅ التحقق من تسجيل الدخول قبل إضافة تقييم
- ✅ صلاحيات الحذف (صاحب التقييم أو المدير فقط)

### الأداء
- 🚀 Indexes على الأعمدة المهمة
- 🚀 Pagination للتقييمات
- 🚀 Lazy Loading للبيانات
- 🚀 Caching ممكن للإحصائيات

### تجربة المستخدم
- 🎨 تصميم جميل ومتجاوب
- 📱 يعمل على جميع الأجهزة
- 🌍 دعم اللغة العربية
- ⚡ تفاعلي وسريع

---

## 🔮 تطويرات مستقبلية محتملة

- [ ] نظام الإبلاغ عن التقييمات غير المناسبة
- [ ] تقييمات مع الصور
- [ ] رد البائع على التقييمات
- [ ] تصنيف التقييمات (مفيدة/غير مفيدة)
- [ ] إشعارات عند إضافة تقييم جديد
- [ ] ربط التقييم بنظام الطلبات (تقييم بعد الشراء فقط)
- [ ] تقارير تحليلية للبائعين
- [ ] Integration مع نظام النقاط/الشارات

---

## 🧪 الاختبار

### اختبار Backend

```bash
# إنشاء تقييم تجريبي
php artisan tinker

$review = App\Models\Review::create([
    'reviewer_id' => 1,
    'seller_id' => 2,
    'product_id' => 1,
    'rating' => 5,
    'comment' => 'تجربة ممتازة!',
    'is_verified' => true
]);
```

### اختبار API بـ cURL

```bash
# الحصول على التقييمات
curl http://localhost:8000/api/sellers/1/reviews

# إضافة تقييم (يتطلب token)
curl -X POST http://localhost:8000/api/reviews \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "seller_id": 2,
    "rating": 5,
    "comment": "رائع!"
  }'
```

---

## 📝 ملاحظات مهمة

1. **التحقق من الشراء (is_verified)**: 
   - حالياً يتم تعيينه يدوياً
   - يُنصح بربطه مع نظام الطلبات للتحقق التلقائي

2. **منع التكرار**: 
   - كل مستخدم يمكنه تقييم البائع مرة واحدة فقط لكل منتج
   - للسماح بتقييمات متعددة، يمكن إزالة قيد `unique`

3. **الحذف**: 
   - عند حذف مستخدم، يتم حذف جميع تقييماته تلقائياً (cascade)
   - عند حذف منتج، يتم تعيين `product_id` إلى null

---

## 🎯 الخلاصة

تم إنشاء نظام تقييم متكامل يشمل:
- ✅ Backend كامل مع Laravel
- ✅ Frontend احترافي مع Next.js
- ✅ مكونات قابلة لإعادة الاستخدام
- ✅ API موثق
- ✅ تصميم متجاوب
- ✅ دعم اللغة العربية

النظام جاهز للاستخدام الفوري! 🚀

---

**آخر تحديث**: 5 فبراير 2026  
**الحالة**: ✅ مكتمل ومختبر  
**الإصدار**: v1.0.0


<!-- END SELLER_RATING_SYSTEM_README.md -->



<!-- BEGIN TODO.md -->

# 📋 قائمة المهام - مشروع المزاد (Auction System)

## 📌 نظرة عامة على المشروع
نظام مزاد كامل مكون من:
- **Backend**: Laravel API (PHP) - SQLite
- **Frontend**: Next.js (TypeScript/React) - Tailwind CSS

---

## ✅ الميزات المكتملة

### 🔐 نظام المصادقة والأمان
- [x] تسجيل الدخول والخروج
- [x] التسجيل للمستخدمين الجدد
- [x] نظام استعادة كلمة المرور (forgot/reset password)
- [x] حماية المسارات بـ Sanctum Authentication
- [x] حماية لوحة الإدارة بـ Admin Token

### 📧 نظام البريد الإلكتروني
- [x] قوالب البريد الإلكتروني القابلة للتخصيص
- [x] رسائل الترحيب للمستخدمين الجدد
- [x] واجهة إدارة القوالب للمدير
- [x] تفعيل/تعطيل القوالب

### 🌍 تعدد اللغات (i18n)
- [x] دعم 3 لغات: العربية (RTL)، الإنجليزية، الفرنسية
- [x] مكون تبديل اللغة
- [x] حفظ اللغة المفضلة في localStorage
- [x] دعم المتغيرات في الترجمات

### 🎯 لوحات التحكم
- [x] لوحة تحكم المدير - إحصائيات ومراجعة المنتجات
- [x] لوحة تحكم المستخدم - العروض والإحصائيات الشخصية
- [x] لوحة تحكم البائع - إدارة المنتجات والمبيعات

### 🏪 نظام المزاد الأساسي
- [x] عرض المنتجات المعتمدة
- [x] تفاصيل المنتج مع المزايدات
- [x] إضافة منتج جديد (Submit Listing)
- [x] نظام المزايدة على المنتجات
- [x] نظام الموافقة/الرفض للمنتجات (Admin)

---

## 🔄 المهام قيد التنفيذ

### 🚨 أولوية عاجلة (يجب إكمالها أولاً)
- [ ] إضافة Loading States لجميع الطلبات
- [ ] معالجة الأخطاء في Frontend (Error Boundaries)
- [ ] تحسين رسائل الخطأ والنجاح
- [ ] إضافة Validation للنماذج في Frontend
- [ ] تحسين أمان API (Rate Limiting)

### 🎨 التصميم والواجهة
- [ ] تحسين تصميم الصفحة الرئيسية
- [ ] إضافة صور وأيقونات احترافية
- [ ] تحسين تجربة المستخدم (UX/UI)
- [ ] ضبط RTL/LTR لجميع الصفحات
- [ ] إضافة رسوم متحركة (animations) للتفاعلات
- [ ] إضافة Skeleton Loading للمحتوى
- [ ] تحسين تصميم النماذج والأزرار

### 📱 الاستجابة (Responsive Design)
- [ ] اختبار الموقع على الأجهزة المحمولة
- [ ] تحسين العرض على الشاشات الصغيرة
- [ ] ضبط القوائم والنماذج للموبايل
- [ ] تحسين Navigation للموبايل

---

## 🚀 المهام المستقبلية (High Priority)

### 👤 إدارة المستخدمين
- [ ] صفحة الملف الشخصي (Profile Page)
- [ ] تعديل بيانات المستخدم
- [ ] رفع صورة شخصية
- [ ] تغيير كلمة المرور من الإعدادات
- [ ] حذف الحساب

### 🔔 نظام الإشعارات
- [ ] إشعارات في الوقت الفعلي (Real-time notifications)
- [ ] إشعار عند تجاوز المزايدة
- [ ] إشعار عند الموافقة/الرفض للمنتج
- [ ] إشعار عند قرب انتهاء المزاد
- [ ] سجل الإشعارات

### 💰 نظام الدفع
- [ ] دمج بوابة دفع (Stripe/PayPal)
- [ ] صفحة الدفع (Checkout)
- [ ] تأكيد الدفع
- [ ] سجل المعاملات
- [ ] فواتير PDF

### 📊 التقارير والإحصائيات
- [ ] تقرير مبيعات البائع
- [ ] إحصائيات المستخدمين للمدير
- [ ] رسوم بيانية للمزادات
- [ ] تقرير الإيرادات الشهرية
- [ ] تصدير التقارير (Excel/PDF)

### ⭐ المفضلة والمتابعة (أولوية عالية)
- [ ] إنشاء جدول favorites (user_id, product_id)
- [ ] إنشاء FavoriteController في Backend
- [ ] زر إضافة/إزالة من المفضلة في كل منتج
- [ ] صفحة المفضلة (/favorites)
- [ ] عداد المفضلة في Header
- [ ] متابعة البائعين (جدول follows)
- [ ] إشعارات للمنتجات المفضلة
- [ ] حفظ المفضلة للمستخدمين غير المسجلين (localStorage)

### 💬 نظام التعليقات والمراجعات
- [ ] إضافة تعليقات على المنتجات
- [x] تقييم البائعين (Stars Rating) ✅ **مكتمل - انظر SELLER_RATING_SYSTEM_README.md**
- [ ] مراجعات المشترين
- [ ] الرد على التعليقات
- [ ] إدارة التعليقات (حذف/إخفاء)

### 🔍 البحث والفلترة (أولوية عالية)
- [ ] إضافة Search Bar في Header
- [ ] صفحة نتائج البحث (/search)
- [ ] بحث في العنوان والوصف
- [ ] فلترة حسب الفئة
- [ ] فلترة حسب السعر (من - إلى)
- [ ] فلترة حسب التاريخ
- [ ] ترتيب النتائج (الأحدث، الأقدم، السعر)
- [ ] حفظ البحث الأخير في localStorage
- [ ] عرض عدد النتائج

### 📂 إدارة الفئات (أولوية عالية)
- [ ] إنشاء جدول categories في قاعدة البيانات
- [ ] إنشاء CategoryController في Backend
- [ ] إضافة category_id للمنتجات
- [ ] صفحة عرض حسب الفئة (/category/[slug])
- [ ] قائمة الفئات في الصفحة الرئيسية
- [ ] تصنيفات فرعية (parent_id)
- [ ] أيقونات للفئات
- [ ] إدارة الفئات من لوحة المدير
- [ ] عداد المنتجات لكل فئة

---

## 🔧 التحسينات التقنية

### 🛡️ الأمان
- [ ] تفعيل CSRF Protection
- [ ] Rate Limiting للـ API
- [ ] استبدال حماية لوحة الإدارة (Admin Token) بصلاحيات مبنية على المستخدمين/الأدوار (Sanctum + role=admin)
- [ ] تشفير البيانات الحساسة
- [ ] Two-Factor Authentication (2FA)
- [ ] Security Headers
- [ ] SQL Injection Protection
- [ ] XSS Protection

### ⚡ الأداء
- [ ] تطبيق Caching للبيانات
- [ ] Image Optimization
- [ ] Lazy Loading للصور
- [ ] Code Splitting
- [ ] Database Indexing
- [ ] CDN للملفات الثابتة
- [ ] Compression (Gzip/Brotli)

### 🧪 الاختبارات
- [ ] Unit Tests للـ Backend
- [ ] Integration Tests
- [ ] E2E Tests للـ Frontend
- [ ] API Testing
- [ ] Security Testing

### 🧹 صيانة المشروع (Refactoring/Quality)
- [ ] حذف الملفات المؤقتة/النسخ الاحتياطية من الـ repo (مثل `frontend/src/lib/api.ts.bak`)
- [ ] توحيد عميل الـ API في الـ Frontend (إزالة التكرار بين `authApi.ts` و `api.ts`)
- [ ] توحيد اسم متغير الـ API base URL في الكود والوثائق (`NEXT_PUBLIC_API_BASE_URL`)
- [ ] إصلاح/تقليل Flash RTL/LTR عند أول تحميل (قراءة اللغة قبل الـ hydration أو استخدام cookies)
- [ ] إعداد CI بسيط (Backend tests + Frontend lint/build)

### 📚 التوثيق
- [ ] API Documentation (Swagger/Postman)
- [ ] User Guide
- [ ] Developer Guide
- [ ] Deployment Guide
- [ ] Database Schema Documentation
- [ ] تحديث `README.md` الرئيسي ليعكس المميزات الحالية (Auth/i18n/Email templates)
- [ ] تحديث/استبدال `backend/README.md` (حالياً افتراضي Laravel) بدليل تشغيل الـ API للمشروع

---

## 🌟 ميزات إضافية (Nice to Have)

### 📹 الوسائط المتعددة
- [ ] معرض صور متعدد للمنتج
- [ ] فيديو للمنتج
- [ ] زوم على الصور
- [ ] عرض 360 درجة

### 💼 لوحة تحكم متقدمة
- [ ] رسوم بيانية تفاعلية (Charts)
- [ ] تحليلات الزوار (Analytics)
- [ ] خريطة المستخدمين
- [ ] تتبع النشاطات

### 🤖 الذكاء الاصطناعي
- [ ] توصيات منتجات (AI Recommendations)
- [ ] تسعير تلقائي ذكي
- [ ] كشف الاحتيال (Fraud Detection)
- [ ] Chatbot للدعم

### 📱 تطبيق الموبايل
- [ ] React Native App
- [ ] Push Notifications
- [ ] دعم البصمة/Face ID
- [ ] وضع Offline

### 🔗 التكاملات
- [ ] دمج مع وسائل التواصل الاجتماعي
- [ ] مشاركة المنتجات
- [ ] تسجيل دخول بـ Google/Facebook
- [ ] دمج مع Google Analytics

---

## 🐛 الأخطاء والمشاكل المعروفة

### Backend (أولوية عاجلة)
- [ ] إضافة Rate Limiting للـ API
- [ ] تحسين Validation Rules
- [ ] معالجة استثناءات قاعدة البيانات
- [ ] تحسين رسائل الخطأ (JSON responses)
- [ ] إضافة Logging للأخطاء
- [ ] فحص أمان رفع الملفات

### Frontend (أولوية عاجلة)
- [ ] إصلاح تحذيرات React/Next.js
- [ ] إضافة Error Boundaries لكل صفحة
- [ ] Loading States لجميع الطلبات
- [ ] تحسين معالجة أخطاء API
- [ ] إضافة Toast Notifications
- [ ] تحسين Form Validation
- [ ] إصلاح مشاكل الـ Hydration
- [ ] توحيد استهلاك API الخاص بالمصادقة (حالياً يوجد أكثر من ملف/واجهة)
- [ ] تدقيق النصوص غير المترجمة/الثابتة وإكمال تغطية i18n لكل الصفحات

---

## 🚦 خطة التنفيذ المقترحة

### المرحلة 1 (شهر 1) - الأساسيات
1. إكمال التصميم والواجهة
2. نظام الملف الشخصي
3. نظام المفضلة
4. البحث والفلترة الأساسية

### المرحلة 2 (شهر 2) - الميزات المتقدمة
1. نظام الإشعارات
2. إدارة الفئات
3. التعليقات والمراجعات
4. التقارير الأساسية

### المرحلة 3 (شهر 3) - التكامل والدفع
1. نظام الدفع
2. التحسينات الأمنية
3. تحسين الأداء
4. الاختبارات

### المرحلة 4 (شهر 4) - النشر والصيانة
1. التوثيق الكامل
2. نشر الموقع (Deployment)
3. المراقبة والصيانة
4. جمع التغذية الراجعة

---

## 📝 ملاحظات

### الجداول المطلوبة (مفقودة حالياً)
- **categories**: لتصنيف المنتجات
- **favorites**: لحفظ المفضلة
- **follows**: لمتابعة البائعين
- **notifications**: للإشعارات
- **reviews**: للتقييمات والمراجعات

### قاعدة البيانات الحالية
- **SQLite**: مناسبة للتطوير والاختبار
- **التوصية**: الانتقال إلى MySQL/PostgreSQL للإنتاج

### الاستضافة المقترحة
- **Backend**: Laravel Forge, DigitalOcean, AWS
- **Frontend**: Vercel, Netlify
- **Database**: AWS RDS, PlanetScale

### المتغيرات البيئية المطلوبة
```env
# Backend (.env)
ADMIN_TOKEN=your-secure-token
CORS_ALLOWED_ORIGINS=http://localhost:3000
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null

# Frontend (.env.local)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

---

## 🎯 الأهداف النهائية

- [ ] نظام مزاد متكامل وآمن
- [ ] واجهة مستخدم احترافية وسهلة
- [ ] دعم متعدد اللغات بالكامل
- [ ] أداء عالي وسريع
- [ ] موثوقية 99.9%
- [ ] قابلية التوسع (Scalability)

---

**آخر تحديث**: 5 فبراير 2026
**الحالة**: 🟡 قيد التطوير النشط
**الإصدار الحالي**: v0.5.0-beta


<!-- END TODO.md -->


