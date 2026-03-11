import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

import Card from "@/components/Card";
import { Asset } from "@/types/domain";

export default function StockCard(asset: Asset) {
  const vendor = asset.vendor;
  const category = asset.category;
  const vendorColor = vendor.style?.color || "";
  const vendorImage = vendor.style?.image || "";
  const href = `/assets/${asset.id}`;

  return (
    <Card className="sm:max-w-[750px] cursor-pointer">
      <Link href={href}>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-y-4">
          <div className={clsx("flex items-center")}>
            {vendorImage && (
              <Image
                src={vendorImage}
                alt={`${vendor.name} image`}
                className={clsx(
                  "h-[35px] object-contain",
                  asset.name ? "me-3" : "w-[165px]",
                )}
              />
            )}
            {asset.name && (
              <div
                style={{ color: vendorColor }}
                className="text-4xl font-bold"
              >
                {asset.name}
              </div>
            )}
          </div>
          <div style={{ color: vendorColor }} className={`text-3xl font-bold`}>
            {Intl.NumberFormat("hu-HU").format(asset.value)}{" "}
            {typeof asset.currency === "string"
              ? asset.currency
              : asset.currency.code}
          </div>
        </div>
        <div className="mt-4 flex justify-between items-end">
          <div style={{ color: vendorColor }} className="text-lg font-bold">
            {category.name}
          </div>
          <div
            style={{
              color: category.style?.color,
              backgroundColor: category.style?.bgColor || "",
            }}
            className={`py-1 px-2 bg-gray-500 rounded-2xl`}
          >
            {category.name}
          </div>
        </div>
      </Link>
    </Card>
  );
}
