import { CreateTransactionCategoryInput, UpdateTransactionCategoryInput } from "@/validators/transaction-category.schema"

export interface TransactionCategory {
  id: string
  name: string
  style: {
    color: string
    icon: string
  }
  description?: string
  userId: number
  createdAt?: string
  updatedAt?: string
}

export class TransactionCategoryClient {
  private baseUrl = "/api/transaction-categories"

  async index(): Promise<TransactionCategory[]> {
    const res = await fetch(this.baseUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    if (!res.ok) throw new Error("Failed to fetch transaction categories")
    return await res.json()
  }

  async show<T extends TransactionCategory = TransactionCategory>(id: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    if (!res.ok) throw new Error("Transaction category not found")
    return await res.json()
  }

  async create<T extends TransactionCategory = TransactionCategory>(
    data: CreateTransactionCategoryInput
  ): Promise<T> {
    const res = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || "Failed to create transaction category")
    }
    return await res.json()
  }

  async update<T extends TransactionCategory = TransactionCategory>(
    id: string,
    data: UpdateTransactionCategoryInput
  ): Promise<T> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || "Failed to update transaction category")
    }
    return await res.json()
  }

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })

    if (!res.ok) throw new Error("Failed to delete transaction category")
    return await res.json()
  }
}

export const transactionCategoryClient = new TransactionCategoryClient()
