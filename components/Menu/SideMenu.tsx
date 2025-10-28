"use client"; // 👈 add this at the very top!

import React from "react";
import HomeLogo from "@/icons/home.svg";
import DiagramLogo from "@/icons/diagram.svg";
import SettingsLogo from "@/icons/settings.svg";
import MoneyLogo from "@/icons/money.svg";
import SideMenuElement from "@/components/Menu/SideMenuElement";
import {usePathname} from "next/navigation";

export default function SideMenu() {
    const menuItems = [
        { name: "Home", href: "/", icon: HomeLogo },
        { name: "Statistics", href: "/stats", icon: DiagramLogo },
        { name: "Settings", href: "/settings", icon: SettingsLogo },
        { name: "Forecast", href: "/forecast", icon: MoneyLogo },
    ]
    const pathname = usePathname()

    return (
        <div className="fixed sm:static bottom-0 w-full bg-[#17253E] h-[50px] sm:h-auto sm:w-[80px] flex
        sm:flex-col gap-4 items-center justify-center sm:justify-start sm:pt-4">
            {
                menuItems.map((item) => {
                    const isActive = pathname === item.href

                    return (
                        <SideMenuElement
                            key={item.href}
                            name={item.name}
                            icon={item.icon}
                            href={item.href}
                            isActive={isActive}
                        />
                    )
                })
            }
        </div>
    );
}
