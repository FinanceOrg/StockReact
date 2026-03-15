"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Asset, Transaction } from "@/types/domain";

import TransactionModal from "./TransactionModal";

export default function AssetTransactions({
  asset,
  transactions,
}: {
  asset: Asset;
  transactions: Transaction[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const [localTransactions, setLocalTransactions] = useState(transactions);

  const openModal = (transaction: Transaction | null = null) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleTransactionUpdate = (updated: Transaction) => {
    setLocalTransactions((prev) => {
      const updatedList = prev.map((t) =>
        t.id === updated.id ? { ...t, ...updated } : t,
      );

      return prev.some((t) => t.id === updated.id)
        ? updatedList
        : [updated, ...prev];
    });
  };

  const handleTransactionDelete = (id: number) => {
    setLocalTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    setLocalTransactions(transactions);
  }, [transactions]);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => openModal()}>Add Transaction</Button>
      </div>

      <div className="mb-4">
        <div className="hidden sm:flex bg-white rounded-t-lg border-b border-gray-300 justify-center px-2">
          <div className="py-2 text-center sm:basis-1/4">Name</div>
          <div className="py-2 text-center sm:basis-1/4">Amount</div>
          <div className="py-2 text-center sm:basis-1/4">Transaction date</div>
          <div className="py-2 text-center sm:basis-1/4">Type</div>
        </div>

        {localTransactions.map((row, i) => (
          <div
            key={row.id}
            onClick={() => openModal(row)}
            className={clsx(
              "flex flex-wrap sm:flex-nowrap py-2 justify-between px-4 sm:px-2 bg-white cursor-pointer",
              "sm:bg-white/90 hover:bg-white/70 transition duration-300",
              i === localTransactions.length - 1 && "rounded-b-lg",
              i === 0 && "rounded-t-lg sm:rounded-t-none",
            )}
          >
            <div className="sm:text-center sm:basis-1/4 basis-1/2 font-bold sm:font-normal">
              {row.name}
            </div>

            <div className="sm:text-center sm:basis-1/4 basis-1/2 text-right">
              {row.amount}{" "}
              {typeof asset.currency === "string"
                ? asset.currency
                : asset.currency.symbol}
            </div>

            <div className="sm:text-center sm:basis-1/4 basis-1/2">
              {row.date}
            </div>

            <div className="sm:text-center sm:basis-1/4 hidden sm:block">
              {row.type}
            </div>
          </div>
        ))}

        <TransactionModal
          transaction={selectedTransaction}
          assetId={asset.id}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onSuccess={handleTransactionUpdate}
          onDelete={handleTransactionDelete}
        />
      </div>
    </div>
  );
}
