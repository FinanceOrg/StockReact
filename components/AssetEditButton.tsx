"use client";

import { useState } from "react";

import AssetEditModal from "@/components/AssetEditModal";
import Icon from "@/components/Icon";
import EditIcon from "@/icons/edit.svg";
import { Asset, AssetVendor, Category } from "@/types/domain";

type Props = {
  asset: Asset;
  categories: Category[];
  vendors: AssetVendor[];
  color?: string;
  onSuccess?: (asset: Asset) => void;
};

export default function AssetEditButton({
  asset,
  categories,
  vendors,
  color,
  onSuccess,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Edit asset"
        onClick={() => setOpen(true)}
        className="rounded-2xl p-1 transition"
      >
        <Icon
          icon={EditIcon}
          className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
          style={{ color: color ?? "#000000" }}
        />
      </button>

      <AssetEditModal
        asset={asset}
        categories={categories}
        vendors={vendors}
        open={open}
        onOpenChange={setOpen}
        onSuccess={onSuccess}
      />
    </>
  );
}
