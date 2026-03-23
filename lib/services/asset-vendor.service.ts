import { backendClient } from "@/lib/backend/backend.client";
import {
  assertResponseOk,
  getDeleteResponse,
  requireId,
  throwValidationError,
} from "@/lib/services/service.helper";
import {
  mapAssetVendorIndex,
  mapAssetVendorShow,
} from "@/mappers/assetVendorMapper";
import { DeleteResponse } from "@/types/api";
import { AssetVendor } from "@/types/domain";
import {
  createVendorSchema,
  updateVendorSchema,
} from "@/validators/vendor.schema";

export class AssetVendorService {
  async getAll(): Promise<AssetVendor[]> {
    const response = await backendClient.get("/asset-vendors");
    await assertResponseOk(response, "Failed to fetch vendors");

    const vendorsDTO = await response.json();

    return mapAssetVendorIndex(vendorsDTO);
  }

  async getById(id: string): Promise<AssetVendor> {
    requireId(id, "Vendor");

    const response = await backendClient.get(`/asset-vendors/${id}`);
    await assertResponseOk(response, "Failed to fetch vendor", {
      notFoundMessage: "Vendor not found",
    });

    const vendorDTO = await response.json();

    return mapAssetVendorShow(vendorDTO);
  }

  async create(data: unknown): Promise<AssetVendor> {
    const parsed = createVendorSchema.safeParse(data);
    if (!parsed.success) {
      throwValidationError(parsed.error);
    }

    const response = await backendClient.post("/asset-vendors", parsed.data);
    await assertResponseOk(response, "Failed to create vendor");

    return await response.json();
  }

  async update(id: string, data: unknown): Promise<AssetVendor> {
    requireId(id, "Vendor");

    const parsed = updateVendorSchema.safeParse(data);
    if (!parsed.success) {
      throwValidationError(parsed.error);
    }

    const response = await backendClient.patch(
      `/asset-vendors/${id}`,
      parsed.data,
    );

    await assertResponseOk(response, "Failed to update vendor");

    return await response.json();
  }

  async delete(id: string): Promise<DeleteResponse> {
    requireId(id, "Vendor");

    const response = await backendClient.delete(`/asset-vendors/${id}`);
    await assertResponseOk(response, "Failed to delete vendor");

    return await getDeleteResponse(response, "Vendor deleted successfully");
  }
}

export const assetVendorService = new AssetVendorService();
