import { cookies } from "next/headers"
import { getToken } from "../api/validation"

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
  const email = cookieStore.get("email")?.value

  if (!email) {
    throw new Error("Unauthorized")
  }

  const backendRes = await fetch(`${process.env.API_BASE_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  })

  if (!backendRes.ok) {
    throw new Error("Backend error")
  }

  const users: User[] = await backendRes.json()

  const user = users.find(u => u.email === email)

  if (!user) {
    throw new Error("User not found")
  }

    const response = await fetch(`${process.env.API_BASE_URL}/users/${user.id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  })

  return await response.json()
}