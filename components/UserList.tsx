"use client";

import clsx from "clsx";
import { useState } from "react";

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

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => openModal()}>Create new user</Button>
      </div>

      <div className="mb-4">
        <div className="hidden sm:flex bg-white rounded-t-lg border-b border-gray-300 px-4">
          <div className="py-2 sm:basis-1/3">Name</div>
          <div className="py-2 sm:basis-1/3">Email</div>
          <div className="py-2 sm:basis-1/3">Balance</div>
        </div>

        {users.length === 0 && (
          <div className="bg-white rounded-lg px-4 py-6 text-center text-gray-500">
            No users yet. Create your first one!
          </div>
        )}

        {users.map((user, index) => (
          <div
            key={user.id}
            onClick={() => openModal(user)}
            className={clsx(
              "flex flex-wrap sm:flex-nowrap py-3 px-4 bg-white cursor-pointer",
              "hover:bg-white/70 transition duration-300",
              index === users.length - 1 && "rounded-b-lg",
              index === 0 &&
                users.length > 0 &&
                "rounded-t-lg sm:rounded-t-none",
            )}
          >
            <div className="sm:basis-1/3 font-bold sm:font-normal">
              {user.name}
            </div>
            <div className="sm:basis-1/3 text-sm text-gray-500">
              {user.email}
            </div>
            <div className="sm:basis-1/3 text-sm text-gray-500">
              {Intl.NumberFormat("hu-HU").format(user.totalValue)} Ft
            </div>
          </div>
        ))}
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
