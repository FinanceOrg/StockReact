import React, {ComponentType, SVGProps} from "react";

type SideMenuElementProps = {
    name: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    isActive?: boolean;
    onClick?: () => void;
};

export default function SideMenuElement({ name, icon: Icon, isActive, onClick }: SideMenuElementProps) {
    return (
        <div
            onClick={onClick}
            className={`group cursor-pointer flex flex-col items-center justify-center w-[60px] ${
                isActive ? "" : "rounded-lg text-[#A4ACB9] hover:bg-[#1E3258]"
            }`}
        >
            <div className={`size-10 sm:size-12 flex items-center justify-center rounded-lg ${
                isActive ? "bg-white" : "text-gray-500"
            }`}>
                <Icon
                    className={`size-8 sm:size-10`}
                />
            </div>
            <div
                className={`hidden sm:block ${
                    isActive ? "text-white" : ""
                }`}
            >
                {name}
            </div>
        </div>
    );
}

