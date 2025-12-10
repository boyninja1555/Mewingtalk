"use client"

import type { Post } from "@/generated/prisma"
import { useEffect, useState } from "react"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { PostCardClient } from "@/components/post-clients"
import CreatePostCard from "@/components/create-post"

export default function Home() {
	const [posts, setPosts] = useState<Post[]>([])
	const [live, setLive] = useState(false)

	async function loadPosts() {
		try {
			const response = await fetch("/api/posts/top")
			const data = await response.json() as ApiResponse

			if (!data.success || !data.data)
				throw new Error(data.message)

			setPosts(data.data as Post[])
		} catch (ex) {
			toast(ex instanceof Error ? ex.message : String(ex))
		}
	}

	useEffect(() => {
		const savedLive = localStorage.getItem("live")

		if (!savedLive)
			return

		setLive(savedLive === "on")
	}, [])

	useEffect(() => {
		localStorage.setItem("live", live ? "on" : "off")
		loadPosts()

		if (!live)
			return

		const interval = setInterval(loadPosts, 5000)
		return () => clearInterval(interval)
	}, [live])

	return (
		<div className="mx-auto pt-10 px-4 max-w-2xl">
			<Card>
				<CardHeader>
					<CardTitle>Latest posts</CardTitle>
					<CardAction className="flex items-center gap-1">
						<Checkbox id="live-checkbox" checked={live} onCheckedChange={(ev) => setLive(ev.valueOf() as boolean)} />
						<Label htmlFor="live-checkbox">Live</Label>
					</CardAction>
				</CardHeader>
				<CardContent className="flex flex-col gap-2">
					<CreatePostCard />

					{posts.map((post: Post) => <PostCardClient key={post.id} post={post} linkToPost />)}
				</CardContent>
			</Card>
		</div>
	)
}
