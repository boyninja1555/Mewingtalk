import type { Metadata } from "next"
import { notFound } from "next/navigation"
import PostCard from "@/components/post"
import prisma from "@/lib/prisma"

export async function generateMetadata({
    params,
}: {
    params: Promise<{
        id: string
    }>
}): Promise<Metadata> {
    const { id, } = await params
    const post = await prisma.post.findUnique({
        where: {
            id,
        },
    })

    if (!post)
        notFound()

    const author = await prisma.user.findUnique({
        where: {
            id: post.authorId,
        },
    })

    if (!author)
        notFound()

    return {
        title: `${post.content.substring(0, 25)}... - ${author.name} on Mewingtalk`,
        description: post.content,
    }
}

export default async function PostPage({
    params,
}: {
    params: Promise<{
        id: string
    }>
}) {
    const { id, } = await params
    const post = await prisma.post.findUnique({
        where: {
            id,
        },
    })

    if (!post)
        notFound()

    const author = await prisma.user.findUnique({
        where: {
            id: post.authorId,
        },
    })

    if (!author)
        notFound()

    return (
        <div className="mx-auto pt-10 px-4 max-w-2xl">
            <PostCard post={post} canShare />
        </div>
    )
}
