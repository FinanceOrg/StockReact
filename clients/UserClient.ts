import { DeleteResponse } from "@/types/api";
import { User } from "@/types/domain";
import { CreateUserInput, UpdateUserInput } from "@/validators/user.schema";

export class UserClient {
  private baseUrl = "/api/users";

  private getFetchOptions(): RequestInit {
    return {
      credentials: "include",
    };
  }

  async index(): Promise<User[]> {
    const res = await fetch(this.baseUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      ...this.getFetchOptions(),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || "Failed to fetch users");
    }

    return res.json();
  }

  async show<T extends User = User>(id: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      ...this.getFetchOptions(),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || "User not found");
    }

    return res.json();
  }

  async create<T extends User = User>(data: CreateUserInput): Promise<T> {
    const res = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      ...this.getFetchOptions(),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || "Failed to create user");
    }

    return res.json();
  }

  async update<T extends User = User>(
    id: string,
    data: UpdateUserInput,
  ): Promise<T> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      ...this.getFetchOptions(),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || "Failed to update user");
    }

    return res.json();
  }

  async delete(id: string): Promise<DeleteResponse> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      ...this.getFetchOptions(),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || "Failed to delete user");
    }

    return res.json();
  }
}

export const userClient = new UserClient();
