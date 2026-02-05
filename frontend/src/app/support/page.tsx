"use client";

import { useState, useEffect } from "react";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  status: "new" | "read" | "replied";
}

export default function SupportPage() {
  const [adminToken, setAdminToken] = useState("");
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [reply, setReply] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const tokenKey = "admin_token_v1";

  useEffect(() => {
    const stored = window.localStorage.getItem(tokenKey);
    if (stored) setAdminToken(stored);
  }, []);

  useEffect(() => {
    if (adminToken.trim().length > 0) {
      loadMessages();
    }
  }, [adminToken]);

  function loadMessages() {
    setIsLoading(true);
    try {
      const storedMessages = JSON.parse(localStorage.getItem("contact_messages") || "[]");
      setMessages(storedMessages.sort((a: ContactMessage, b: ContactMessage) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ));
      window.localStorage.setItem(tokenKey, adminToken.trim());
    } catch (err) {
      setError("فشل في تحميل الرسائل");
    } finally {
      setIsLoading(false);
    }
  }

  function markAsRead(message: ContactMessage) {
    const updatedMessages = messages.map(msg => 
      msg.id === message.id ? { ...msg, status: "read" as const } : msg
    );
    setMessages(updatedMessages);
    localStorage.setItem("contact_messages", JSON.stringify(updatedMessages));
    setSelectedMessage({ ...message, status: "read" });
  }

  function handleReply() {
    if (!selectedMessage || !reply.trim()) return;

    const updatedMessages = messages.map(msg => 
      msg.id === selectedMessage.id ? { ...msg, status: "replied" as const } : msg
    );
    setMessages(updatedMessages);
    localStorage.setItem("contact_messages", JSON.stringify(updatedMessages));
    
    setSuccess("تم إرسال الرد بنجاح!");
    setReply("");
    setSelectedMessage({ ...selectedMessage, status: "replied" });
    setTimeout(() => setSuccess(null), 3000);
  }

  function deleteMessage(messageId: number) {
    if (!confirm("هل أنت متأكد من حذف هذه الرسالة؟")) return;
    
    const updatedMessages = messages.filter(msg => msg.id !== messageId);
    setMessages(updatedMessages);
    localStorage.setItem("contact_messages", JSON.stringify(updatedMessages));
    
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(null);
    }
  }

  const stats = {
    total: messages.length,
    new: messages.filter(m => m.status === "new").length,
    read: messages.filter(m => m.status === "read").length,
    replied: messages.filter(m => m.status === "replied").length
  };

  if (!adminToken.trim()) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4">الدعم الفني</h1>
          <p className="text-gray-600 mb-4">الرجاء إدخال رمز المدير للمتابعة</p>
          <input
            type="text"
            value={adminToken}
            onChange={(e) => setAdminToken(e.target.value)}
            placeholder="أدخل رمز المدير"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">الدعم الفني</h1>
          <div className="flex gap-4">
            <button
              onClick={loadMessages}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              تحديث
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {/* الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي الرسائل</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">جديدة</p>
                <p className="text-2xl font-bold text-gray-900">{stats.new}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">مقروءة</p>
                <p className="text-2xl font-bold text-gray-900">{stats.read}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">تم الرد</p>
                <p className="text-2xl font-bold text-gray-900">{stats.replied}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* قائمة الرسائل */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">الرسائل</h2>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <p className="p-6 text-center text-gray-600">جاري التحميل...</p>
              ) : messages.length === 0 ? (
                <p className="p-6 text-center text-gray-600">لا توجد رسائل</p>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                      selectedMessage?.id === message.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => {
                      setSelectedMessage(message);
                      if (message.status === "new") {
                        markAsRead(message);
                      }
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-sm">{message.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        message.status === 'new' ? 'bg-red-100 text-red-800' :
                        message.status === 'read' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {message.status === 'new' ? 'جديد' :
                         message.status === 'read' ? 'مقروء' : 'تم الرد'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{message.email}</p>
                    <p className="text-sm font-medium mb-1">{message.subject || "بدون موضوع"}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(message.created_at).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* تفاصيل الرسالة */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">تفاصيل الرسالة</h2>
            </div>
            <div className="p-6">
              {selectedMessage ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedMessage.subject || "بدون موضوع"}</h3>
                    <p className="text-sm text-gray-600">من: {selectedMessage.name} ({selectedMessage.email})</p>
                    <p className="text-xs text-gray-500">
                      {new Date(selectedMessage.created_at).toLocaleString('ar-SA')}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium">الرد:</label>
                    <textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="اكتب ردك هنا..."
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleReply}
                        disabled={!reply.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        إرسال الرد
                      </button>
                      <button
                        onClick={() => deleteMessage(selectedMessage.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-600">اختر رسالة لعرض التفاصيل</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}