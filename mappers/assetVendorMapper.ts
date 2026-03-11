import { AssetVendorDTO, AssetVendorShowDTO } from "@/types/backend";
import { Vendor, AssetVendor } from "@/types/domain";

export function mapAssetVendorIndex(dto: AssetVendorDTO[]): Vendor[] {
  return dto.map(mapAssetVendorIndexItem);
}

export function mapAssetVendorIndexItem(dto: AssetVendorDTO): Vendor {
  return {
    id: dto.id,
    name: dto.name,
    style: dto.style,
    description: dto.description,
  };
}

export function mapAssetVendorShow(dto: AssetVendorShowDTO): AssetVendor {
  return {
    id: dto.id,
    name: dto.name,
    style: dto.style,
    description: dto.description,

    assets: dto.assets,
  };
}
