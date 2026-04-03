import clsx from "clsx";
import { ComponentType, CSSProperties, SVGProps } from "react";

type IconProps = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  size?: string;
  className?: string;
  style?: CSSProperties;
};

export default function Icon({
  icon: Svg,
  size = "size-10",
  className,
  style,
}: IconProps) {
  return (
    <Svg
      style={style}
      className={clsx(
        size,
        "text-primary rounded-2xl cursor-pointer",
        className,
      )}
    />
  );
}
