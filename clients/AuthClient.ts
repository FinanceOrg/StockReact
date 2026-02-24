import { LoginInput } from "@/validators/auth.schema"

export class AuthClient {
  private baseUrl = '/api/auth'

  async login<T>(data: LoginInput): Promise<T> {
    const res = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) throw new Error(res.status === 401 ? 'Invalid email or password' : 'Something went wrong!')
    return res.json()
  }

  async logout() {
    const res = await fetch(`${this.baseUrl}/logout`, {
      method: "POST",
    })

    if (!res.ok) {
      throw new Error("Logout failed")
    }

    return res.json()
  }
}

export const authClient = new AuthClient()