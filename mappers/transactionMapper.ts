import { TransactionSummary } from './../types/domain';
import { TransactionIndexDTO, TransactionShowDTO } from "@/types/backend";
import { Transaction } from "@/types/domain";

export function mapTransactionIndex(dtos: TransactionIndexDTO[]): Transaction[] {
  return dtos.map(mapTransactionIndexItem);
}

export function mapTransactionIndexItem(dto: TransactionIndexDTO): TransactionSummary {
    return {
        id: dto.id,
        name: dto.name,
        amount: dto.amount,
        type: dto.type,
        date: dto.date,
        categoryName: dto.categoryName
    }
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
        categoryName: dto.categoryName
    }
}