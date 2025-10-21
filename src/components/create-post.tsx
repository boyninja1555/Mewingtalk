"use client"

import type { Post } from "@/generated/prisma"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { formatDate, formatTime } from "@/lib/date-time"
import { useSession } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import DefaultProfile from "@/assets/oauth/default.svg"

const MAX_POST_LENGTH = 200

export default function CreatePostCard() {
    const router = useRouter()
    const { data: session, isPending, } = useSession()
    const [post, setPost] = useState("")
    const [pic, setPic] = useState("")
    const [error, setError] = useState<string | null>(null)

    if (!session || isPending)
        return null

    async function createPost() {
        try {
            if (post.trim() == "")
                throw new Error("Missing post content")

            if (post.trim().length > MAX_POST_LENGTH)
                throw new Error("Post too long")

            const localPost = { post, }.post
            const localPic = { pic, }.pic
            setError(null)
            setPost("")
            setPic("")

            const response = await fetch("/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: localPost.trim(),
                    imageUrl: localPic.trim() == "" ? null : localPic.trim(),
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
                    <span className={cn(post.trim().length > MAX_POST_LENGTH && "text-destructive")}>{post.trim().length}/{MAX_POST_LENGTH}</span>
                    {error && <span className="text-destructive">{error}</span>}
                </CardDescription>
                <CardAction className="flex gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline">Attach Pic</Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <p className="mb-2">For now, we cannot afford your pics. However, you can paste an image link, which includes GIFs from <a href="https://giphy.com">Giphy</a> and <a href="https://tenor.com">Tenor</a>.</p>
                            <Input value={pic} onChange={(ev) => setPic(ev.target.value.trim())} placeholder="https://media1.tenor.com/m/XXX/XXX.gif" />
                        </PopoverContent>
                    </Popover>
                    <Button onClick={createPost}>Post</Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                <Textarea value={post} onChange={(ev) => setPost(ev.target.value)} required />
                <span className="mt-2 text-muted-foreground text-sm md:text-center">What you post is your responsibility, but we can do whatever the fuck we want with it.</span>
                {pic && <img src={pic} alt="Attachment" className="mt-2 text-muted-foreground border rounded-md w-full" />}
            </CardContent>
        </Card>
    )
}
