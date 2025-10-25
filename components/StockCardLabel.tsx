import {StockType} from "@/types/StockTypes";


type StockCardLabelProps = {
    type: StockType
}

export default function StockCardLabel({type}:StockCardLabelProps) {
    let color = ""
    let bgColor = ""

    switch (type) {
        case "stock":
            color = "#FFFFFF"
            bgColor = "#AA4E4F"
            break
        case "cash":
            color = "#FFFFFF"
            bgColor = "#05DA93"
            break
        case "bank":
            color = "#FFFFFF"
            bgColor = "#20639B"
            break

    }

    return (
        <div style={{color: color, backgroundColor: bgColor}} className={`py-1 px-2 bg-gray-500 rounded-2xl`}>{type}</div>
    )
}