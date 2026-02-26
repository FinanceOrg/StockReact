import { assetCategoryService } from "@/lib/services/asset-category.service"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const categories = await assetCategoryService.getAll()
    return NextResponse.json(categories, { status: 200 })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch categories"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const category = await assetCategoryService.create(body)
    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create category"

    if (message.includes("Validation failed")) {
      return NextResponse.json({ error: message }, { status: 400 })
    }

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
