import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import SideMenu from "@/components/Menu/SideMenu";
import Menu from "@/components/Menu/Menu";
import React from "react";
import AnimatedPageWrapper from "@/components/layout/AnimatedPageWrapper";
import { getCurrentUser } from "@/lib/server/userService";


const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

type UserLayoutProps = {
    menuTitle?: string;
    pageTitle?: string;
    children: React.ReactNode
}

export default async function UserLayout({
  menuTitle = "",
  pageTitle = "",
  children,
}: UserLayoutProps) {
    const data = await getCurrentUser()
    console.log("got data", data)
/* 
  async function submit() {
    "use server"
    const dataa= await getCurrentUser()
    const result = await dataa.json()

    console.log(result)
    console.log("runs on server")
  } */

  return (
    <div className="bg-[#17253E] h-full">
      <Menu title={menuTitle} />
      <div className="flex flex-col-reverse sm:flex-row sm:h-[calc(100vh-65px)]">
        <SideMenu />

        <AnimatedPageWrapper pageTitle={pageTitle}>
          {children}
        </AnimatedPageWrapper>

      </div>
    </div>
  );
}
