"use client"

import { Button } from "@/components/ui/button"
import { signIn } from "@/lib/auth-client"

export default function OAuthButton({
    id,
    name,
    logo,
    short,
}: {
    id: string
    name: string
    logo?: string
    short?: true
}) {
    return (
        <Button variant="outline" onClick={() => signIn.social({
            provider: id,
        })} className="flex items-center gap-2">
            {logo && (
                <img
                    src={logo}
                    alt="#"
                    className="h-full aspect-square"
                />
            )}

            <span>
                {short ? name : `Sign in with ${name}`}
            </span>
        </Button>
    )
}
