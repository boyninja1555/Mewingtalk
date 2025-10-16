"use client"

import type { Post, User } from "@/generated/prisma"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { formatDate, formatTime } from "@/lib/date-time"
import { useSession } from "@/lib/auth-client"
import { MdCheck, MdContentCopy, MdIosShare, MdOutlineDelete } from "react-icons/md"
import DefaultProfile from "@/assets/oauth/default.svg"

export function PostCardClient({
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

export function PostCardClient2({
    post,
}: {
    post: Post
}) {
    const router = useRouter()

    function visitPost() {
        router.push(`/post/${post.id}`)
    }

    return (
        <Button variant="outline" onClick={visitPost}>
            Visit
        </Button>
    )
}

export function PostCardClient3({
    post,
}: {
    post: Post
}) {
    const [publicUrl, setPublicUrl] = useState("")
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        setPublicUrl(`${window.location.origin}/post/${post.id}`)
    }, [])

    function copy() {
        navigator.clipboard.writeText(publicUrl)

        setCopied(true)
        setTimeout(() => setCopied(false), 1000)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <MdIosShare />
                    Share
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Share post</DialogTitle>
                    <DialogDescription>Copy the link below to share this post.</DialogDescription>
                </DialogHeader>
                <Input value={publicUrl} readOnly />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                    </DialogClose>
                    <Button onClick={copy}>
                        {copied ? <MdCheck /> : <MdContentCopy />}
                        Copy
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
