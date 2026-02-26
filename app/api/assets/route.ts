import { assetService } from "@/lib/services/asset.service"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const assets = await assetService.getAll()
    return NextResponse.json(assets, { status: 200 })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch assets"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const asset = await assetService.create(body)
    return NextResponse.json(asset, { status: 201 })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create asset"

    if (message.includes("Validation failed")) {
      return NextResponse.json({ error: message }, { status: 400 })
    }

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
