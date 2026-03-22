import { LoginInput } from "@/validators/auth.schema";

export class AuthService {
  private baseUrl = process.env.API_BASE_URL || "";

  async login(
    data: LoginInput,
  ): Promise<{ token: string; user: { id: string } }> {
    if (!this.baseUrl) {
      throw new Error("API_BASE_URL environment variable is not set");
    }

    const backendRes = await fetch(`${this.baseUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!backendRes.ok) {
      if (backendRes.status === 401) {
        throw new Error("Invalid credentials");
      }

      throw new Error(`Failed to login: ${backendRes.status}`);
    }

    const payload = await backendRes.json();

    if (!payload?.token || !payload?.user?.id) {
      throw new Error("Invalid login response from backend");
    }

    return payload;
  }
}

export const authService = new AuthService();
