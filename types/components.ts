import { AssetCategory, AssetItem, AssetVendor } from "./domain"

export interface StockCardDTO {
    asset: AssetItem
    vendor: AssetVendor
    category: AssetCategory
}