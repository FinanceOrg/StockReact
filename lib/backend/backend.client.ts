import { getToken } from "@/lib/api/validation"

interface BackendRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  body?: unknown
  isJson?: boolean
}

export class BackendClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.API_BASE_URL || ""
    if (!this.baseUrl) {
      throw new Error("API_BASE_URL environment variable is not set")
    }
  }

  private async getHeaders(isJson: boolean = true): Promise<HeadersInit> {
    const token = await getToken()

    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    }

    if (isJson) {
      headers["Content-Type"] = "application/json"
    }

    return headers
  }

  async request(
    endpoint: string,
    options: BackendRequestOptions = {}
  ): Promise<Response> {
    const { method = "GET", body, isJson = true } = options

    const url = `${this.baseUrl}${
      endpoint.startsWith("/") ? endpoint : `/${endpoint}`
    }`

    const headers = await this.getHeaders(isJson)

    const fetchOptions: RequestInit = {
      method,
      headers,
    }

    if (body) {
      fetchOptions.body = JSON.stringify(body)
    }

    const response = await fetch(url, fetchOptions)

    if (response.status === 401) {
      await this.handleUnauthorized()
    }

    return response
  }

  private async handleUnauthorized() {
    if (typeof window === "undefined") {
      const { redirect } = await import("next/navigation")

      redirect("/login")
    } else {
      await fetch("/api/auth/logout", { method: "POST" })
      window.location.href = "/login"
    }
  }

  async get(endpoint: string): Promise<Response> {
    return this.request(endpoint, { method: "GET" })
  }

  async post(endpoint: string, body: unknown): Promise<Response> {
    return this.request(endpoint, { method: "POST", body, isJson: true })
  }

  async put(endpoint: string, body: unknown): Promise<Response> {
    return this.request(endpoint, { method: "PUT", body, isJson: true })
  }

  async delete(endpoint: string): Promise<Response> {
    return this.request(endpoint, { method: "DELETE" })
  }

  async patch(endpoint: string, body: unknown): Promise<Response> {
    return this.request(endpoint, { method: "PATCH", body, isJson: true })
  }
}

export const backendClient = new BackendClient()