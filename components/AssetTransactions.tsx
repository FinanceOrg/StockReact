"use client";

import clsx from "clsx";
import { useState } from "react";

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

  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  return (
    <div className="mb-4">
      {/* Header */}
      <div className="hidden sm:flex bg-white rounded-t-lg border-b border-gray-300 justify-center px-2">
        <div className="py-2 text-center sm:basis-1/4">Name</div>
        <div className="py-2 text-center sm:basis-1/4">Amount</div>
        <div className="py-2 text-center sm:basis-1/4">Transaction date</div>
        <div className="py-2 text-center sm:basis-1/4">Type</div>
      </div>

      {/* Rows */}
      {transactions.map((row, i) => (
        <div
          key={row.id}
          onClick={() => handleRowClick(row)}
          className={clsx(
            "flex flex-wrap sm:flex-nowrap py-2 justify-between px-4 sm:px-2 bg-white cursor-pointer",
            "sm:bg-white/90 hover:bg-white/70 transition duration-300",
            i === transactions.length - 1 && "rounded-b-lg",
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

      {selectedTransaction && (
        <TransactionModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          transactionId={selectedTransaction.id}
          transaction={selectedTransaction}
        />
      )}
    </div>
  );
}
