import { cookies } from "next/headers";

import { backendClient } from "@/lib/backend/backend.client";
import {
  assertResponseOk,
  getDeleteResponse,
  requireId,
  throwValidationError,
} from "@/lib/services/service.helper";
import { mapUserIndex, mapUserShow } from "@/mappers/userMapper";
import { DeleteResponse } from "@/types/api";
import { User } from "@/types/domain";
import { createUserSchema, updateUserSchema } from "@/validators/user.schema";

export class UserService {
  async getAll(): Promise<User[]> {
    const response = await backendClient.get("/users", {
      tags: ["users"],
    });
    await assertResponseOk(response, "Failed to fetch users");

    const usersDTO = await response.json();

    return mapUserIndex(usersDTO);
  }

  async getById(id: string): Promise<User> {
    requireId(id, "User");

    const response = await backendClient.get(`/users/${id}`);
    await assertResponseOk(response, "Failed to fetch user", {
      notFoundMessage: "User not found",
    });

    const userDTO = await response.json();

    return mapUserShow(userDTO);
  }

  async create(data: unknown): Promise<User> {
    const parsed = createUserSchema.safeParse(data);
    if (!parsed.success) {
      throwValidationError(parsed.error);
    }

    const response = await backendClient.post("/users", parsed.data);
    await assertResponseOk(response, "Failed to create user");

    const userDTO = await response.json();

    return mapUserShow(userDTO);
  }

  async update(id: string, data: unknown): Promise<User> {
    requireId(id, "User");

    const parsed = updateUserSchema.safeParse(data);
    if (!parsed.success) {
      throwValidationError(parsed.error);
    }

    const payload = {
      ...parsed.data,
      password: parsed.data.password || undefined,
    };

    const response = await backendClient.patch(`/users/${id}`, payload);

    await assertResponseOk(response, "Failed to update user");

    const userDTO = await response.json();

    return mapUserShow(userDTO);
  }

  async delete(id: string): Promise<DeleteResponse> {
    requireId(id, "User");

    const response = await backendClient.delete(`/users/${id}`);
    await assertResponseOk(response, "Failed to delete user");

    return await getDeleteResponse(response, "User deleted successfully");
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
