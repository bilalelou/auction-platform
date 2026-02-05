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