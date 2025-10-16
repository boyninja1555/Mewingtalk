"use server"

import type { Post } from "@/generated/prisma"
import Link from "next/link"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PostCardClient1, PostCardClient2, PostCardClient3 } from "./post-clients"
import { formatDate, formatTime } from "@/lib/date-time"
import prisma from "@/lib/prisma"
import DefaultProfile from "@/assets/oauth/default.svg"

export default async function PostCard({
    post,
    linkToPost,
    canShare,
    canDelete,
}: {
    post: Post
    linkToPost?: true
    canShare?: true
    canDelete?: true
}) {
    const author = await prisma.user.findFirst({
        where: {
            id: post.authorId,
        },
    })

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <Link href={author ? `/@${author?.handle}` : "#"} className="override flex items-center gap-1 w-max">
                        <img src={author?.image ?? DefaultProfile.src} alt="#" className="h-5 aspect-square rounded-md" />
                        <span>{author?.name ?? "Anonymous"}</span>
                    </Link>
                </CardTitle>
                <CardDescription>
                    {formatDate(post.createdAt)} &mdash; {formatTime(post.createdAt)}
                </CardDescription>
                <CardAction className="flex gap-2">
                    {linkToPost && <PostCardClient2 post={post} />}
                    {canShare && <PostCardClient3 post={post} />}
                    {canDelete && <PostCardClient1 post={post} />}
                </CardAction>
            </CardHeader>
            <CardContent>
                <p className="wrap-anywhere">
                    {post.content.split(" ").map((word: string, i: number) => (word.startsWith("http://") || word.startsWith("https://"))
                        ? <a key={i} href={word} target="_blank">{word} </a>
                        : `${word} `
                    )}
                </p>

                {post.imageUrl && (
                    <img src={post.imageUrl ?? "null"} alt="Attachment" className="mt-2 text-muted-foreground border rounded-md w-full" />
                )}
            </CardContent>
        </Card>
    )
}
