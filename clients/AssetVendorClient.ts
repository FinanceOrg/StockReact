import { CreateVendorInput, UpdateVendorInput } from "@/validators/vendor.schema"

export interface Vendor {
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

export class AssetVendorClient {
  private baseUrl = "/api/asset-vendors"

  async index(): Promise<Vendor[]> {
    const res = await fetch(this.baseUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    if (!res.ok) throw new Error("Failed to fetch vendors")
    return await res.json()
  }

  async show<T extends Vendor = Vendor>(id: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    if (!res.ok) throw new Error("Vendor not found")
    return await res.json()
  }

  async create<T extends Vendor = Vendor>(data: CreateVendorInput): Promise<T> {
    const res = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || "Failed to create vendor")
    }
    return await res.json()
  }

  async update<T extends Vendor = Vendor>(
    id: string,
    data: UpdateVendorInput
  ): Promise<T> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || "Failed to update vendor")
    }
    return await res.json()
  }

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })

    if (!res.ok) throw new Error("Failed to delete vendor")
    return await res.json()
  }
}

export const assetVendorClient = new AssetVendorClient()
