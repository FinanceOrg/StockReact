import { cookies } from "next/headers"
import { getToken } from "../api/validation"
import { backendClient } from "../backend/backend.client"

interface Currency {
  code: string
  name: string
  symbol: string
}

interface User {
  id: string
  email: string
  name: string
  totalValue: number
  preferedCurrency: Currency
}

export async function getCurrentUser(): Promise<User> {
  const cookieStore = await cookies()
  const token = await getToken()
  const id = cookieStore.get("id")?.value

  if (!id) {
    backendClient.handleUnauthorized()
  }

  const backendRes = await backendClient.get(`/users/${id}`)

  if (!backendRes.ok) {
    throw new Error("Backend error")
  }

  return await backendRes.json()
}