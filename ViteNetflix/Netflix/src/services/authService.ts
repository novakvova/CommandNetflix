const API_URL = import.meta.env.VITE_API_URL;

export async function register(data: { email: string; password: string; confirmPassword: string }) {
  const res = await fetch(`${API_URL}/Auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Registration failed");
  }

  return res.json(); // очікуємо { token: "...", ... } або інший респонс від бекенду
}

export async function login(data: { login: string; password: string }) {
  const res = await fetch(`${API_URL}/Auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function getMe() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/Auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}
