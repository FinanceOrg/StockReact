"use client"; // 👈 add this at the very top!

import React from "react";
import HomeLogo from "@/icons/home.svg";
import DiagramLogo from "@/icons/diagram.svg";
import SettingsLogo from "@/icons/settings.svg";
import MoneyLogo from "@/icons/money.svg";
import SideMenuElement from "@/components/Menu/SideMenuElement";
import {usePathname, useRouter} from "next/navigation";
import LogOut from "@/icons/log-out.svg"
import { authClient } from "@/clients/AuthClient";

export default function SideMenu() {
    const router = useRouter()

    const handleLogout = async () => {
        await authClient.logout()
        router.replace("/login")
    }

    const menuItems = [
        { name: "Home", href: "/", icon: HomeLogo },
        { name: "Statistics", href: "/stats", icon: DiagramLogo },
        { name: "Settings", href: "/settings", icon: SettingsLogo },
        { name: "Forecast", href: "/forecast", icon: MoneyLogo },
    ]

    const logoutItem = { name: "Logout", icon: LogOut, action: handleLogout, reverseIcon: true }

    const pathname = usePathname()

    return (
        <div className="fixed sm:static bottom-0 w-full bg-[#17253E] h-[50px] sm:h-full sm:w-[80px] flex
            sm:flex-col gap-4 items-center justify-between sm:py-2">
            <div className="w-15 sm:w-0 sm:hidden"></div>
            <div className="flex sm:flex-col">
                {
                    menuItems.map((item) => {
                        const isActive = pathname === item.href

                        return (
                            <SideMenuElement
                                key={item.href ?? item.name}
                                name={item.name}
                                icon={item.icon}
                                href={item.href}
                                isActive={isActive}
                            />
                        )
                    })
                }
            </div>
            <SideMenuElement
                name={logoutItem.name}
                icon={logoutItem.icon}
                reverseIcon={true}
                onClick={handleLogout}
            />
        </div>
    );
}
