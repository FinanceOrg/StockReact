import "@/app/globals.css";
import SideMenu from "@/components/Menu/SideMenu";
import Menu from "@/components/Menu/Menu";
import React from "react";
import { getCurrentUser } from "@/lib/server/userService";
import { UserProvider } from "../(app)/UserProvider";

type UserLayoutProps = {
    menuTitle?: string;
    pageTitle?: string;
    children: React.ReactNode
}

export default async function UserLayout({
  menuTitle = "",
  children,
}: UserLayoutProps) {
    let user = null
    try {
      user = await getCurrentUser()
    } catch {

    }


  return (
    <UserProvider user={user}>
      <div className="bg-[#17253E] h-full">
        <Menu title={menuTitle} />
        <div className="flex flex-col-reverse sm:flex-row sm:h-[calc(100vh-65px)]">
          <SideMenu />
          <div className="bg-linear-to-b from-[#6756FF] to-[#9DE5FF] w-full sm:rounded-tl-lg pt-4 px-4 pb-[20px] mb-[50px] sm:mb-0 min-h-[calc(100dvh-65px)] sm:h-full overflow-x-hidden">
                {children}
          </div>
        </div>
      </div>
    </UserProvider>
  );
}
