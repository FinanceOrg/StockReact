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
  onSuccess?: (asset: Asset) => void;
};

export default function AssetEditButton({
  asset,
  categories,
  vendors,
  onSuccess,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Edit asset"
        onClick={() => setOpen(true)}
      >
        <Icon icon={EditIcon} />
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
