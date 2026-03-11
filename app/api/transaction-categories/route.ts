import { NextResponse } from "next/server";

import { transactionCategoryService } from "@/lib/services/transaction-category.service";

export async function GET() {
  try {
    const categories = await transactionCategoryService.getAll();
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch transaction categories";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const category = await transactionCategoryService.create(body);
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to create transaction category";

    if (message.includes("Validation failed")) {
      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
