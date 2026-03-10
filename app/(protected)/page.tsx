import StockCard from "@/components/StockCard";
import Card from "@/components/Card";
import { assetService } from "@/lib/services/asset.service";
import { getCurrentUser } from "@/lib/server/userService";
import { assetVendorService } from "@/lib/services/asset-vendor.service";
import { assetCategoryClient } from "@/clients/AssetCategoryClient";
import { assetCategoryService } from "@/lib/services/asset-category.service";

export default async function Home() {
  const user = await getCurrentUser()
  const assets = await assetService.getAll()

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
                  {...asset}
                />
              )
            })}
        </div>
    </div>
  );
}
