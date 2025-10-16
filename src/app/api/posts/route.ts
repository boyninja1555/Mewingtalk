import type { NextRequest } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import apiResponder from "@/lib/api-responder"

export async function GET(request: NextRequest) {
    const { id: postId, } = await request.json() as {
        id?: string
    }
    const responder = apiResponder("get-post")
    const post = await prisma.post.findUnique({
        where: {
            id: postId,
        },
    })

    if (!post)
        return responder.apiResponse({
            success: false,
            message: "Post not found",
        }, 404)

    return responder.apiResponse({
        success: true,
        message: "Post found",
        data: post,
    })
}

export async function POST(request: NextRequest) {
    const {
        content,
        imageUrl,
    } = await request.json() as {
        content?: string
        imageUrl?: string
    }
    const responder = apiResponder("create-post")
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session?.user)
        return responder.apiResponse({
            success: false,
            message: "Unauthorized",
        }, 401)

    if (!content || content.trim() == "" || !imageUrl)
        responder.apiResponse({
            success: false,
            message: "Invalid request body",
        }, 400)

    const post = await prisma.post.create({
        data: {
            authorId: session.user.id,
            content: content!,
            imageUrl,
        },
    })

    if (!post)
        return responder.apiResponse({
            success: false,
            message: "Post not created",
        }, 404)

    return responder.apiResponse({
        success: true,
        message: "Post created",
        data: post,
    })
}

export async function DELETE(request: NextRequest) {
    const { id: postId, } = await request.json() as {
        id?: string
    }
    const responder = apiResponder("delete-post")
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session?.user)
        return responder.apiResponse({
            success: false,
            message: "Unauthorized",
        }, 401)

    const post = await prisma.post.findUnique({
        where: {
            id: postId,
        },
    })

    if (!post)
        return responder.apiResponse({
            success: false,
            message: "Post not found",
        }, 404)

    if (post.authorId !== session.user.id)
        return responder.apiResponse({
            success: false,
            message: "Forbidden",
        }, 403)

    await prisma.post.delete({
        where: {
            id: postId,
        },
    })
    return responder.apiResponse({
        success: true,
        message: "Post deleted",
    })
}
