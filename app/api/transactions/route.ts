import { transactionService } from "@/lib/services/transaction.service"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const transactions = await transactionService.getAll()
    return NextResponse.json(transactions, { status: 200 })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch transactions"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const transaction = await transactionService.create(body)
    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create transaction"

    if (message.includes("Validation failed")) {
      return NextResponse.json({ error: message }, { status: 400 })
    }

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
