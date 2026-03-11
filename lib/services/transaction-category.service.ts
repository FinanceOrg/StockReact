import { backendClient } from "@/lib/backend/backend.client";
import { mapAssetCategoryShow } from "@/mappers/assetCategoryMapper";
import { mapTransactionCategoryIndex } from "@/mappers/transactionCategoryMapper";
import { DeleteResponse } from "@/types/api";
import { TransactionCategory } from "@/types/domain";
import {
  createTransactionCategorySchema,
  updateTransactionCategorySchema,
} from "@/validators/transaction-category.schema";

export class TransactionCategoryService {
  async getAll(): Promise<TransactionCategory[]> {
    const response = await backendClient.get("/transaction-categories");

    if (!response.ok) {
      throw new Error(
        `Failed to fetch transaction categories: ${response.status}`
      );
    }

    const categoryDTO = await response.json();

    return mapTransactionCategoryIndex(categoryDTO);
  }

  async getById(id: string): Promise<TransactionCategory> {
    if (!id) {
      throw new Error("Transaction category ID is required");
    }

    const response = await backendClient.get(`/transaction-categories/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Transaction category not found");
      }
      throw new Error(
        `Failed to fetch transaction category: ${response.status}`
      );
    }

    const categoryDTO = await response.json();

    return mapAssetCategoryShow(categoryDTO);
  }

  async create(data: unknown): Promise<TransactionCategory> {
    const parsed = createTransactionCategorySchema.safeParse(data);
    if (!parsed.success) {
      const errors = parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");
      throw new Error(`Validation failed: ${errors}`);
    }

    const response = await backendClient.post(
      "/transaction-categories",
      parsed.data
    );

    if (!response.ok) {
      let errorMessage = `Failed to create transaction category: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  }

  async update(id: string, data: unknown): Promise<TransactionCategory> {
    if (!id) {
      throw new Error("Transaction category ID is required");
    }

    const parsed = updateTransactionCategorySchema.safeParse(data);
    if (!parsed.success) {
      const errors = parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");
      throw new Error(`Validation failed: ${errors}`);
    }

    const response = await backendClient.put(
      `/transaction-categories/${id}`,
      parsed.data
    );

    if (!response.ok) {
      let errorMessage = `Failed to update transaction category: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  }

  async delete(id: string): Promise<DeleteResponse> {
    if (!id) {
      throw new Error("Transaction category ID is required");
    }

    const response = await backendClient.delete(
      `/transaction-categories/${id}`
    );

    if (!response.ok) {
      let errorMessage = `Failed to delete transaction category: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        
      }
      throw new Error(errorMessage);
    }

    try {
      return await response.json();
    } catch {
      return {
        success: true,
        message: "Transaction category deleted successfully",
      };
    }
  }
}

export const transactionCategoryService = new TransactionCategoryService();
