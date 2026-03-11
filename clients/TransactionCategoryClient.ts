import { DeleteResponse } from "@/types/api";
import { TransactionCategory } from "@/types/domain";
import { CreateTransactionCategoryInput, UpdateTransactionCategoryInput } from "@/validators/transaction-category.schema";

export class TransactionCategoryClient {
  private baseUrl = "/api/transaction-categories";

  private getFetchOptions(): RequestInit {
    return {
      credentials: "include", // Include cookies for authentication
    };
  }

  async index(): Promise<TransactionCategory[]> {
    const res = await fetch(this.baseUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      ...this.getFetchOptions(),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || "Failed to fetch transaction categories");
    }

    return res.json();
  }

  async show<T extends TransactionCategory = TransactionCategory>(id: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      ...this.getFetchOptions(),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || "Transaction category not found");
    }

    return res.json();
  }

  async create<T extends TransactionCategory = TransactionCategory>(
    data: CreateTransactionCategoryInput
  ): Promise<T> {
    const res = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      ...this.getFetchOptions(),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || "Failed to create transaction category");
    }

    return res.json();
  }

  async update<T extends TransactionCategory = TransactionCategory>(
    id: string,
    data: UpdateTransactionCategoryInput
  ): Promise<T> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      ...this.getFetchOptions(),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || "Failed to update transaction category");
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
      throw new Error(error.error || "Failed to delete transaction category");
    }

    return res.json();
  }
}

export const transactionCategoryClient = new TransactionCategoryClient();
