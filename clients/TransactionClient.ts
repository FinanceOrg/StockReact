import { CreateTransactionInput, UpdateTransactionInput } from "@/validators/transaction.schema"

export interface Transaction {
  id: string
  name: string
  amount: number
  type: "expense" | "income"
  date: string
  assetId: number
  categoryId: number
  userId: number
  createdAt?: string
  updatedAt?: string
}

export class TransactionClient {
  private baseUrl = "/api/transactions"

  async index(): Promise<Transaction[]> {
    const res = await fetch(this.baseUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    if (!res.ok) throw new Error("Failed to fetch transactions")
    return await res.json()
  }

  async show<T extends Transaction = Transaction>(id: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    if (!res.ok) throw new Error("Transaction not found")
    return await res.json()
  }

  async create<T extends Transaction = Transaction>(
    data: CreateTransactionInput
  ): Promise<T> {
    const res = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || "Failed to create transaction")
    }
    return await res.json()
  }

  async update<T extends Transaction = Transaction>(
    id: string,
    data: UpdateTransactionInput
  ): Promise<T> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || "Failed to update transaction")
    }
    return await res.json()
  }

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })

    if (!res.ok) throw new Error("Failed to delete transaction")
    return await res.json()
  }
}

export const transactionClient = new TransactionClient()
