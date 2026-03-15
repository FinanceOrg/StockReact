import { TransactionIndexDTO, TransactionShowDTO } from "@/types/backend";
import { TransactionCategory, TransactionSummary } from "@/types/domain";
import { Transaction } from "@/types/domain";

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
  const result: TransactionSummary = {
    id: dto.id,
    name: dto.name,
    amount: dto.amount,
    type: dto.type,
    date: dto.date,
    categoryName: dto.categoryName,
  };

  const category =
    categoryDTO.find((x) => x.name === result.categoryName) || null;

  if (categoryDTO && category) {
    result.categoryId = category.id;
  }

  return result;
}

export function mapTransactionShow(dto: TransactionShowDTO): Transaction {
  return {
    id: dto.id,
    name: dto.name,
    amount: dto.amount,
    type: dto.type,
    date: dto.date,
    assetId: dto.assetId,
    assetName: dto.assetName,
    categoryName: dto.categoryName,
  };
}
