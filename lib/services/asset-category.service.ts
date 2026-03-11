import { backendClient } from "@/lib/backend/backend.client";
import { mapAssetCategoryIndex, mapAssetCategoryShow } from "@/mappers/assetCategoryMapper";
import { DeleteResponse } from "@/types/api";
import { Category } from "@/types/domain";
import {
  createCategorySchema,
  updateCategorySchema,
} from "@/validators/category.schema";

export class AssetCategoryService {
  async getAll(): Promise<Category[]> {
    const response = await backendClient.get("/asset-categories");

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }
    const categoryDTO = await response.json(); 

    return mapAssetCategoryIndex(categoryDTO);
  }

  async getById(id: string): Promise<Category> {
    if (!id) {
      throw new Error("Category ID is required");
    }

    const response = await backendClient.get(`/asset-categories/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Category not found");
      }
      throw new Error(`Failed to fetch category: ${response.status}`);
    }

    const categoryDTO = await response.json();

    return mapAssetCategoryShow(categoryDTO);
  }

  async create(data: unknown): Promise<Category> {
    const parsed = createCategorySchema.safeParse(data);
    if (!parsed.success) {
      const errors = parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");
      throw new Error(`Validation failed: ${errors}`);
    }

    const response = await backendClient.post("/asset-categories", parsed.data);

    if (!response.ok) {
      let errorMessage = `Failed to create category: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {

      }
      throw new Error(errorMessage);
    }

    return await response.json();
  }

  async update(id: string, data: unknown): Promise<Category> {
    if (!id) {
      throw new Error("Category ID is required");
    }

    const parsed = updateCategorySchema.safeParse(data);
    if (!parsed.success) {
      const errors = parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");
      throw new Error(`Validation failed: ${errors}`);
    }

    const response = await backendClient.put(
      `/asset-categories/${id}`,
      parsed.data
    );

    if (!response.ok) {
      let errorMessage = `Failed to update category: ${response.status}`;
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
      throw new Error("Category ID is required");
    }

    const response = await backendClient.delete(`/asset-categories/${id}`);

    if (!response.ok) {
      let errorMessage = `Failed to delete category: ${response.status}`;
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
      return { success: true, message: "Category deleted successfully" };
    }
  }
}

export const assetCategoryService = new AssetCategoryService();
