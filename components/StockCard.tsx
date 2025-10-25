import {StockType} from "@/types/StockTypes";
import StockCardLabel from "@/components/StockCardLabel";
import Card from "@/components/Card";
import clsx from "clsx";

type StockCardProps = {
    color: string
    image: string
    additionalTitle?: string
    amount: number
    text: string
    type: StockType
}
export default function StockCard({color, image, additionalTitle, amount, text, type}: StockCardProps) {
    return(
        <Card className="sm:max-w-[750px] cursor-pointer">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-y-4">
                <div className={clsx("flex items-center")}>
                    <img
                        src={image}
                        alt="stock image"
                        className={clsx(
                            "h-[35px] object-contain",
                            additionalTitle ? "me-3" : "w-[165px]"
                        )}

                    />
                    {additionalTitle && <div style={{color}} className="text-4xl font-bold">{additionalTitle}</div>}
                </div>
                <div style={{ color }} className={`text-3xl  font-bold`}>{Intl.NumberFormat("hu-HU").format(amount)} Ft</div>
            </div>
            <div className="mt-4 flex justify-between items-end">
                <div style={{ color }} className="text-lg font-bold">{text}</div>
                <StockCardLabel type={type}/>
            </div>
        </Card>
    )
}