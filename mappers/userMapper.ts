import { UserIndexDTO, UserShowDTO } from "@/types/backend";
import { User } from "@/types/domain";

export function mapUserIndex(dto: UserIndexDTO[]): User[] {
  return dto.map(mapUserIndexItem);
}

export function mapUserIndexItem(dto: UserIndexDTO): User {
  return {
    id: dto.id,
    name: dto.name,
    email: dto.email,
    totalValue: dto.totalValue,
  };
}

export function mapUserShow(dto: UserShowDTO): User {
  return {
    id: dto.id,
    name: dto.name,
    email: dto.email,
    totalValue: dto.totalValue,
    preferredCurrency: dto.preferredCurrency,
    assets: dto.assets,
  };
}
