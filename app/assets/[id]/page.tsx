import UserLayout from "@/app/(protected)/layout";
import RawChart from "@/components/SampleChart";
import AssetTransactions from "@/components/AssetTransactions";

export default function Asset() {
    return (
        <UserLayout pageTitle="OTP" menuTitle="Asset">
            <div className="space-y-4">
                <RawChart title="Monthly Sales (raw Chart.js)" />
                <AssetTransactions />
            </div>
        </UserLayout>
    )
}