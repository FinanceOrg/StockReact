import { DeleteResponse } from "@/types/api"
import { AssetCategory } from "@/types/domain"
import { CreateCategoryInput, UpdateCategoryInput } from "@/validators/category.schema"

export class AssetCategoryClient {
  private baseUrl = "/api/asset-categories"

  private getFetchOptions(): RequestInit {
    return {
      credentials: "include", // Include cookies for authentication
    }
  }

  async index(): Promise<AssetCategory[]> {
    const res = await fetch(this.baseUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      ...this.getFetchOptions(),
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      throw new Error(error.error || "Failed to fetch categories")
    }

    return res.json()
  }

  async show<T extends AssetCategory = AssetCategory>(id: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      ...this.getFetchOptions(),
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      throw new Error(error.error || "Category not found")
    }

    return res.json()
  }

  async create<T extends AssetCategory = AssetCategory>(
    data: CreateCategoryInput
  ): Promise<T> {
    const res = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      ...this.getFetchOptions(),
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      throw new Error(error.error || "Failed to create category")
    }

    return res.json()
  }

  async update<T extends AssetCategory = AssetCategory>(
    id: string,
    data: UpdateCategoryInput
  ): Promise<T> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      ...this.getFetchOptions(),
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      throw new Error(error.error || "Failed to update category")
    }

    return res.json()
  }

  async delete(id: string): Promise<DeleteResponse> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      ...this.getFetchOptions(),
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      throw new Error(error.error || "Failed to delete category")
    }

    return res.json()
  }
}

export const assetCategoryClient = new AssetCategoryClient()
