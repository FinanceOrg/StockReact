import { AssetIndexDTO, AssetShowDTO } from "@/types/backend";
import { Asset } from "@/types/domain";

export function mapAssetIndex(dtos: AssetIndexDTO[]): Asset[] {
  return dtos.map(mapAssetIndexItem);
}

export function mapAssetIndexItem(dto: AssetIndexDTO): Asset {
  return {
    id: dto.id,
    name: dto.name,
    value: dto.value,
    currency: dto.currency,
    description: dto.description,

    user: dto.user,
    category: dto.category,
    vendor: dto.vendor,
  };
}

export function mapAssetShow(dto: AssetShowDTO): Asset {
  return {
    id: dto.id,
    name: dto.name,
    value: dto.value,
    description: dto.description,

    currency: dto.currency,
    user: dto.user,
    category: dto.assetCategory,
    vendor: dto.assetVendor,
  };
}
