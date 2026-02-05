"use client";

import {
  fetchEmailTemplate,
  updateEmailTemplate,
  toggleEmailTemplate,
} from "@/lib/api-email";
import type { EmailTemplate } from "@/lib/types";
import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

const tokenKey = "admin_token_v1";

export default function EmailTemplatePage() {
  const { t } = useTranslation();
  const [adminToken, setAdminToken] = useState("");
  const [template, setTemplate] = useState<EmailTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    const stored = window.localStorage.getItem(tokenKey);
    if (stored) setAdminToken(stored);
  }, []);

  useEffect(() => {
    if (adminToken.trim().length > 0) {
      loadTemplate();
    }
  }, [adminToken]);

  async function loadTemplate() {
    setError(null);
    setIsLoading(true);

    try {
      const data = await fetchEmailTemplate("welcome_email", adminToken.trim());
      setTemplate(data);
      setSubject(data.subject);
      setBody(data.body);
      window.localStorage.setItem(tokenKey, adminToken.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load template");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      const updated = await updateEmailTemplate(
        "welcome_email",
        { subject, body },
        adminToken.trim()
      );
      setTemplate(updated);
      setSuccess("تم حفظ التغييرات بنجاح!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save template");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggle() {
    if (!template) return;
    
    setError(null);
    try {
      const updated = await toggleEmailTemplate("welcome_email", adminToken.trim());
      setTemplate(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to toggle status");
    }
  }

  if (!adminToken.trim()) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4">{t('admin.emailTemplates')}</h1>
          <p className="text-gray-600 mb-4">{t('admin.adminTokenHint')}</p>
          <input
            type="text"
            value={adminToken}
            onChange={(e) => setAdminToken(e.target.value)}
            placeholder={t('admin.adminToken')}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{t('admin.emailTemplateTitle')}</h1>
            <a
              href="/admin"
              className="text-blue-600 hover:text-blue-800"
            >
              ← {t('admin.backToDashboard')}
            </a>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
              {success}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">{t('common.loading')}</p>
            </div>
          ) : template ? (
            <form onSubmit={handleSave}>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={template.is_active}
                      onChange={handleToggle}
                      className="mr-2 h-4 w-4"
                    />
                    <span className="text-sm font-medium">
                      {template.is_active ? t('admin.active') : t('admin.inactive')}
                    </span>
                  </label>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    {t('admin.emailSubject')}
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder={t('admin.emailSubject')}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    {t('admin.emailBody')}
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    {t('admin.emailVariablesHint')}
                  </p>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                    rows={12}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    placeholder={t('admin.emailBody')}
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h3 className="font-medium mb-2">{t('admin.preview')}</h3>
                  <div className="text-sm whitespace-pre-wrap bg-white p-4 rounded border">
                    <p className="font-bold mb-2">{subject}</p>
                    <div>{body.replace("{name}", "أحمد").replace("{email}", "ahmad@example.com")}</div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {isSaving ? `${t('common.loading')}...` : t('admin.saveChanges')}
                  </button>
                  <button
                    type="button"
                    onClick={loadTemplate}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    {t('admin.reload')}
                  </button>
                </div>
              </div>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
}
