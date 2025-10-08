"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Loading from "@/components/loading"
import { redirectSignIn } from "@/components/sign-in"
import { useSession } from "@/lib/auth-client"

export default function ProfileRedirect() {
    const router = useRouter()
    const { data: session, isPending, } = useSession()

    useEffect(() => {
        if (isPending)
            return

        if (!session) {
            redirectSignIn(router, {
                redirectSuccess: "/profile",
                redirectFailiure: "/",
            })
            return
        }

        router.push(`/@${session.user.handle}`)
    }, [session, router])

    return <Loading />
}
