"use client"

import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GithubButton } from "@/components/oauth/github"
import { signUp, useSession } from "@/lib/auth-client"

export function redirectSignUp(router: AppRouterInstance, {
    redirectBack,
    redirectSuccess,
    redirectFailiure,
}: {
    redirectBack?: string
    redirectSuccess?: string
    redirectFailiure?: string
}): void {
    const params = new URLSearchParams()

    if (redirectBack)
        params.set("back", redirectBack)

    if (redirectSuccess)
        params.set("success", redirectSuccess)

    if (redirectFailiure)
        params.set("failiure", redirectFailiure)

    router.push(`/sign-up?${params.toString()}`)
}

export function SignUpButton({
    redirectBack,
    redirectSuccess,
    redirectFailiure,
    className,
    variant,
    ...props
}: React.ComponentProps<"button"> & {
    redirectBack?: string
    redirectSuccess?: string
    redirectFailiure?: string
    variant?: ShadCnVariant
}) {
    const router = useRouter()

    return (
        <Button
            onClick={() => redirectSignUp(router, {
                redirectBack,
                redirectSuccess,
                redirectFailiure,
            })}
            className={className}
            variant={variant}
            {...props}
        >
            Sign up
        </Button>
    )
}

export default function SignUpCard({
    showSignInLink,
    redirectBack,
    redirectSuccess,
    redirectFailiure,
    onSuccess,
    onFailiure,
}: {
    showSignInLink?: true,
    redirectBack?: string | false
    redirectSuccess?: string | false
    redirectFailiure?: string | false
    onSuccess?: () => void | false
    onFailiure?: (error: string) => void | false
}) {
    const router = useRouter()
    const { data: session, isPending, } = useSession()
    const [error, setError] = useState<string | null>(null)

    const [formValues, setFormValues] = useState({
        name: "",
        handle: "",
        email: "",
        password: "",
    })

    async function handleSubmit() {
        setError(null)

        const response = await signUp.email(formValues)

        if (response.error) {
            setError(response.error.message || "Something went wrong")
            return
        }

        if (!redirectSuccess) {
            if (onSuccess)
                onSuccess()

            return
        }

        router.push(redirectSuccess)
    }

    if (isPending)
        return null

    if (session?.user) {
        if (!redirectFailiure) {
            if (onFailiure)
                onFailiure("Already signed in")

            return
        }

        router.push(redirectFailiure)
        return null
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sign up</CardTitle>
                <CardDescription className="flex justify-between">
                    <span>
                        {showSignInLink ? (
                            <>
                                Create an account on Mewingtalk, or <Link href="/sign-in">sign in</Link>.
                            </>
                        ) : (
                            <>
                                Create an account on Mewingtalk.
                            </>
                        )}
                    </span>

                    {error && (
                        <span className="text-destructive">
                            {error}
                        </span>
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formValues.name}
                            onChange={(ev) => setFormValues((prev) => ({
                                ...prev,
                                name: ev.target.value,
                            }))}
                            placeholder="John Doe"
                        />
                    </div>

                    <div className="grid gap-3">
                        <Label htmlFor="handle">Handle</Label>
                        <Input
                            id="handle"
                            name="handle"
                            value={formValues.handle}
                            onChange={(ev) => setFormValues((prev) => ({
                                ...prev,
                                handle: ev.target.value,
                            }))}
                            placeholder="JohnDoe"
                        />
                    </div>

                    <div className="grid gap-3">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            value={formValues.email}
                            onChange={(ev) => setFormValues((prev) => ({
                                ...prev,
                                email: ev.target.value,
                            }))}
                            placeholder="johndoe@example.com"
                        />
                    </div>

                    <div className="grid gap-3">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            type="password"
                            id="password"
                            name="password"
                            value={formValues.password}
                            onChange={(ev) => setFormValues((prev) => ({
                                ...prev,
                                password: ev.target.value,
                            }))}
                            placeholder="***"
                        />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="gap-2 justify-end">
                {redirectBack && (
                    <Button variant="outline" onClick={() => router.push(redirectBack)}>
                        Back
                    </Button>
                )}

                <GithubButton short={true} />

                <Button onClick={handleSubmit}>
                    Sign up
                </Button>
            </CardFooter>
        </Card>
    )
}
