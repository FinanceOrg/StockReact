import clsx from "clsx";
import { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export default function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        "border border-[#E0E3E7] bg-white/80 rounded-lg p-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
