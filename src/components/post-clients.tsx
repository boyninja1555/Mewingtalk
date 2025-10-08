"use client"

import type { Post, User } from "@/generated/prisma"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { formatDate, formatTime } from "@/lib/date-time"
import { useSession } from "@/lib/auth-client"
import { MdOutlineDelete } from "react-icons/md"
import DefaultProfile from "@/assets/oauth/default.svg"

export function PostCardClient({
    post,
    canDelete,
}: {
    post: Post
    canDelete?: true
}) {
    const [author, setAuthor] = useState<User | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadAuthor() {
            try {
                const response = await fetch("/api/users/get", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: post.authorId,
                    }),
                })

                if (!response.ok)
                    throw new Error("Mewingtalk is down")

                const data = await response.json() as ApiResponse

                if (!data.success || !data.data)
                    throw new Error(data.message)

                setAuthor(data.data as User)
            } catch (ex) {
                setError(ex instanceof Error ? ex.message : String(ex))
            }
        }

        loadAuthor()
    }, [post])

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <Link href={author ? `/@${author?.handle}` : "#"} className="override flex items-center gap-1 w-max">
                        <img src={author?.image ?? DefaultProfile.src} alt="#" className="h-5 aspect-square rounded-md" />
                        <span>{author?.name ?? "Anonymous"}</span>
                    </Link>
                </CardTitle>
                <CardDescription className="flex justify-between">
                    {formatDate(post.createdAt)} &mdash; {formatTime(post.createdAt)}
                    {error && <span className="text-destructive">{error}</span>}
                </CardDescription>
                <CardAction>
                    {canDelete && <PostCardClient1 post={post} />}
                </CardAction>
            </CardHeader>
            <CardContent>
                <p>{post.content}</p>

                {post.imageUrl && (
                    <img src={post.imageUrl ?? "null"} alt="Attachment" className="mt-2 text-muted-foreground border rounded-md w-full" />
                )}
            </CardContent>
        </Card>
    )
}

export function PostCardClient1({
    post,
}: {
    post: Post,
}) {
    const router = useRouter()
    const { data: session, isPending, } = useSession()
    const [latestResponseContext, setLatestResponseContext] = useState<string | null>(null)

    async function deletePost() {
        try {
            const response = await fetch("/api/posts", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: post.id,
                }),
            })

            if (!response.ok)
                throw new Error("Mewingtalk is down")

            const data = await response.json() as ApiResponse
            setLatestResponseContext(data.context)

            if (!data.success)
                throw new Error(data.message)

            toast(data.message, {
                description: `Returned from ${data.context}`,
            })
            router.refresh()
        } catch (ex) {
            toast(ex instanceof Error ? ex.message : String(ex), {
                description: `Returned from ${latestResponseContext ?? "unknown source"}`,
            })
        }
    }

    if (!session || isPending)
        return null

    return session.user.id === post.authorId && (
        <Button variant="destructive" onClick={deletePost}>
            <MdOutlineDelete />
        </Button>
    )
}
