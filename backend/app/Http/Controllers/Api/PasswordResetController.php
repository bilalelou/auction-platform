<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Carbon\Carbon;

class PasswordResetController extends Controller
{
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'إذا كان هذا البريد الإلكتروني مسجل لدينا، ستتلقى رابط استعادة كلمة المرور'
            ], 200);
        }

        // حذف الرموز القديمة
        DB::table('password_resets')->where('email', $request->email)->delete();

        // إنشاء رمز جديد
        $token = Str::random(64);

        DB::table('password_resets')->insert([
            'email' => $request->email,
            'token' => Hash::make($token),
            'created_at' => Carbon::now()
        ]);

        // إرسال البريد الإلكتروني (محاكاة)
        $resetUrl = config('app.frontend_url') . '/reset-password?token=' . $token;
        
        // في التطبيق الحقيقي، ستستخدم Mail::send()
        // هنا سنحفظ في الـ log للاختبار
        \Log::info('Password Reset Email', [
            'email' => $request->email,
            'reset_url' => $resetUrl,
            'message' => "مرحباً {$user->name}،\n\nلإعادة تعيين كلمة المرور، اضغط على الرابط التالي:\n{$resetUrl}\n\nهذا الرابط صالح لمدة 60 دقيقة فقط.\n\nإذا لم تطلب إعادة تعيين كلمة المرور، تجاهل هذه الرسالة."
        ]);

        return response()->json([
            'message' => 'تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني'
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'password' => 'required|min:8'
        ]);

        $passwordReset = DB::table('password_resets')
            ->where('created_at', '>=', Carbon::now()->subHours(1))
            ->get();

        $validToken = null;
        foreach ($passwordReset as $reset) {
            if (Hash::check($request->token, $reset->token)) {
                $validToken = $reset;
                break;
            }
        }

        if (!$validToken) {
            return response()->json([
                'message' => 'رمز الاستعادة غير صحيح أو منتهي الصلاحية'
            ], 400);
        }

        $user = User::where('email', $validToken->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'المستخدم غير موجود'
            ], 404);
        }

        // تحديث كلمة المرور
        $user->password = Hash::make($request->password);
        $user->save();

        // حذف رمز الاستعادة
        DB::table('password_resets')->where('email', $validToken->email)->delete();

        return response()->json([
            'message' => 'تم تغيير كلمة المرور بنجاح'
        ]);
    }
}