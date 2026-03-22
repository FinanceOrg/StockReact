import { cookies } from "next/headers";

import { backendClient } from "@/lib/backend/backend.client";
import { mapUserIndex, mapUserShow } from "@/mappers/userMapper";
import { DeleteResponse } from "@/types/api";
import { User } from "@/types/domain";
import { createUserSchema, updateUserSchema } from "@/validators/user.schema";

export class UserService {
  async getAll(): Promise<User[]> {
    const response = await backendClient.get("/users", {
      tags: ["users"],
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.status}`);
    }

    const usersDTO = await response.json();

    return mapUserIndex(usersDTO);
  }

  async getById(id: string): Promise<User> {
    if (!id) {
      throw new Error("User ID is required");
    }

    const response = await backendClient.get(`/users/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("User not found");
      }

      throw new Error(`Failed to fetch user: ${response.status}`);
    }

    const userDTO = await response.json();

    return mapUserShow(userDTO);
  }

  async create(data: unknown): Promise<User> {
    const parsed = createUserSchema.safeParse(data);
    if (!parsed.success) {
      const errors = parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");
      throw new Error(`Validation failed: ${errors}`);
    }

    const response = await backendClient.post("/users", parsed.data);

    if (!response.ok) {
      let errorMessage = `Failed to create user: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {}
      throw new Error(errorMessage);
    }

    const userDTO = await response.json();

    return mapUserShow(userDTO);
  }

  async update(id: string, data: unknown): Promise<User> {
    if (!id) {
      throw new Error("User ID is required");
    }

    const parsed = updateUserSchema.safeParse(data);
    if (!parsed.success) {
      const errors = parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");
      throw new Error(`Validation failed: ${errors}`);
    }

    const payload = {
      ...parsed.data,
      password: parsed.data.password || undefined,
    };

    const response = await backendClient.patch(`/users/${id}`, payload);

    if (!response.ok) {
      let errorMessage = `Failed to update user: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {}
      throw new Error(errorMessage);
    }

    const userDTO = await response.json();

    return mapUserShow(userDTO);
  }

  async delete(id: string): Promise<DeleteResponse> {
    if (!id) {
      throw new Error("User ID is required");
    }

    const response = await backendClient.delete(`/users/${id}`);

    if (!response.ok) {
      let errorMessage = `Failed to delete user: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {}
      throw new Error(errorMessage);
    }

    try {
      return await response.json();
    } catch {
      return { success: true, message: "User deleted successfully" };
    }
  }

  async getCurrentUser(): Promise<User> {
    const cookieStore = await cookies();
    const id = cookieStore.get("id")?.value;

    if (!id) {
      await backendClient.handleUnauthorized();
      throw new Error("Unauthorized");
    }

    return await this.getById(id);
  }
}

export const userService = new UserService();
