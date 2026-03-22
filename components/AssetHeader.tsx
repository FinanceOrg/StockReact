"use client";

import { useEffect, useState } from "react";

import AssetCategoryLabel from "@/components/AssetCategoryLabel";
import AssetEditButton from "@/components/AssetEditButton";
import { Asset, AssetVendor, Category } from "@/types/domain";

function sanitizeImageUrl(url?: string | null) {
  if (!url) return null;

  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return null;
    }

    return parsedUrl.toString();
  } catch {
    return null;
  }
}

type AssetHeaderProps = {
  asset: Asset;
  categories: Category[];
  vendors: AssetVendor[];
};

export default function AssetHeader({
  asset,
  categories,
  vendors,
}: AssetHeaderProps) {
  const [currentAsset, setCurrentAsset] = useState(asset);

  useEffect(() => {
    setCurrentAsset(asset);
  }, [asset]);

  const vendorImage = sanitizeImageUrl(currentAsset.vendor.style?.image);

  return (
    <>
      <div className="flex justify-between w-full">
        <h1>{currentAsset.name}</h1>
        <AssetEditButton
          asset={currentAsset}
          categories={categories}
          vendors={vendors}
          onSuccess={setCurrentAsset}
        />
      </div>

      <div className="flex gap-4 items-center justify-between">
        {vendorImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={vendorImage}
            alt={`${currentAsset.vendor.name} image`}
            className="h-14 max-w-[180px] object-contain rounded bg-white px-1 py-0.5"
          />
        ) : (
          <div className="text-2xl">{currentAsset.vendor.name}</div>
        )}

        <AssetCategoryLabel category={currentAsset.category} />
      </div>
    </>
  );
}
