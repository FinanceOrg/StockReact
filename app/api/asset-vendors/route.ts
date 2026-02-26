import { assetVendorService } from "@/lib/services/asset-vendor.service"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const vendors = await assetVendorService.getAll()
    return NextResponse.json(vendors, { status: 200 })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch vendors"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const vendor = await assetVendorService.create(body)
    return NextResponse.json(vendor, { status: 201 })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create vendor"

    if (message.includes("Validation failed")) {
      return NextResponse.json({ error: message }, { status: 400 })
    }

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
