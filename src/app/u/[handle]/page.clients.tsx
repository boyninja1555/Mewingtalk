"use client"

import type { User } from "@/generated/prisma"
import CreatePostCard from "@/components/create-post"
import { useSession } from "@/lib/auth-client"

export function ProfileClient1({
    profileUser,
}: {
    profileUser: User
}) {
    const { data: session, isPending, } = useSession()

    if (isPending)
        return null

    if (profileUser.id !== session?.user.id)
        return null

    return <CreatePostCard />
}
