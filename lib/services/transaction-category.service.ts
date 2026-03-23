import { backendClient } from "@/lib/backend/backend.client";
import {
  assertResponseOk,
  getDeleteResponse,
  requireId,
  throwValidationError,
} from "@/lib/services/service.helper";
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
    const response = await backendClient.get("/transaction-categories", {
      tags: ["transaction-categories"],
    });
    await assertResponseOk(response, "Failed to fetch transaction categories");

    const categoryDTO = await response.json();

    return mapTransactionCategoryIndex(categoryDTO);
  }

  async getById(id: string): Promise<TransactionCategory> {
    requireId(id, "Transaction category");

    const response = await backendClient.get(`/transaction-categories/${id}`);
    await assertResponseOk(response, "Failed to fetch transaction category", {
      notFoundMessage: "Transaction category not found",
    });

    const categoryDTO = await response.json();

    return mapAssetCategoryShow(categoryDTO);
  }

  async create(data: unknown): Promise<TransactionCategory> {
    const parsed = createTransactionCategorySchema.safeParse(data);
    if (!parsed.success) {
      throwValidationError(parsed.error);
    }

    const response = await backendClient.post(
      "/transaction-categories",
      parsed.data,
    );

    await assertResponseOk(response, "Failed to create transaction category");

    return await response.json();
  }

  async update(id: string, data: unknown): Promise<TransactionCategory> {
    requireId(id, "Transaction category");

    const parsed = updateTransactionCategorySchema.safeParse(data);
    if (!parsed.success) {
      throwValidationError(parsed.error);
    }

    const response = await backendClient.put(
      `/transaction-categories/${id}`,
      parsed.data,
    );

    await assertResponseOk(response, "Failed to update transaction category");

    return await response.json();
  }

  async delete(id: string): Promise<DeleteResponse> {
    requireId(id, "Transaction category");

    const response = await backendClient.delete(
      `/transaction-categories/${id}`,
    );
    await assertResponseOk(response, "Failed to delete transaction category");

    return await getDeleteResponse(
      response,
      "Transaction category deleted successfully",
    );
  }
}

export const transactionCategoryService = new TransactionCategoryService();
