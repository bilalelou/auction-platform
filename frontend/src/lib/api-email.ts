import type { EmailTemplate, UpdateEmailTemplateInput } from "@/lib/types";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ||
  "http://localhost:8000";

async function readJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return (await res.json()) as T;
}

// Email Templates API
export async function fetchEmailTemplates(
  adminToken: string
): Promise<EmailTemplate[]> {
  const res = await fetch(`${apiBaseUrl}/api/admin/email-templates`, {
    cache: "no-store",
    headers: {
      "X-Admin-Token": adminToken,
    },
  });
  const json = await readJson<{ data: EmailTemplate[] }>(res);
  return json.data;
}

export async function fetchEmailTemplate(
  key: string,
  adminToken: string
): Promise<EmailTemplate> {
  const res = await fetch(
    `${apiBaseUrl}/api/admin/email-templates/${key}`,
    {
      cache: "no-store",
      headers: {
        "X-Admin-Token": adminToken,
      },
    }
  );
  const json = await readJson<{ data: EmailTemplate }>(res);
  return json.data;
}

export async function updateEmailTemplate(
  key: string,
  data: UpdateEmailTemplateInput,
  adminToken: string
): Promise<EmailTemplate> {
  const res = await fetch(
    `${apiBaseUrl}/api/admin/email-templates/${key}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Token": adminToken,
      },
      body: JSON.stringify(data),
    }
  );
  const json = await readJson<{ data: EmailTemplate }>(res);
  return json.data;
}

export async function toggleEmailTemplate(
  key: string,
  adminToken: string
): Promise<EmailTemplate> {
  const res = await fetch(
    `${apiBaseUrl}/api/admin/email-templates/${key}/toggle`,
    {
      method: "POST",
      headers: {
        "X-Admin-Token": adminToken,
      },
    }
  );
  const json = await readJson<{ data: EmailTemplate }>(res);
  return json.data;
}
