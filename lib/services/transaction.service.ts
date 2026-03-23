import { backendClient } from "@/lib/backend/backend.client";
import {
  assertResponseOk,
  getDeleteResponse,
  requireId,
  throwValidationError,
} from "@/lib/services/service.helper";
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
    requireId(id, "Transaction");

    const [transactionResponse, categories] = await Promise.all([
      backendClient.get(`/assets/${id}/transactions`),
      transactionCategoryService.getAll(),
    ]);

    await assertResponseOk(transactionResponse, "Failed to fetch transaction", {
      notFoundMessage: "Transaction not found",
    });

    const transactionsDTO = await transactionResponse.json();

    const transactions = mapTransactionIndex(transactionsDTO, categories);

    return transactions;
  }

  async getById(id: string): Promise<Transaction> {
    requireId(id, "Transaction");

    const response = await backendClient.get(`/transactions/${id}`);
    await assertResponseOk(response, "Failed to fetch transaction", {
      notFoundMessage: "Transaction not found",
    });

    return await response.json();
  }

  async create(data: unknown): Promise<Transaction> {
    const parsed = createTransactionSchema.safeParse(data);
    if (!parsed.success) {
      throwValidationError(parsed.error);
    }

    const response = await backendClient.post("/transactions", parsed.data);
    await assertResponseOk(response, "Failed to create transaction");

    return await response.json();
  }

  async update(id: string, data: unknown): Promise<Transaction> {
    requireId(id, "Transaction");

    const parsed = updateTransactionSchema.safeParse(data);
    if (!parsed.success) {
      throwValidationError(parsed.error);
    }

    const response = await backendClient.patch(
      `/transactions/${id}`,
      parsed.data,
    );

    await assertResponseOk(response, "Failed to update transaction");

    const result = await response.json();

    return result;
  }

  async delete(id: string): Promise<DeleteResponse> {
    requireId(id, "Transaction");

    const response = await backendClient.delete(`/transactions/${id}`);
    await assertResponseOk(response, "Failed to delete transaction");

    return await getDeleteResponse(
      response,
      "Transaction deleted successfully",
    );
  }
}

export const transactionService = new TransactionService();
