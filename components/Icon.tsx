import clsx from "clsx";
import { ComponentType, SVGProps } from "react";

type IconProps = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  size?: string;
  className?: string;
};

export default function Icon({
  icon: Svg,
  size = "size-10",
  className,
}: IconProps) {
  return (
    <Svg
      className={clsx(
        size,
        className,
        "text-primary rounded-2xl cursor-pointer",
      )}
    />
  );
}
