#!/bin/bash

echo "=== اختبار نظام البريد الإلكتروني ==="
echo ""

# Test API endpoint to get email template
echo "1. جلب قالب البريد الإلكتروني..."
curl -X GET "http://localhost:8000/api/admin/email-templates/welcome_email" \
  -H "X-Admin-Token: change-me" \
  -H "Accept: application/json"

echo -e "\n\n2. تسجيل مستخدم جديد (سيتم إرسال البريد)..."
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "أحمد محمد",
    "email": "ahmad.test@example.com",
    "password": "password123"
  }'

echo -e "\n\n3. تحقق من الرسالة في: backend/storage/logs/laravel.log"
echo "أو إذا كنت تستخدم queue: php artisan queue:work"
