import { cookies } from "next/headers"

interface User {
  id: string
  email: string
  name: string
  // adjust to your backend model
}

export async function getCurrentUser(): Promise<User> {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value
  const email = cookieStore.get("email")?.value

  if (!token || !email) {
    throw new Error("Unauthorized")
  }

  const backendRes = await fetch(`${process.env.API_BASE_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  })
  console.log(backendRes)

  if (!backendRes.ok) {
    throw new Error("Backend error")
  }

  const users: User[] = await backendRes.json()

  const user = users.find(u => u.email === email)

  if (!user) {
    throw new Error("User not found")
  }

  return user
}