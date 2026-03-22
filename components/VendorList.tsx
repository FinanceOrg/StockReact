"use client";

import clsx from "clsx";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { AssetVendor } from "@/types/domain";

import VendorModal from "./VendorModal";

export default function VendorList({
  vendors: initialVendors,
}: {
  vendors: AssetVendor[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<AssetVendor | null>(
    null,
  );
  const [vendors, setVendors] = useState(initialVendors);

  const openModal = (vendor: AssetVendor | null = null) => {
    setSelectedVendor(vendor);
    setIsModalOpen(true);
  };

  const handleVendorUpdate = (updated: AssetVendor) => {
    setVendors((prev) => {
      const updatedList = prev.map((v) =>
        v.id === updated.id ? { ...v, ...updated } : v,
      );
      return prev.some((v) => v.id === updated.id)
        ? updatedList
        : [updated, ...prev];
    });
  };

  const handleVendorDelete = (id: number) => {
    setVendors((prev) => prev.filter((v) => v.id !== id));
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => openModal()}>Create new vendor</Button>
      </div>

      <div className="mb-4">
        <div className="hidden sm:flex bg-white rounded-t-lg border-b border-gray-300 px-4">
          <div className="py-2 sm:basis-1/2">Name</div>
          <div className="py-2 sm:basis-1/2">Description</div>
        </div>

        {vendors.length === 0 && (
          <div className="bg-white rounded-lg px-4 py-6 text-center text-gray-500">
            No vendors yet. Create your first one!
          </div>
        )}

        {vendors.map((vendor, i) => (
          <div
            key={vendor.id}
            onClick={() => openModal(vendor)}
            className={clsx(
              "flex flex-wrap sm:flex-nowrap py-3 px-4 bg-white cursor-pointer",
              "hover:bg-white/70 transition duration-300",
              i === vendors.length - 1 && "rounded-b-lg",
              i === 0 && vendors.length > 0 && "rounded-t-lg sm:rounded-t-none",
            )}
          >
            <div className="flex items-center gap-3 sm:basis-1/2 font-bold sm:font-normal">
              {vendor.style?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={vendor.style.image}
                  alt={vendor.name}
                  className="size-7 rounded object-contain shrink-0"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              ) : vendor.style?.color ? (
                <span
                  className="inline-block size-7 rounded shrink-0"
                  style={{ backgroundColor: vendor.style.color }}
                />
              ) : null}
              {vendor.name}
            </div>
            <div className="sm:basis-1/2 text-sm text-gray-500">
              {vendor.description ?? "—"}
            </div>
          </div>
        ))}
      </div>

      <VendorModal
        vendor={selectedVendor}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={handleVendorUpdate}
        onDelete={handleVendorDelete}
      />
    </div>
  );
}
