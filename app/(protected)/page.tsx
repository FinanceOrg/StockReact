import StockCard from "@/components/StockCard";
import Card from "@/components/Card";
import { assetService } from "@/lib/services/asset.service";
import { getCurrentUser } from "@/lib/server/userService";
import { assetVendorService } from "@/lib/services/asset-vendor.service";
import { assetCategoryClient } from "@/clients/AssetCategoryClient";
import { assetCategoryService } from "@/lib/services/asset-category.service";

export default async function Home() {
  const user = await getCurrentUser()
  const vendors = await assetVendorService.getAll()
  const categories = await assetCategoryService.getAll()
  const assets = await assetService.getAll()
  console.log("assets", assets)
  console.log(vendors, categories)

  return (
    <div>
        <Card className="mb-8 flex justify-between items-center sm:w-[400px]">
            <div className="text-2xl">Balance:</div>
            <div className="text-xl font-bold">{Intl.NumberFormat("hu-HU").format(user.totalValue)} Ft</div>
        </Card>
        <div className="flex flex-col gap-y-4">
            {assets.map((asset) => {
              
              return (
                <StockCard
                  key={asset.id}
                  href={`/assets/${asset.id}`}
                  color={asset.assetCategory?.style?.color || "#000000"}
                  image={asset.assetVendor?.style?.icon || "https://via.placeholder.com/50"}
                  amount={asset.value}
                  text={asset.description || asset.name}
                  type={asset.assetCategory?.name || ""}
                  additionalTitle={asset.name}
                />
              )
            })}
        </div>
    </div>
  );
}
