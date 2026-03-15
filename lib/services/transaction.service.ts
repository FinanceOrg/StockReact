import { backendClient } from "@/lib/backend/backend.client";
import { transactionCategoryService } from "@/lib/services/transaction-category.service";
import { mapTransactionIndex } from "@/mappers/transactionMapper";
import { DeleteResponse } from "@/types/api";
import { Transaction } from "@/types/domain";
import {
  createTransactionSchema,
  updateTransactionSchema,
} from "@/validators/transaction.schema";

export class TransactionService {
  async getByAssetId(id: string | number): Promise<Transaction[]> {
    if (!id) {
      throw new Error("Transaction ID is required");
    }

    const [transactionResponse, categories] = await Promise.all([
      backendClient.get(`/assets/${id}/transactions`),
      transactionCategoryService.getAll(),
    ]);

    if (!transactionResponse.ok) {
      if (transactionResponse.status === 404) {
        throw new Error("Transaction not found");
      }

      throw new Error(
        `Failed to fetch transaction: ${transactionResponse.status}`,
      );
    }

    const transactionsDTO = await transactionResponse.json();

    const transactions = mapTransactionIndex(transactionsDTO, categories);

    return transactions;
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

    const result = await response.json();

    return result;
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
