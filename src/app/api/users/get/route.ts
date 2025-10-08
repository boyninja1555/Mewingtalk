import type { NextRequest } from "next/server"
import apiResponder from "@/lib/api-responder"
import prisma from "@/lib/prisma"

export async function POST(request: NextRequest) {
    const responder = apiResponder("get-user")
    const { id, } = await request.json() as {
        id?: string
    }

    if (!id)
        return responder.apiResponse({
            success: false,
            message: "Invalid request body",
        }, 400)

    const user = await prisma.user.findUnique({
        where: {
            id,
        },
    })

    if (!user)
        return responder.apiResponse({
            success: false,
            message: "User not found",
        }, 404)

    return responder.apiResponse({
        success: true,
        message: "User found",
        data: user,
    })
}
