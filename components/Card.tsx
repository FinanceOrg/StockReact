import clsx from "clsx";
import { ReactNode } from "react";

type CardProps = {
  className?: string;
  children: ReactNode;
};
export default function Card({ className, children }: CardProps) {
  return (
    <div
      className={clsx(
        "border border-[#E0E3E7] bg-white/80 rounded-lg p-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
