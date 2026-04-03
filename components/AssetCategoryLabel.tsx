import { Category } from "@/types/domain";

export default function AssetCategoryLabel({
  category,
}: {
  category: Category;
}) {
  return (
    <div
      style={{
        color: category.style?.color ?? undefined,
        backgroundColor: category.style?.bgColor ?? undefined,
      }}
      className={`py-1 px-2 bg-gray-500 rounded-2xl h-8 w-fit`}
    >
      {category.name}
    </div>
  );
}
