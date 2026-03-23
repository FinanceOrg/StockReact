"use client"; // 👈 add this at the very top!

import { usePathname, useRouter } from "next/navigation";
import React from "react";

import { authClient } from "@/clients/AuthClient";
import SideMenuElement from "@/components/Menu/SideMenuElement";
import BankLogo from "@/icons/bank.svg";
import CategoryLogo from "@/icons/category.svg";
import HomeLogo from "@/icons/home.svg";
import LogOut from "@/icons/log-out.svg";
import UserLogo from "@/icons/users.svg";

type SideMenuProps = {
  isAdmin: boolean;
};

export default function SideMenu({ isAdmin }: SideMenuProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.logout();
    router.replace("/login");
  };

  const menuItems = [
    { name: "Home", href: "/", icon: HomeLogo },
    { name: "Vendors", href: "/vendors", icon: BankLogo, adminOnly: true },
    {
      name: "Labels",
      href: "/asset-categories",
      icon: CategoryLogo,
      adminOnly: true,
    },
    { name: "Users", href: "/users", icon: UserLogo, adminOnly: true },
  ].filter((item) => !item.adminOnly || isAdmin);

  const logoutItem = {
    name: "Logout",
    icon: LogOut,
    action: handleLogout,
    reverseIcon: true,
  };

  const pathname = usePathname();

  return (
    <div
      className="fixed sm:static bottom-0 w-full bg-[#17253E] h-[50px] sm:h-full sm:w-[80px] flex
            sm:flex-col gap-4 items-center justify-between sm:py-2"
    >
      <div className="w-15 sm:w-0 sm:hidden"></div>
      <div className="flex sm:flex-col gap-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <SideMenuElement
              key={item.href ?? item.name}
              name={item.name}
              icon={item.icon}
              href={item.href}
              isActive={isActive}
            />
          );
        })}
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
