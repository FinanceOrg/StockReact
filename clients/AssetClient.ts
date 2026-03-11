import { DeleteResponse } from "@/types/api"
import { Asset } from "@/types/domain"
import { CreateAssetInput, UpdateAssetInput } from "@/validators/asset.schema"

export class AssetClient {
  private baseUrl = "/api/assets"

  private getFetchOptions(): RequestInit {
    return {
      credentials: "include", // Include cookies for authentication
    }
  }

  async index(): Promise<Asset[]> {
    const res = await fetch(this.baseUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      ...this.getFetchOptions(),
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      throw new Error(error.error || "Failed to fetch assets")
    }

    return res.json()
  }

  async show<T extends Asset = Asset>(id: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      ...this.getFetchOptions(),
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      throw new Error(error.error || "Asset not found")
    }

    return res.json()
  }

  async create<T extends Asset = Asset>(data: CreateAssetInput): Promise<T> {
    const res = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      ...this.getFetchOptions(),
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      throw new Error(error.error || "Failed to create asset")
    }

    return res.json()
  }

  async update<T extends Asset = Asset>(
    id: string,
    data: UpdateAssetInput
  ): Promise<T> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      ...this.getFetchOptions(),
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      throw new Error(error.error || "Failed to update asset")
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
      throw new Error(error.error || "Failed to delete asset")
    }

    return res.json()
  }

  async recalculate(id: string): Promise<{message: string}> {
    const res = await fetch(`${this.baseUrl}/${id}/recalculate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      ...this.getFetchOptions(),
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      throw new Error(error.error || "Failed to recalculate asset")
    }

    return res.json()
  }
}

export const assetClient = new AssetClient()
