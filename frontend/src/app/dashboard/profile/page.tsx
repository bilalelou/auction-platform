"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { loadSession, saveSession } from "@/lib/authStorage";
import { updateProfile, changePassword } from "@/lib/authApi";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export default function ProfilePage() {
    const router = useRouter();
    const [session, setSession] = useState<{ user: { id: number; name: string; email: string }; token: string } | null>(null);

    // Profile form
    const [name, setName] = useState("");
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Password form
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        const s = loadSession();
        if (!s) {
            router.push("/login");
            return;
        }
        setSession(s);
        setName(s.user.name);
    }, [router]);

    const handleProfileUpdate = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!session) return;

        setProfileLoading(true);
        setProfileMessage(null);

        try {
            const updatedUser = await updateProfile(session.token, { name });
            const newSession = { ...session, user: updatedUser };
            saveSession(newSession);
            setSession(newSession);
            setProfileMessage({ type: "success", text: "تم تحديث الملف الشخصي بنجاح" });
        } catch (error) {
            setProfileMessage({ type: "error", text: "حدث خطأ أثناء تحديث الملف الشخصي" });
            console.error(error);
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordChange = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!session) return;

        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: "error", text: "كلمة المرور الجديدة غير متطابقة" });
            return;
        }

        if (newPassword.length < 8) {
            setPasswordMessage({ type: "error", text: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" });
            return;
        }

        setPasswordLoading(true);
        setPasswordMessage(null);

        try {
            await changePassword(session.token, {
                current_password: currentPassword,
                new_password: newPassword,
            });
            setPasswordMessage({ type: "success", text: "تم تغيير كلمة المرور بنجاح" });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            setPasswordMessage({ type: "error", text: "كلمة المرور الحالية غير صحيحة" });
            console.error(error);
        } finally {
            setPasswordLoading(false);
        }
    };

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardSidebar userType="user" />

            <div className="mr-64 p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">الملف الشخصي</h1>

                <div className="max-w-2xl space-y-8">
                    {/* Profile Info Card */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <span>👤</span>
                            <span>معلومات الحساب</span>
                        </h2>

                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    الاسم
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    البريد الإلكتروني
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={session.user.email}
                                    disabled
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">لا يمكن تغيير البريد الإلكتروني</p>
                            </div>

                            {profileMessage && (
                                <div className={`p-3 rounded-lg ${profileMessage.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                    {profileMessage.text}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={profileLoading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {profileLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
                            </button>
                        </form>
                    </div>

                    {/* Change Password Card */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <span>🔐</span>
                            <span>تغيير كلمة المرور</span>
                        </h2>

                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div>
                                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    كلمة المرور الحالية
                                </label>
                                <input
                                    id="currentPassword"
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    كلمة المرور الجديدة
                                </label>
                                <input
                                    id="newPassword"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                    minLength={8}
                                />
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    تأكيد كلمة المرور الجديدة
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                    minLength={8}
                                />
                            </div>

                            {passwordMessage && (
                                <div className={`p-3 rounded-lg ${passwordMessage.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                    {passwordMessage.text}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={passwordLoading}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {passwordLoading ? "جاري التغيير..." : "تغيير كلمة المرور"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
