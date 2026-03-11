import { TransactionCategoryDTO, TransactionCategoryShowDTO, } from "@/types/backend";
import { TransactionCategory } from "@/types/domain";

export function mapTransactionCategoryIndex(dtos: TransactionCategoryDTO[]): TransactionCategory[] {
  return dtos.map(mapTransactionCategoryIndexItem);
}

export function mapTransactionCategoryIndexItem(dto: TransactionCategoryDTO): TransactionCategory {
    return mapTransactionCategoryShow(dto);
}

export function mapTransactionCategoryShow(dto: TransactionCategoryShowDTO | TransactionCategoryDTO): TransactionCategory {
    return {
        id: dto.id,
        name: dto.name,
        style: dto.style,
        description: dto.description,
    };
}