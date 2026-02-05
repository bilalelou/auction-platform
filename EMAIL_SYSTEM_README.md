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
