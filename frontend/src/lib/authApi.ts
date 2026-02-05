import type { AuthSession } from "@/lib/authStorage";

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

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthSession> {
  const res = await fetch(`${apiBaseUrl}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const json = await readJson<{ data: AuthSession }>(res);
  return json.data;
}

export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<AuthSession> {
  const res = await fetch(`${apiBaseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const json = await readJson<{ data: AuthSession }>(res);
  return json.data;
}

export async function logoutUser(token: string): Promise<void> {
  await fetch(`${apiBaseUrl}/api/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function updateProfile(
  token: string,
  input: { name: string }
): Promise<{ id: number; name: string; email: string }> {
  const res = await fetch(`${apiBaseUrl}/api/auth/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  const json = await readJson<{ data: { id: number; name: string; email: string } }>(res);
  return json.data;
}

export async function changePassword(
  token: string,
  input: { current_password: string; new_password: string }
): Promise<void> {
  const res = await fetch(`${apiBaseUrl}/api/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  await readJson<{ message: string }>(res);
}