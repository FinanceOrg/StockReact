import { Role } from "@/types/auth";
import { LoginInput } from "@/validators/auth.schema";

type LoginUser = {
  id: number | string;
  preferredCurrency?: string;
  roles?: Role[];
};

export class AuthService {
  private baseUrl = process.env.API_BASE_URL || "";

  async login(data: LoginInput): Promise<{ token: string; user: LoginUser }> {
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

    return payload as { token: string; user: LoginUser };
  }
}

export const authService = new AuthService();
