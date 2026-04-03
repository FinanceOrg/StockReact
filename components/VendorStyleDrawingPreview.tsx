"use client";

import { getContrastTextColor } from "@/lib/utils";

type VendorStyleDrawingPreviewProps = {
  vendorName?: string;
  color?: string;
  bgColor?: string;
  accentColor?: string;
  secondaryButtonColor?: string;
};

const HEX_COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/;
const DEFAULT_GRADIENT_BACKGROUND =
  "linear-gradient(to bottom, #6756FF, #9DE5FF)";

const safeHexColor = (value: string | undefined, fallback: string) => {
  if (!value || !HEX_COLOR_PATTERN.test(value)) {
    return fallback;
  }

  return value;
};

export default function VendorStyleDrawingPreview({
  vendorName,
  color,
  bgColor,
  accentColor,
  secondaryButtonColor,
}: VendorStyleDrawingPreviewProps) {
  const displayVendorName = vendorName?.trim() || "Vendor name";
  const titleAndIconColor = safeHexColor(color, "#FFFFFF");
  const calcColor = safeHexColor(color, "#000000");
  const hasCustomBgColor = Boolean(bgColor && HEX_COLOR_PATTERN.test(bgColor));
  const calcBgColor = hasCustomBgColor
    ? safeHexColor(bgColor, "#FFFFFF")
    : DEFAULT_GRADIENT_BACKGROUND;
  const calcAccentColor = safeHexColor(accentColor, "#FFFFFF");
  const calcSecondaryButtonColor = safeHexColor(
    secondaryButtonColor,
    "#FFFFFF",
  );
  const bgTextColor = hasCustomBgColor
    ? getContrastTextColor(calcBgColor)
    : "#111827";
  const accentTextColor = getContrastTextColor(calcAccentColor);
  const primaryButtonTextColor = getContrastTextColor(calcColor);
  const secondaryButtonTextColor = getContrastTextColor(
    calcSecondaryButtonColor,
  );
  const hasWhiteSecondaryButton =
    calcSecondaryButtonColor.toLowerCase() === "#ffffff";
  const buttonShadowStyle = { boxShadow: "4px 4px 0 rgba(0,0,0,0.28)" };

  return (
    <div
      className="w-full max-w-[360px] rounded-md border p-2 flex flex-col gap-y-2"
      style={{ background: calcBgColor, color: bgTextColor }}
    >
      <div
        style={{ color: titleAndIconColor }}
        className="mb-2 flex items-center justify-between text-xs font-semibold drop-shadow-[0_2px_6px_rgba(0,0,0,0.28)]"
      >
        <span>{displayVendorName}</span>
        <span>icon</span>
      </div>

      <div
        className="w-fit rounded-lg px-2 py-1 shadow-lg ring-1 ring-black/5"
        style={{ backgroundColor: calcAccentColor, color: accentTextColor }}
      >
        Total value: 1000
      </div>

      <div
        className="rounded-md border p-2 shadow-lg ring-1 ring-black/5"
        style={{ backgroundColor: calcAccentColor, color: accentTextColor }}
      >
        <div className="mb-2 flex items-center justify-between text-xs">
          <button
            type="button"
            className={
              hasWhiteSecondaryButton
                ? "rounded border px-1.5 py-0.5"
                : "rounded border-0 px-1.5 py-0.5"
            }
            style={{
              backgroundColor: calcSecondaryButtonColor,
              color: secondaryButtonTextColor,
              ...buttonShadowStyle,
            }}
          >
            {"<"}
          </button>
          <span>2026-04-15 to 2027-01-01</span>
          <button
            type="button"
            className={
              hasWhiteSecondaryButton
                ? "rounded border px-1.5 py-0.5"
                : "rounded border-0 px-1.5 py-0.5"
            }
            style={{
              backgroundColor: calcSecondaryButtonColor,
              color: secondaryButtonTextColor,
              ...buttonShadowStyle,
            }}
          >
            {">"}
          </button>
        </div>

        <div
          className="mb-2 h-24 rounded border"
          style={{ backgroundColor: "rgba(255,255,255,0.55)" }}
        />

        <div className="flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            className="rounded border px-2 py-1"
            style={{
              backgroundColor: calcColor,
              color: primaryButtonTextColor,
              ...buttonShadowStyle,
            }}
          >
            1 month
          </button>
          <button
            type="button"
            className={
              hasWhiteSecondaryButton
                ? "rounded border px-2 py-1"
                : "rounded border-0 px-2 py-1"
            }
            style={{
              backgroundColor: calcSecondaryButtonColor,
              color: secondaryButtonTextColor,
              ...buttonShadowStyle,
            }}
          >
            3 months
          </button>
          <button
            type="button"
            className={
              hasWhiteSecondaryButton
                ? "rounded border px-2 py-1"
                : "rounded border-0 px-2 py-1"
            }
            style={{
              backgroundColor: calcSecondaryButtonColor,
              color: secondaryButtonTextColor,
              ...buttonShadowStyle,
            }}
          >
            6 months
          </button>
          <button
            type="button"
            className={
              hasWhiteSecondaryButton
                ? "rounded border px-2 py-1 font-semibold"
                : "rounded border-0 px-2 py-1 font-semibold"
            }
            style={{
              backgroundColor: calcSecondaryButtonColor,
              color: secondaryButtonTextColor,
              ...buttonShadowStyle,
            }}
          >
            all
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="rounded px-2 py-1 text-xs font-semibold inline-flex items-end w-fit"
          style={{
            backgroundColor: calcColor,
            color: primaryButtonTextColor,
            ...buttonShadowStyle,
          }}
        >
          Add Transaction
        </button>
      </div>

      <div
        className="mt-2 rounded-md border p-2 shadow-lg ring-1 ring-black/5"
        style={{ backgroundColor: calcAccentColor, color: accentTextColor }}
      >
        <div className="mb-2 text-xs font-semibold">Transactions</div>
      </div>
    </div>
  );
}
