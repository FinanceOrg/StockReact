import Card from "@/components/Card";
import StockCard from "@/components/StockCard";
import { getCurrentUser } from "@/lib/server/userService";
import { assetService } from "@/lib/services/asset.service";

export default async function Home() {
  const user = await getCurrentUser();
  const assets = await assetService.getAll();

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
              );
            })}
        </div>
    </div>
  );
}
