import { backendClient } from "@/lib/backend/backend.client";
import {
  assertResponseOk,
  getDeleteResponse,
  requireId,
  throwValidationError,
} from "@/lib/services/service.helper";
import { mapAssetIndex, mapAssetShow } from "@/mappers/assetMapper";
import { DeleteResponse } from "@/types/api";
import { Asset } from "@/types/domain";
import {
  createAssetSchema,
  updateAssetSchema,
} from "@/validators/asset.schema";

export class AssetService {
  async getAll(): Promise<Asset[]> {
    const response = await backendClient.get("/assets", {
      cache: "no-store",
    });
    await assertResponseOk(response, "Failed to fetch assets");

    const assetsDTO = await response.json();
    const assets = mapAssetIndex(assetsDTO);

    return assets;
  }

  async getById(id: string | number): Promise<Asset> {
    requireId(id, "Asset");

    const response = await backendClient.get(`/assets/${id}`);
    await assertResponseOk(response, "Failed to fetch asset", {
      notFoundMessage: "Asset not found",
    });

    const assetDTO = await response.json();

    return mapAssetShow(assetDTO);
  }

  async create(data: unknown): Promise<Asset> {
    const parsed = createAssetSchema.safeParse(data);
    if (!parsed.success) {
      throwValidationError(parsed.error);
    }

    const response = await backendClient.post("/assets", parsed.data);
    await assertResponseOk(response, "Failed to create asset");

    return await response.json();
  }

  async update(id: string, data: unknown): Promise<Asset> {
    requireId(id, "Asset");

    const parsed = updateAssetSchema.safeParse(data);
    if (!parsed.success) {
      throwValidationError(parsed.error);
    }

    const response = await backendClient.patch(`/assets/${id}`, parsed.data);
    await assertResponseOk(response, "Failed to update asset");

    return await response.json();
  }

  async delete(id: string): Promise<DeleteResponse> {
    requireId(id, "Asset");

    const response = await backendClient.delete(`/assets/${id}`);
    await assertResponseOk(response, "Failed to delete asset");

    return await getDeleteResponse(response, "Asset deleted successfully");
  }
}

export const assetService = new AssetService();
