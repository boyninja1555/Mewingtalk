import apiResponder from "@/lib/api-responder"
import prisma from "@/lib/prisma"

export async function GET() {
    const responder = apiResponder("get-posts")
    const posts = await prisma.post.findMany({
        orderBy: {
            createdAt: "desc",
        },
        take: 100,
        include: {
            author: {},
        },
    })
    return responder.apiResponse({
        success: true,
        message: "Top 100 posts found",
        data: posts,
    })
}
