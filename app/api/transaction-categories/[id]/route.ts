import { getToken, validate } from "@/lib/api/validation"
import { updateTransactionCategorySchema } from "@/validators/transaction-category.schema"
import { NextResponse } from "next/server"
import { getDefaultServerError, getHeaders } from "@/lib/api/helper"

const baseUrl = process.env.API_BASE_URL

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const token = await getToken()
    const headers = getHeaders(token, false)

    const backendRes = await fetch(`${baseUrl}/transaction-categories/${id}`, {
      method: "GET",
      headers,
    })

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: "Transaction category not found" },
        { status: backendRes.status }
      )
    }

    const category = await backendRes.json()
    return NextResponse.json(category, { status: 200 })
  } catch (error) {
    return getDefaultServerError()
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const token = await getToken()
    const body = await req.json()

    const parsed = validate(updateTransactionCategorySchema, body)
    if (!parsed.success) {
      return parsed.response
    }

    const headers = getHeaders(token, false)
    const backendRes = await fetch(`${baseUrl}/transaction-categories/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(parsed.data),
    })

    if (!backendRes.ok) {
      const errorData = await backendRes.json()
      return NextResponse.json(errorData, { status: backendRes.status })
    }

    const category = await backendRes.json()
    return NextResponse.json(category, { status: 200 })
  } catch (error) {
    return getDefaultServerError()
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const token = await getToken()
    const headers = getHeaders(token, false)

    const backendRes = await fetch(`${baseUrl}/transaction-categories/${id}`, {
      method: "DELETE",
      headers,
    })

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: "Failed to delete transaction category" },
        { status: backendRes.status }
      )
    }

    return NextResponse.json(
      { success: true, message: "Transaction category deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    return getDefaultServerError()
  }
}
