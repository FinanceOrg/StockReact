import { backendClient } from "@/lib/backend/backend.client"
import { DeleteResponse } from "@/types/api"
import { Asset } from "@/types/domain"
import {
  createAssetSchema,
  updateAssetSchema,
} from "@/validators/asset.schema"

import { mapAssetIndex, mapAssetShow } from "@/mappers/assetMapper"

export class AssetService {
  async getAll(): Promise<Asset[]> {
    const response = await backendClient.get("/assets")
    const assetsDTO = await response.json()
    const assets = mapAssetIndex(assetsDTO)

    return assets
  }

  async getById(id: string | number): Promise<Asset> {
    if (!id) {
      throw new Error("Asset ID is required")
    }

    const response = await backendClient.get(`/assets/${id}`)

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Asset not found")
      }
      throw new Error(`Failed to fetch asset: ${response.status}`)
    }
    const assetDTO = await response.json()

    return mapAssetShow(assetDTO)
  }

  async create(data: unknown): Promise<Asset> {
    const parsed = createAssetSchema.safeParse(data)
    if (!parsed.success) {
      const errors = parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ")
      throw new Error(`Validation failed: ${errors}`)
    }

    const response = await backendClient.post("/assets", parsed.data)

    if (!response.ok) {
      let errorMessage = `Failed to create asset: ${response.status}`
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
      } catch {
        
      }
      throw new Error(errorMessage)
    }

    return await response.json()
  }

  async update(id: string, data: unknown): Promise<Asset> {
    if (!id) {
      throw new Error("Asset ID is required")
    }

    const parsed = updateAssetSchema.safeParse(data)
    if (!parsed.success) {
      const errors = parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ")
      throw new Error(`Validation failed: ${errors}`)
    }

    const response = await backendClient.put(`/assets/${id}`, parsed.data)

    if (!response.ok) {
      let errorMessage = `Failed to update asset: ${response.status}`
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
      } catch {
        
      }
      throw new Error(errorMessage)
    }

    return await response.json()
  }

  async delete(id: string): Promise<DeleteResponse> {
    if (!id) {
      throw new Error("Asset ID is required")
    }

    const response = await backendClient.delete(`/assets/${id}`)

    if (!response.ok) {
      let errorMessage = `Failed to delete asset: ${response.status}`
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
      } catch {
        
      }
      throw new Error(errorMessage)
    }

    try {
      return await response.json()
    } catch {
      return { success: true, message: "Asset deleted successfully" }
    }
  }
}

export const assetService = new AssetService()
