import { CreateAssetInput, UpdateAssetInput } from "@/validators/asset.schema"

export interface Asset {
  id: string
  name: string
  value: number
  currency: string
  description?: string
  userId: number
  categoryId: number
  vendorId: number
  createdAt?: string
  updatedAt?: string
}

export class AssetClient {
  private baseUrl = "/api/assets"

  async index(): Promise<Asset[]> {
    const res = await fetch(this.baseUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    if (!res.ok) throw new Error("Failed to fetch assets")
    return await res.json()
  }

  async show<T extends Asset = Asset>(id: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    if (!res.ok) throw new Error("Asset not found")
    return await res.json()
  }

  async create<T extends Asset = Asset>(data: CreateAssetInput): Promise<T> {
    const res = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || "Failed to create asset")
    }
    return await res.json()
  }

  async update<T extends Asset = Asset>(
    id: string,
    data: UpdateAssetInput
  ): Promise<T> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || "Failed to update asset")
    }
    return await res.json()
  }

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })

    if (!res.ok) throw new Error("Failed to delete asset")
    return await res.json()
  }

  async recalculate(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${this.baseUrl}/${id}/recalculate`, {
        method: "POST"
      }
    )

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || "Failed to update asset")
    }

    return await res.json()
  }
}

export const assetClient = new AssetClient()
