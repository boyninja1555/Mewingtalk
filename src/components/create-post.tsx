"use client"

import type { Post } from "@/generated/prisma"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { formatDate, formatTime } from "@/lib/date-time"
import { useSession } from "@/lib/auth-client"
import DefaultProfile from "@/assets/oauth/default.svg"

export default function CreatePostCard() {
    const router = useRouter()
    const { data: session, isPending, } = useSession()
    const [post, setPost] = useState("")
    const [error, setError] = useState<string | null>(null)

    if (!session || isPending)
        return null

    async function createPost() {
        try {
            setError(null)

            const response = await fetch("/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    authorId: session?.user.id,
                    content: post,
                }),
            })

            if (!response.ok)
                throw new Error("Could not create post")

            const data = await response.json() as ApiResponse

            if (!data.success || !data.data)
                throw new Error(data.message)

            const newPost = data.data as Post
            toast("Post created", {
                description: `${formatDate(newPost.createdAt)} — ${formatTime(newPost.createdAt)}`,
            })
            setPost("")
            router.refresh()
        } catch (ex) {
            setError(ex instanceof Error ? ex.message : String(ex))
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <Link href={`/@${(session.user as any).handle}`} className="override flex items-center gap-1 w-max">
                        <img src={session.user.image ?? DefaultProfile.src} alt="#" className="h-5 aspect-square rounded-md" />
                        <span>{session.user.name ?? "Anonymous"}</span>
                    </Link>
                </CardTitle>
                <CardDescription className="flex justify-between">
                    <span>Date &mdash; Time</span>
                    {error && <span className="text-destructive">{error}</span>}
                </CardDescription>
                <CardAction>
                    <Button onClick={createPost}>Post</Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                <Textarea value={post} onChange={(ev) => setPost(ev.target.value)} />
                {/* <img src={post.imageUrl ?? "null"} alt="Attachment" className="mt-2 text-muted-foreground border rounded-md w-full" /> */}
            </CardContent>
        </Card>
    )
}
