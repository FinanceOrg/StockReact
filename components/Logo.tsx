import Arrow from "@/icons/arrow.svg"
import clsx from "clsx";
import { div } from "framer-motion/client";
import Link from "next/link";

type LogoProps = {
    size?: string;
    bgColor?: string;
    color?: string;
    href?: string 
}

export default function Logo ({size = "size-13", bgColor = "bg-blue-600", color = "text-white", href = ""}: LogoProps) {
    const baseClass = "rounded-tr-4xl p-2 w-fit"
    return (
        <>
            {href ? (
                <Link href={href} className={clsx(baseClass, bgColor, "cursor-pointer")}>
                    <Arrow className={clsx("rounded-2xl text-white", color, size)}></Arrow>
                </Link>
            ): (
                <div className={clsx(baseClass, bgColor)}>
                    <Arrow className={clsx("rounded-2xl text-white", color, size)}></Arrow>
                </div>
            )}
        </>
    )
}