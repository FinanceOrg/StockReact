"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";

import {
  ColumnHeaderWithFilter,
  NumberRangeColumnFilter,
  TextColumnFilter,
  numberRangeFilterFn,
} from "@/components/table/ColumnFilterControls";
import FilterableDataTable from "@/components/table/FilterableDataTable";
import { Button } from "@/components/ui/button";
import { User } from "@/types/domain";

import UserModal from "./UserModal";

export default function UserList({ users: initialUsers }: { users: User[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState(initialUsers);

  const openModal = (user: User | null = null) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleUserUpdate = (updated: User) => {
    setUsers((prev) => {
      const updatedList = prev.map((user) =>
        user.id === updated.id ? { ...user, ...updated } : user,
      );

      return prev.some((user) => user.id === updated.id)
        ? updatedList
        : [updated, ...prev];
    });
  };

  const handleUserDelete = (id: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <ColumnHeaderWithFilter column={column} label="Name">
            <TextColumnFilter column={column} />
          </ColumnHeaderWithFilter>
        ),
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <ColumnHeaderWithFilter column={column} label="Email">
            <TextColumnFilter column={column} />
          </ColumnHeaderWithFilter>
        ),
      },
      {
        accessorKey: "totalValue",
        filterFn: numberRangeFilterFn<User>(),
        header: ({ column }) => (
          <ColumnHeaderWithFilter column={column} label="Balance">
            <NumberRangeColumnFilter column={column} />
          </ColumnHeaderWithFilter>
        ),
        cell: ({ row }) =>
          `${Intl.NumberFormat("hu-HU").format(row.original.totalValue)} Ft`,
      },
    ],
    [],
  );

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => openModal()}>Create new user</Button>
      </div>

      <div className="mb-4">
        <FilterableDataTable
          title="Users"
          columns={columns}
          data={users}
          gridClassName="grid-cols-1 sm:grid-cols-3"
          emptyText="No users yet. Create your first one!"
          onRowClick={openModal}
          getMobileLabel={(columnId) =>
            columnId === "totalValue" ? "Balance" : columnId
          }
          getCellValueClassName={(row, columnId) => {
            if (columnId === "name") {
              return "font-semibold sm:font-normal";
            }

            if (columnId === "email" || columnId === "totalValue") {
              return "text-gray-600";
            }

            return "";
          }}
        />
      </div>

      <UserModal
        user={selectedUser}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={handleUserUpdate}
        onDelete={handleUserDelete}
      />
    </div>
  );
}
