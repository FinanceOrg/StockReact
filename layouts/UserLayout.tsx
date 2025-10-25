import { Geist, Geist_Mono } from "next/font/google";
import "../app/globals.css";
import SideMenu from "@/components/Menu/SideMenu";
import Menu from "@/components/Menu/Menu";
import React from "react";


const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

type UserLayoutProps = {
    title?: string;
    children: React.ReactNode
}

export default function UserLayout({
    title = "",
    children,
}: UserLayoutProps) {
    return (
        <div className="bg-[#17253E] h-full">
            <Menu title={title}/>
            <div className="flex flex-col-reverse sm:flex-row sm:h-[calc(100vh-60px)]" >
                <SideMenu />
                <div className="bg-linear-to-b from-[#6756FF] to-[#9DE5FF] w-full sm:rounded-tl-lg pt-4 px-4 pb-[20px] sm:pb-0 mb-[50px] sm:mb-0 min-h-[calc(100dvh-60px)] sm:h-full">
                    { title && <h1 className="text-white text-4xl mb-10">{title}</h1>}
                    {children}
                </div>
            </div>
        </div>
    );
}
