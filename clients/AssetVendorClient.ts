import { DeleteResponse } from "@/types/api"
import { AssetVendor } from "@/types/domain"
import { CreateVendorInput, UpdateVendorInput } from "@/validators/vendor.schema"

export class AssetVendorClient {
  private baseUrl = "/api/asset-vendors"

  private getFetchOptions(): RequestInit {
    return {
      credentials: "include", // Include cookies for authentication
    }
  }

  async index(): Promise<AssetVendor[]> {
    const res = await fetch(this.baseUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      ...this.getFetchOptions(),
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      throw new Error(error.error || "Failed to fetch vendors")
    }

    return res.json()
  }

  async show<T extends AssetVendor = AssetVendor>(id: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      ...this.getFetchOptions(),
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      throw new Error(error.error || "Vendor not found")
    }

    return res.json()
  }

  async create<T extends AssetVendor = AssetVendor>(data: CreateVendorInput): Promise<T> {
    const res = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      ...this.getFetchOptions(),
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      throw new Error(error.error || "Failed to create vendor")
    }

    return res.json()
  }

  async update<T extends AssetVendor = AssetVendor>(
    id: string,
    data: UpdateVendorInput
  ): Promise<T> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      ...this.getFetchOptions(),
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      throw new Error(error.error || "Failed to update vendor")
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
      throw new Error(error.error || "Failed to delete vendor")
    }

    return res.json()
  }
}

export const assetVendorClient = new AssetVendorClient()
