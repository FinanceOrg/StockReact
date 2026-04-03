import { DeleteResponse } from "@/types/api";
import { ID, Transaction } from "@/types/domain";
import {
  CreateTransactionInput,
  UpdateTransactionInput,
} from "@/validators/transaction.schema";

export class TransactionClient {
  private baseUrl = "/api/transactions";

  private getFetchOptions(): RequestInit {
    return {
      credentials: "include", // Include cookies for authentication
    };
  }

  async getByAssetId(
    id: ID,
    query?: { from?: string; to?: string },
  ): Promise<Transaction[]> {
    const params = new URLSearchParams();

    if (query?.from) {
      params.set("from", query.from);
    }

    if (query?.to) {
      params.set("to", query.to);
    }

    const queryString = params.toString();
    const res = await fetch(
      `/api/assets/${id}/assets${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        ...this.getFetchOptions(),
      },
    );

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || "Failed to fetch transactions");
    }

    return res.json();
  }
  async index(): Promise<Transaction[]> {
    const res = await fetch(this.baseUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      ...this.getFetchOptions(),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || "Failed to fetch transactions");
    }

    return res.json();
  }

  async show<T extends Transaction = Transaction>(id: ID): Promise<T> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      ...this.getFetchOptions(),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || "Transaction not found");
    }

    return res.json();
  }

  async create<T extends Transaction = Transaction>(
    data: CreateTransactionInput,
  ): Promise<T> {
    const res = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      ...this.getFetchOptions(),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || "Failed to create transaction");
    }

    return res.json();
  }

  async update<T extends Transaction = Transaction>(
    id: ID,
    data: UpdateTransactionInput,
  ): Promise<T> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      ...this.getFetchOptions(),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || "Failed to update transaction");
    }

    return res.json();
  }

  async delete(id: ID): Promise<DeleteResponse> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      ...this.getFetchOptions(),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || "Failed to delete transaction");
    }

    return res.json();
  }
}

export const transactionClient = new TransactionClient();
