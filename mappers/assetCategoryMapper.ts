import { AssetCategoryDTO, AssetCategoryShowDTO } from "@/types/backend";
import { Category } from "@/types/domain";

export function mapAssetCategoryIndex(dto: AssetCategoryDTO[]): Category[] {
  return dto.map(mapAssetCategoryIndexItem);
}

export function mapAssetCategoryIndexItem(dto: AssetCategoryDTO): Category {
  return mapAssetCategoryShow(dto);
}

export function mapAssetCategoryShow(dto: AssetCategoryShowDTO): Category {
  return {
    id: dto.id,
    name: dto.name,
    style: dto.style,
    description: dto.description,
  };
}
