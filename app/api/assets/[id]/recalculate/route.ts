import { getDefaultServerError, getErrorFromBackendResponse, getHeaders } from "@/lib/api/helper"
import { getToken } from "@/lib/api/validation"
import { NextResponse } from "next/server"


const baseUrl = `${process.env.API_BASE_URL}/assets`
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const token = await getToken()
        const headers = getHeaders(token, false)

        const response = await fetch(`${baseUrl}/${id}/recalculate`, {
            method: "POST",
            headers
        })

        if (!response.ok) {
            return await getErrorFromBackendResponse(response)
        }

        return NextResponse.json({success: true, message: "Asset recalculated successfully" }, { status: 200 })

    } catch (error) {
        return getDefaultServerError()
    }


}