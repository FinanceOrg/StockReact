import { backendClient } from "@/lib/backend/backend.client";
import {
  assertResponseOk,
  getDeleteResponse,
  requireId,
  throwValidationError,
} from "@/lib/services/service.helper";
import {
  mapAssetCategoryIndex,
  mapAssetCategoryShow,
} from "@/mappers/assetCategoryMapper";
import { DeleteResponse } from "@/types/api";
import { Category } from "@/types/domain";
import {
  createCategorySchema,
  updateCategorySchema,
} from "@/validators/category.schema";

export class AssetCategoryService {
  async getAll(): Promise<Category[]> {
    const response = await backendClient.get("/asset-categories", {
      tags: ["asset-categories"],
    });
    await assertResponseOk(response, "Failed to fetch categories");
    const categoryDTO = await response.json();

    return mapAssetCategoryIndex(categoryDTO);
  }

  async getById(id: string): Promise<Category> {
    requireId(id, "Category");

    const response = await backendClient.get(`/asset-categories/${id}`);
    await assertResponseOk(response, "Failed to fetch category", {
      notFoundMessage: "Category not found",
    });

    const categoryDTO = await response.json();

    return mapAssetCategoryShow(categoryDTO);
  }

  async create(data: unknown): Promise<Category> {
    const parsed = createCategorySchema.safeParse(data);
    if (!parsed.success) {
      throwValidationError(parsed.error);
    }

    const response = await backendClient.post("/asset-categories", parsed.data);
    await assertResponseOk(response, "Failed to create category");

    return await response.json();
  }

  async update(id: string, data: unknown): Promise<Category> {
    requireId(id, "Category");

    const parsed = updateCategorySchema.safeParse(data);
    if (!parsed.success) {
      throwValidationError(parsed.error);
    }

    const response = await backendClient.patch(
      `/asset-categories/${id}`,
      parsed.data,
    );

    await assertResponseOk(response, "Failed to update category");

    return await response.json();
  }

  async delete(id: string): Promise<DeleteResponse> {
    requireId(id, "Category");

    const response = await backendClient.delete(`/asset-categories/${id}`);
    await assertResponseOk(response, "Failed to delete category");

    return await getDeleteResponse(response, "Category deleted successfully");
  }
}

export const assetCategoryService = new AssetCategoryService();
