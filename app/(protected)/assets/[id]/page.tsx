import RawChart from "@/components/SampleChart";
import AssetTransactions from "@/components/AssetTransactions";
import { assetService } from "@/lib/services/asset.service";
import { transactionService } from "@/lib/services/transaction.service";

export default async function Asset({ params }: { params: { id: string}}) {
    const { id } = await params
    const asset = await assetService.getById(id)
    const transactions = await transactionService.getByAssetId(id)

    return (
        <div className="space-y-4">
            <RawChart title="Monthly Sales (raw Chart.js)" transactions={transactions}/>
            <AssetTransactions asset={asset} transactions={transactions} />
        </div>
    )
}