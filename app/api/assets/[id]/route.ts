import { getToken, validate } from "@/lib/api/validation"
import { updateAssetSchema } from "@/validators/asset.schema"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getDefaultServerError, getHeaders } from "@/lib/api/helper"

const baseUrl = process.env.API_BASE_URL

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = await getToken()
    const headers = getHeaders(token, false)

    const backendRes = await fetch(`${baseUrl}/assets/${id}`, {
      method: "GET",
      headers,
    })

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: "Asset not found" },
        { status: backendRes.status }
      )
    }

    const asset = await backendRes.json()
    return NextResponse.json(asset, { status: 200 })
  } catch (error) {
    return getDefaultServerError()
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = await getToken()
    const body = await req.json()

    const parsed = validate(updateAssetSchema, body)
    if (!parsed.success) {
      return parsed.response
    }

    const headers = getHeaders(token, false)
    const backendRes = await fetch(`${baseUrl}/assets/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(parsed.data),
    })

    if (!backendRes.ok) {
      const errorData = await backendRes.json()
      return NextResponse.json(errorData, { status: backendRes.status })
    }

    const asset = await backendRes.json()
    return NextResponse.json(asset, { status: 200 })
  } catch (error) {
    return getDefaultServerError()
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const backendRes = await fetch(`${baseUrl}/assets/${id}`, {
      method: "DELETE",
      headers,
    })

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: "Failed to delete asset" },
        { status: backendRes.status }
      )
    }

    return NextResponse.json(
      { success: true, message: "Asset deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    return getDefaultServerError()
  }
}
