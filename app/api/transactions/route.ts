import { getHeaders, getDefaultServerError } from "@/lib/api/helper"
import { getToken, validate } from "@/lib/api/validation"
import { createTransactionSchema } from "@/validators/transaction.schema"
import { NextResponse } from "next/server"

const baseUrl = process.env.API_BASE_URL

export async function GET(req: Request) {
  try {
    const token = await getToken()
    const headers = getHeaders(token, false)

    const backendRes = await fetch(`${baseUrl}/transactions`, {
      method: "GET",
      headers,
    })

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch transactions" },
        { status: backendRes.status }
      )
    }

    const transactions = await backendRes.json()
    return NextResponse.json(transactions, { status: 200 })
  } catch (error) {
    return getDefaultServerError()
  }
}

export async function POST(req: Request) {
  try {
    const token = await getToken()
    const body = await req.json()

    const parsed = validate(createTransactionSchema, body)
    if (!parsed.success) {
      return parsed.response
    }

    const headers = getHeaders(token, true)

    const backendRes = await fetch(`${baseUrl}/transactions`, {
      method: "POST",
      headers,
      body: JSON.stringify(parsed.data),
    })

    if (!backendRes.ok) {
      const errorData = await backendRes.json()
      return NextResponse.json(errorData, { status: backendRes.status })
    }

    const transaction = await backendRes.json()
    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    return getDefaultServerError()
  }
}
