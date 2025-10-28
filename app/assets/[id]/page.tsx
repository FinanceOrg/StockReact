import UserLayout from "@/layouts/UserLayout";
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