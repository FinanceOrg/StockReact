"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";

import {
  ColumnHeaderWithFilter,
  TextColumnFilter,
} from "@/components/table/ColumnFilterControls";
import FilterableDataTable from "@/components/table/FilterableDataTable";
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

  const columns = useMemo<ColumnDef<AssetVendor>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <ColumnHeaderWithFilter column={column} label="Name">
            <TextColumnFilter column={column} />
          </ColumnHeaderWithFilter>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3 font-semibold sm:font-normal">
            {row.original.style?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={row.original.style.image}
                alt={row.original.name}
                className="size-7 shrink-0 rounded object-contain"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            ) : row.original.style?.color ? (
              <span
                className="inline-block size-7 shrink-0 rounded"
                style={{ backgroundColor: row.original.style.color }}
              />
            ) : null}
            {row.original.name}
          </div>
        ),
      },
      {
        accessorKey: "description",
        header: ({ column }) => (
          <ColumnHeaderWithFilter column={column} label="Description">
            <TextColumnFilter column={column} />
          </ColumnHeaderWithFilter>
        ),
        cell: ({ row }) => row.original.description ?? "-",
      },
    ],
    [],
  );

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => openModal()}>Create new vendor</Button>
      </div>

      <div className="mb-4">
        <FilterableDataTable
          title="Vendors"
          columns={columns}
          data={vendors}
          gridClassName="grid-cols-1 sm:grid-cols-2"
          emptyText="No vendors yet. Create your first one!"
          onRowClick={openModal}
          getMobileLabel={(columnId) => columnId}
          getCellValueClassName={(_, columnId) =>
            columnId === "description" ? "text-gray-600" : ""
          }
        />
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
