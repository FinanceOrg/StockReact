import { NextResponse } from "next/server";

import { transactionService } from "@/lib/services/transaction.service";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const url = new URL(req.url);
    const from = url.searchParams.get("from") || undefined;
    const to = url.searchParams.get("to") || undefined;

    const transactions = await transactionService.getByAssetId(id, {
      from,
      to,
    });
    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch asset";

    if (message.includes("not found")) {
      return NextResponse.json({ error: message }, { status: 404 });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
