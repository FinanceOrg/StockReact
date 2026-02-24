"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  pageTitle?: string;
  children: React.ReactNode;
};

export default function AnimatedPageWrapper({
  pageTitle,
  children,
}: Props) {
  const pathname = usePathname();

  return (
    <div className="bg-linear-to-b from-[#6756FF] to-[#9DE5FF] w-full sm:rounded-tl-lg pt-4 px-4 pb-[20px] mb-[50px] sm:mb-0 min-h-[calc(100dvh-65px)] sm:h-full overflow-x-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          className="w-full"
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {pageTitle && (
            <h1 className="text-white text-4xl mb-10">
              {pageTitle}
            </h1>
          )}
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}