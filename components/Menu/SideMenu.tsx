"use client"; // 👈 add this at the very top!

import React from "react";
import HomeLogo from "@/icons/home.svg";
import DiagramLogo from "@/icons/diagram.svg";
import SettingsLogo from "@/icons/settings.svg";
import MoneyLogo from "@/icons/money.svg";
import SideMenuElement from "@/components/Menu/SideMenuElement";

export default function SideMenu() {
    const [active, setActive] = React.useState("Home");

    return (
        <div className="fixed sm:static bottom-0 w-full bg-[#17253E] h-[50px] sm:h-auto sm:w-[80px] flex
        sm:flex-col gap-4 items-center justify-center sm:justify-start sm:pt-4">
            <SideMenuElement
                name="Home"
                icon={HomeLogo}
                isActive={active === "Home"}
                onClick={() => setActive("Home")}
            />
            <SideMenuElement
                name="Statistics"
                icon={DiagramLogo}
                isActive={active === "Statistics"}
                onClick={() => setActive("Statistics")}
            />
            <SideMenuElement
                name="Settings"
                icon={SettingsLogo}
                isActive={active === "Settings"}
                onClick={() => setActive("Settings")}
            />
            <SideMenuElement
                name="Forecast"
                icon={MoneyLogo}
                isActive={active === "Forecast"}
                onClick={() => setActive("Forecast")}
            />
        </div>
    );
}
