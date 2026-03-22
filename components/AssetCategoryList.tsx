"use client";

import clsx from "clsx";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Category } from "@/types/domain";

import AssetCategoryModal from "./AssetCategoryModal";

export default function AssetCategoryList({
  categories: initialCategories,
}: {
  categories: Category[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [categories, setCategories] = useState(initialCategories);

  const openModal = (category: Category | null = null) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCategoryUpdate = (updated: Category) => {
    setCategories((prev) => {
      const updatedList = prev.map((category) =>
        category.id === updated.id ? { ...category, ...updated } : category,
      );

      return prev.some((category) => category.id === updated.id)
        ? updatedList
        : [updated, ...prev];
    });
  };

  const handleCategoryDelete = (id: number) => {
    setCategories((prev) => prev.filter((category) => category.id !== id));
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => openModal()}>Create new category</Button>
      </div>

      <div className="mb-4">
        <div className="hidden sm:flex bg-white rounded-t-lg border-b border-gray-300 px-4">
          <div className="py-2 sm:basis-1/2">Name</div>
          <div className="py-2 sm:basis-1/2">Description</div>
        </div>

        {categories.length === 0 && (
          <div className="bg-white rounded-lg px-4 py-6 text-center text-gray-500">
            No categories yet. Create your first one!
          </div>
        )}

        {categories.map((category, index) => (
          <div
            key={category.id}
            onClick={() => openModal(category)}
            className={clsx(
              "flex flex-wrap sm:flex-nowrap py-3 px-4 bg-white cursor-pointer",
              "hover:bg-white/70 transition duration-300",
              index === categories.length - 1 && "rounded-b-lg",
              index === 0 &&
                categories.length > 0 &&
                "rounded-t-lg sm:rounded-t-none",
            )}
          >
            <div className="flex items-center gap-3 sm:basis-1/2 font-bold sm:font-normal">
              {(category.style?.bgColor || category.style?.color) && (
                <span
                  className="inline-flex min-w-14 justify-center rounded px-2 py-1 text-xs shrink-0 border border-black/10"
                  style={{
                    backgroundColor: category.style?.bgColor,
                    color: category.style?.color,
                  }}
                >
                  Aa
                </span>
              )}
              {category.name}
            </div>
            <div className="sm:basis-1/2 text-sm text-gray-500">
              {category.description ?? "—"}
            </div>
          </div>
        ))}
      </div>

      <AssetCategoryModal
        category={selectedCategory}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={handleCategoryUpdate}
        onDelete={handleCategoryDelete}
      />
    </div>
  );
}
