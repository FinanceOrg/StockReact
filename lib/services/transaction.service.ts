import { backendClient } from "@/lib/backend/backend.client";
import {
  assertResponseOk,
  getDeleteResponse,
  requireId,
  throwValidationError,
} from "@/lib/services/service.helper";
import { transactionCategoryService } from "@/lib/services/transaction-category.service";
import {
  mapTransactionIndex,
  mapTransactionShow,
} from "@/mappers/transactionMapper";
import { DeleteResponse } from "@/types/api";
import { Transaction } from "@/types/domain";
import {
  createTransactionSchema,
  updateTransactionSchema,
} from "@/validators/transaction.schema";

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const parseDateKey = (value?: string): Date | null => {
  if (!value || !DATE_KEY_PATTERN.test(value)) {
    return null;
  }

  const [yearRaw, monthRaw, dayRaw] = value.split("-");
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  const day = Number(dayRaw);

  const parsed = new Date(year, month - 1, day);

  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  return parsed;
};

const toDateKey = (value: Date) => {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export class TransactionService {
  async getByAssetId(
    id: string | number,
    query?: { from?: string; to?: string },
  ): Promise<Transaction[]> {
    requireId(id, "Transaction");

    const today = new Date();
    const todayDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const todayKey = toDateKey(todayDate);

    let normalizedFrom = query?.from;
    let normalizedTo = query?.to;

    const parsedFrom = parseDateKey(normalizedFrom);
    const parsedTo = parseDateKey(normalizedTo);

    if (normalizedFrom && !parsedFrom) {
      normalizedFrom = undefined;
    }

    if (normalizedTo && !parsedTo) {
      normalizedTo = undefined;
    }

    if (parsedTo && parsedTo > todayDate) {
      normalizedTo = todayKey;
    }

    const effectiveFrom = parseDateKey(normalizedFrom);
    const effectiveTo = parseDateKey(normalizedTo);

    if (effectiveFrom && effectiveTo && effectiveFrom > effectiveTo) {
      normalizedFrom = undefined;
    }

    const params = new URLSearchParams();

    if (normalizedFrom) {
      params.set("from", normalizedFrom);
    }

    if (normalizedTo) {
      params.set("to", normalizedTo);
    }

    const queryString = params.toString();
    const endpoint = `/assets/${id}/transactions${
      queryString ? `?${queryString}` : ""
    }`;

    const [transactionResponse, categories] = await Promise.all([
      backendClient.get(endpoint),
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

    const [response, categories] = await Promise.all([
      backendClient.get(`/transactions/${id}`),
      transactionCategoryService.getAll(),
    ]);

    await assertResponseOk(response, "Failed to fetch transaction", {
      notFoundMessage: "Transaction not found",
    });

    const transactionDTO = await response.json();

    return mapTransactionShow(transactionDTO, categories);
  }

  async create(data: unknown): Promise<Transaction> {
    const parsed = createTransactionSchema.safeParse(data);

    if (!parsed.success) {
      throwValidationError(parsed.error);
    }

    const [response, categories] = await Promise.all([
      backendClient.post("/transactions", parsed.data),
      transactionCategoryService.getAll(),
    ]);

    await assertResponseOk(response, "Failed to create transaction");

    const transactionDTO = await response.json();

    return mapTransactionShow(transactionDTO, categories);
  }

  async update(id: string, data: unknown): Promise<Transaction> {
    requireId(id, "Transaction");

    const parsed = updateTransactionSchema.safeParse(data);
    if (!parsed.success) {
      throwValidationError(parsed.error);
    }

    const [response, categories] = await Promise.all([
      backendClient.patch(`/transactions/${id}`, parsed.data),
      transactionCategoryService.getAll(),
    ]);

    await assertResponseOk(response, "Failed to update transaction");

    const transactionDTO = await response.json();

    return mapTransactionShow(transactionDTO, categories);
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
