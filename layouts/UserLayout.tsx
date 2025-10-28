"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "../app/globals.css";
import SideMenu from "@/components/Menu/SideMenu";
import Menu from "@/components/Menu/Menu";
import React from "react";
import {AnimatePresence, motion} from "framer-motion";
import {usePathname} from "next/navigation";


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

export default function UserLayout({
    menuTitle = "",
    pageTitle = "",
    children,
}: UserLayoutProps) {
    const pathname = usePathname();

    return (
        <div className="bg-[#17253E] h-full">
            <Menu title={menuTitle}/>
            <div className="flex flex-col-reverse sm:flex-row sm:h-[calc(100vh-60px)]" >
                <SideMenu />
                <div className="bg-linear-to-b from-[#6756FF] to-[#9DE5FF] w-full sm:rounded-tl-lg pt-4 px-4 pb-[20px] sm:pb-0 mb-[50px] sm:mb-0 min-h-[calc(100dvh-60px)] sm:h-full overflow-x-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            className="w-full"
                            key={pathname} // 👈 triggers animation on route change
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                            { pageTitle && <h1 className="text-white text-4xl mb-10">{pageTitle}</h1>}
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
