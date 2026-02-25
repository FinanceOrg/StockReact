import { getHeaders, getDefaultServerError } from "@/lib/api/helper"
import { getToken, validate } from "@/lib/api/validation"
import { createTransactionCategorySchema } from "@/validators/transaction-category.schema"
import { NextResponse } from "next/server"

const baseUrl = process.env.API_BASE_URL

export async function GET(req: Request) {
  try {
    const token = await getToken()
    const headers = getHeaders(token, false)

    const backendRes = await fetch(`${baseUrl}/transaction-categories`, {
      method: "GET",
      headers,
    })

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch transaction categories" },
        { status: backendRes.status }
      )
    }

    const categories = await backendRes.json()
    return NextResponse.json(categories, { status: 200 })
  } catch (error) {
    return getDefaultServerError()
  }
}

export async function POST(req: Request) {
  try {
    const token = await getToken()
    const body = await req.json()

    const parsed = validate(createTransactionCategorySchema, body)
    if (!parsed.success) {
      return parsed.response
    }

    const headers = getHeaders(token, true)

    const backendRes = await fetch(`${baseUrl}/transaction-categories`, {
      method: "POST",
      headers,
      body: JSON.stringify(parsed.data),
    })

    if (!backendRes.ok) {
      const errorData = await backendRes.json()
      return NextResponse.json(errorData, { status: backendRes.status })
    }

    const category = await backendRes.json()
    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    return getDefaultServerError()
  }
}
