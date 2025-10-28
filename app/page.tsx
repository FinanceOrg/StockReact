import StockCard from "@/components/StockCard";
import UserLayout from "@/layouts/UserLayout";
import Card from "@/components/Card";

export default function Home() {
  return (
    <UserLayout pageTitle="Dashboard" menuTitle="Dashboard">
        <div>
            <Card className="mb-8 flex justify-between items-center sm:w-[400px]">
                <div className="text-2xl">Balance:</div>
                <div className="text-xl font-bold">{Intl.NumberFormat("hu-HU").format(123456789)} Ft</div>
            </Card>
            <div className="flex flex-col gap-y-4">
                <StockCard href="/assets/1" color="#F7931A" type="stock" amount={12130000} text="Lorem ipsum dolor sit amet, consectetur." image="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Bitcoin_logo.svg/1024px-Bitcoin_logo.svg.png"/>
                <StockCard href="/assets/2" color="#5EB429" type="bank" amount={12130000} text="Lorem ipsum dolor sit amet, consectetur." image="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/OTP_Bank_logo.svg/2560px-OTP_Bank_logo.svg.png"/>
                <StockCard href="/assets/3" color="#E82127" type="cash" amount={12130000} additionalTitle="Tesla" text="Lorem ipsum dolor sit amet, consectetur." image="https://www.edigitalagency.com.au/wp-content/uploads/Tesla-logo-red-large-size.png"/>
            </div>
        </div>
    </UserLayout>
  );
}
