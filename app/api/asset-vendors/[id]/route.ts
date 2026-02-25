import { getToken, validate } from "@/lib/api/validation"
import { updateVendorSchema } from "@/validators/vendor.schema"
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

    const backendRes = await fetch(`${baseUrl}/asset-vendors/${id}`, {
      method: "GET",
      headers,
    })

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: "Vendor not found" },
        { status: backendRes.status }
      )
    }

    const vendor = await backendRes.json()
    return NextResponse.json(vendor, { status: 200 })
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

    const parsed = validate(updateVendorSchema, body)
    if (!parsed.success) {
      return parsed.response
    }

    const headers = getHeaders(token, false)
    const backendRes = await fetch(`${baseUrl}/asset-vendors/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(parsed.data),
    })

    if (!backendRes.ok) {
      const errorData = await backendRes.json()
      return NextResponse.json(errorData, { status: backendRes.status })
    }

    const vendor = await backendRes.json()
    return NextResponse.json(vendor, { status: 200 })
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

    const backendRes = await fetch(`${baseUrl}/asset-vendors/${id}`, {
      method: "DELETE",
      headers,
    })

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: "Failed to delete vendor" },
        { status: backendRes.status }
      )
    }

    return NextResponse.json(
      { success: true, message: "Vendor deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    return getDefaultServerError()
  }
}
