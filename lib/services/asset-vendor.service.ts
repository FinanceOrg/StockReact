import { backendClient } from "@/lib/backend/backend.client";
import { mapAssetVendorIndex, mapAssetVendorShow } from "@/mappers/assetVendorMapper";
import { DeleteResponse } from "@/types/api";
import { AssetVendor } from "@/types/domain";
import {
  createVendorSchema,
  updateVendorSchema,
} from "@/validators/vendor.schema";

export class AssetVendorService {
  async getAll(): Promise<AssetVendor[]> {
    const response = await backendClient.get("/asset-vendors");

    if (!response.ok) {
      throw new Error(`Failed to fetch assets: ${response.status}`);
    }

    const vendorsDTO = await response.json();

    return mapAssetVendorIndex(vendorsDTO);
  }

  async getById(id: string): Promise<AssetVendor> {
    if (!id) {
      throw new Error("Vendor ID is required");
    }

    const response = await backendClient.get(`/asset-vendors/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Vendor not found");
      }
      throw new Error(`Failed to fetch vendor: ${response.status}`);
    }

    const vendorDTO = await response.json();

    return mapAssetVendorShow(vendorDTO);
  }

  async create(data: unknown): Promise<AssetVendor> {
    const parsed = createVendorSchema.safeParse(data);
    if (!parsed.success) {
      const errors = parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");
      throw new Error(`Validation failed: ${errors}`);
    }

    const response = await backendClient.post("/asset-vendors", parsed.data);

    if (!response.ok) {
      let errorMessage = `Failed to create vendor: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  }

  async update(id: string, data: unknown): Promise<AssetVendor> {
    if (!id) {
      throw new Error("Vendor ID is required");
    }

    const parsed = updateVendorSchema.safeParse(data);
    if (!parsed.success) {
      const errors = parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");
      throw new Error(`Validation failed: ${errors}`);
    }

    const response = await backendClient.put(`/asset-vendors/${id}`, parsed.data);

    if (!response.ok) {
      let errorMessage = `Failed to update vendor: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  }

  async delete(id: string): Promise<DeleteResponse> {
    if (!id) {
      throw new Error("Vendor ID is required");
    }

    const response = await backendClient.delete(`/asset-vendors/${id}`);

    if (!response.ok) {
      let errorMessage = `Failed to delete vendor: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        
      }
      throw new Error(errorMessage);
    }

    try {
      return await response.json();
    } catch {
      return { success: true, message: "Vendor deleted successfully" };
    }
  }
}

export const assetVendorService = new AssetVendorService();
