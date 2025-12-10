"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Loading from "@/components/loading"
import { redirectSignIn } from "@/components/sign-in"
import { useHandleCache } from "@/lib/handle-cache"
import { useSession } from "@/lib/auth-client"

export default function ProfileRedirect() {
    const router = useRouter()
    const handleCache = useHandleCache()
    const { data: session, isPending, } = useSession()

    useEffect(() => {
        if (isPending)
            return

        let handle = handleCache.get()

        if (handle) {
            router.push(`/@${handle}`)
            return
        }

        if (!session) {
            redirectSignIn(router, {
                redirectSuccess: "/profile",
                redirectFailiure: "/",
            })
            return
        }

        handle = (session.user as any).handle
        handleCache.set(handle)
        router.push(`/@${handle}`)
    }, [session, router])

    return <Loading />
}
