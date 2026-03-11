import { cookies } from "next/headers";

import { backendClient } from "@/lib/backend/backend.client";
import { User } from "@/types/domain";

export async function getCurrentUser(): Promise<User> {
  const cookieStore = await cookies();
  const id = cookieStore.get("id")?.value;

  if (!id) {
    backendClient.handleUnauthorized();
  }

  const backendRes = await backendClient.get(`/users/${id}`);

  if (!backendRes.ok) {
    throw new Error("Backend error");
  }

  return await backendRes.json();
}
