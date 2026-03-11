import { backendClient } from "@/lib/backend/backend.client";
import { DeleteResponse } from "@/types/api";
import { Transaction } from "@/types/domain";
import {
  createTransactionSchema,
  updateTransactionSchema,
} from "@/validators/transaction.schema";

export class TransactionService {
  async getByAssetId(id: string | number): Promise<Transaction[]> {
    const response = await backendClient.get(`assets/${id}/transactions`);

    if (!response.ok) {
      throw new Error(`Failed to fetch transactions: ${response.status}`);
    }

    return await response.json();
  }

  async getById(id: string): Promise<Transaction> {
    if (!id) {
      throw new Error("Transaction ID is required");
    }

    const response = await backendClient.get(`/transactions/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Transaction not found");
      }
      throw new Error(`Failed to fetch transaction: ${response.status}`);
    }

    return await response.json();
  }

  async create(data: unknown): Promise<Transaction> {
    const parsed = createTransactionSchema.safeParse(data);
    if (!parsed.success) {
      const errors = parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");
      throw new Error(`Validation failed: ${errors}`);
    }

    const response = await backendClient.post("/transactions", parsed.data);

    if (!response.ok) {
      let errorMessage = `Failed to create transaction: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {}
      throw new Error(errorMessage);
    }

    return await response.json();
  }

  async update(id: string, data: unknown): Promise<Transaction> {
    if (!id) {
      throw new Error("Transaction ID is required");
    }
    console.log("data", data);
    const parsed = updateTransactionSchema.safeParse(data);
    if (!parsed.success) {
      const errors = parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");
      throw new Error(`Validation failed: ${errors}`);
    }

    const response = await backendClient.patch(
      `/transactions/${id}`,
      parsed.data,
    );

    if (!response.ok) {
      let errorMessage = `Failed to update transaction: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {}
      throw new Error(errorMessage);
    }

    return await response.json();
  }

  async delete(id: string): Promise<DeleteResponse> {
    if (!id) {
      throw new Error("Transaction ID is required");
    }

    const response = await backendClient.delete(`/transactions/${id}`);

    if (!response.ok) {
      let errorMessage = `Failed to delete transaction: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {}
      throw new Error(errorMessage);
    }

    try {
      return await response.json();
    } catch {
      return { success: true, message: "Transaction deleted successfully" };
    }
  }
}

export const transactionService = new TransactionService();
