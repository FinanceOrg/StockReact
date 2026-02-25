import { CreateCategoryInput, UpdateCategoryInput } from "@/validators/category.schema"

export interface Category {
  id: string
  name: string
  style: {
    color: string
    icon: string
  }
  description?: string
  userId: number
  createdAt?: string
  updatedAt?: string
}

export class AssetCategoryClient {
  private baseUrl = "/api/asset-categories"

  async index(): Promise<Category[]> {
    const res = await fetch(this.baseUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    if (!res.ok) throw new Error("Failed to fetch categories")
    return await res.json()
  }

  async show<T extends Category = Category>(id: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    if (!res.ok) throw new Error("Category not found")
    return await res.json()
  }

  async create<T extends Category = Category>(
    data: CreateCategoryInput
  ): Promise<T> {
    const res = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || "Failed to create category")
    }
    return await res.json()
  }

  async update<T extends Category = Category>(
    id: string,
    data: UpdateCategoryInput
  ): Promise<T> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || "Failed to update category")
    }
    return await res.json()
  }

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })

    if (!res.ok) throw new Error("Failed to delete category")
    return await res.json()
  }
}

export const assetCategoryClient = new AssetCategoryClient()
