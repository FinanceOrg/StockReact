import {ComponentType, ReactNode, SVGProps} from "react";

type MenuElementProps = {
    name: string
    icon: ComponentType<SVGProps<SVGSVGElement>>
}
export default function MenuElement({ name, icon: Icon }: MenuElementProps) {
    return(
        <div className="group rounded-lg cursor-pointer px-2 py-1 text-[#A4ACB9] hover:text-[#2E2F29] flex flex-col justify-center items-center">
            <div className="flex items-center justify-center group-hover:bg-white rounded-lg size-12 p-1">
                <Icon className="text-[#A4ACB9] group-hover:text-[#2E2F29]"/>
            </div>
            <div className="text-center text-xs font-bold group-hover:text-white">{ name }</div>
        </div>
    )
}

