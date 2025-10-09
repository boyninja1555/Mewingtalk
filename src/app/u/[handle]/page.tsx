"use server"

import type { Metadata } from "next"
import Loading from "@/components/loading"
import PostCard from "@/components/post"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileClient1 } from "./page.clients"
import { formatDate } from "@/lib/date-time"
import prisma from "@/lib/prisma"
import DefaultProfile from "@/assets/oauth/default.svg"

export async function generateMetadata({
    params,
}: {
    params: Promise<{
        handle: string
    }>
}): Promise<Metadata> {
    const { handle, } = await params
    const user = await prisma.user.findFirst({
        where: {
            handle: handle,
        },
    })

    if (!user)
        return {
            title: "User not found - Mewingtalk",
        }

    return {
        title: `${user.name} - Mewingtalk`,
    }
}

export default async function Profile({
    params,
}: {
    params: Promise<{
        handle: string
    }>
}) {
    const { handle, } = await params
    const user = await prisma.user.findFirst({
        where: {
            handle: handle,
        },
    })

    if (!user)
        return <Loading />

    const posts = await prisma.post.findMany({
        where: {
            author: user,
        },
        orderBy: {
            createdAt: "desc",
        },
    })

    return (
        <div className="mx-auto pt-10 px-4 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-1">
                        <img src={user.image || DefaultProfile.src} alt="#" className="h-6 aspect-square rounded-md" />
                        <span>{user.name}</span>
                    </CardTitle>
                    <CardDescription>
                        @{user.handle} &mdash; {formatDate(user.createdAt)}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    <ProfileClient1 profileUser={user} />

                    {posts.map((post) => <PostCard key={post.id} post={post} linkToPost canDelete />)}
                </CardContent>
            </Card>
        </div>
    )
}
