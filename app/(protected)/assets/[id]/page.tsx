import RawChart from "@/components/AssetChart";
import AssetHeader from "@/components/AssetHeader";
import AssetTransactions from "@/components/AssetTransactions";
import { assetCategoryService } from "@/lib/services/asset-category.service";
import { assetVendorService } from "@/lib/services/asset-vendor.service";
import { assetService } from "@/lib/services/asset.service";
import { transactionService } from "@/lib/services/transaction.service";

export default async function Asset({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  function getSafeHexColor(value?: string | null) {
    if (!value) {
      return undefined;
    }

    return /^#[0-9A-Fa-f]{6}$/.test(value) ? value : undefined;
  }

  const { id } = await params;

  const [asset, transactions, categories, vendors] = await Promise.all([
    assetService.getById(id),
    transactionService.getByAssetId(id),
    assetCategoryService.getAll(),
    assetVendorService.getAll(),
  ]);

  const defaultGradientBackground =
    "linear-gradient(to bottom, #6756FF, #9DE5FF)";

  const vendorBgColor = getSafeHexColor(asset.vendor.style?.bgColor);
  const vendorAccentColor =
    getSafeHexColor(asset.vendor.style?.accentColor) ?? "#FFFFFF";
  const vendorColor = getSafeHexColor(asset.vendor.style?.color) ?? "#000000";
  const vendorSecondaryButtonColor =
    getSafeHexColor(asset.vendor.style?.secondaryButtonColor) ?? "#FFFFFF";

  return (
    <div
      className="-mx-4 -mt-4 mb-[-20px] min-h-[calc(100dvh-65px)] px-4 pb-[20px] pt-4 sm:mb-0 sm:min-h-full"
      style={{ background: vendorBgColor ?? defaultGradientBackground }}
    >
      <div className="space-y-4">
        <AssetHeader asset={asset} categories={categories} vendors={vendors} />

        <RawChart
          title="Monthly Sales (raw Chart.js)"
          transactions={transactions}
          accentColor={vendorAccentColor}
          buttonColor={vendorColor}
          secondaryButtonColor={vendorSecondaryButtonColor}
        />
        <AssetTransactions
          asset={asset}
          transactions={transactions}
          accentColor={vendorAccentColor}
          buttonColor={vendorColor}
        />
      </div>
    </div>
  );
}
