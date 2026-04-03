import { TransactionIndexDTO, TransactionShowDTO } from "@/types/backend";
import { TransactionCategory, TransactionSummary } from "@/types/domain";
import { Transaction } from "@/types/domain";

function getCategoryIdByName(
  categoryName: string | undefined,
  categories: TransactionCategory[] = [],
): number | undefined {
  if (!categoryName) {
    return undefined;
  }

  const category = categories.find((x) => x.name === categoryName);

  return category?.id;
}

export function mapTransactionIndex(
  dtos: TransactionIndexDTO[],
  categoryDTO: TransactionCategory[] = [],
): TransactionSummary[] {
  return dtos.map((dto) => mapTransactionIndexItem(dto, categoryDTO));
}

export function mapTransactionIndexItem(
  dto: TransactionIndexDTO,
  categoryDTO: TransactionCategory[] = [],
): TransactionSummary {
  const categoryId = getCategoryIdByName(dto.categoryName, categoryDTO);

  const result: TransactionSummary = {
    id: dto.id,
    name: dto.name,
    amount: dto.amount,
    type: dto.type,
    date: dto.date,
    categoryName: dto.categoryName,
    categoryId,
  };

  return result;
}

export function mapTransactionShow(
  dto: TransactionShowDTO,
  categories: TransactionCategory[] = [],
): Transaction {
  const categoryId = getCategoryIdByName(dto.categoryName, categories);

  return {
    id: dto.id,
    name: dto.name,
    amount: dto.amount,
    type: dto.type,
    date: dto.date,
    assetId: dto.assetId,
    assetName: dto.assetName,
    categoryName: dto.categoryName,
    categoryId,
  };
}
