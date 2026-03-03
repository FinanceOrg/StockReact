export interface UserBasic {
    id: number
    name: string
}

export interface TransactionCategoryStyle {
    color: string
}

export interface AssetVendorStyle {
    image: string
    color: string
}

export type TransactionType = 'income' | 'expense'

export interface TransactionItem {
    id: number
    name: string
    amount: number
    type: TransactionType
    date: string
    categoryName?: string
}

export interface AssetVendorItem {
    id: number
    name: string
    style: AssetVendorStyle
    description?: string
}

export interface AssetCategoryStyle {
    color: string
    bgColor: string
}

export interface AssetCategory {
    id: number
    name: string
    style: AssetCategoryStyle
    description?: string
}

export interface AssetUser {
    id: number
    name: string
}

export interface Currency {
    code: string
    name: string
    symbol: string
}

export interface AssetItem {
    id: number
    name: string
    value: number
    currency: string
    categoryName: string
    vendorName: string
}

export interface Asset {
  id: number
  name: string
  value: number
  currency: Currency
  description?: string
  user: UserBasic
  assetCategory: AssetCategory
  assetVendor: AssetVendorItem
}

export interface AssetVendor {
    id: number
    name: string
    style: AssetVendorStyle
    description?: string
    assets: AssetItem[]
}

export interface TransactionCategoryItem {
    id: number
    name: string
    style: TransactionCategoryStyle
    description?: string
}

export interface TransactionCategory {
    id: number
    name: string
    style: TransactionCategoryStyle
    description?: string
    transactions: TransactionItem[]
}

export interface Transaction {
    id: number
    name: string
    amount: number
    type: TransactionType
    date: string
    assetId: number
    assetName: string
    categoryName: string
}