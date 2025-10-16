"use client"

import type { User } from "@/generated/prisma"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import CreatePostCard from "@/components/create-post"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateUser, useSession } from "@/lib/auth-client"

export function ProfileClient1({
    profileUser,
}: {
    profileUser: User
}) {
    const { data: session, isPending, } = useSession()

    if (isPending || !session)
        return null

    if (profileUser.id !== session?.user.id)
        return null

    return <CreatePostCard />
}

export function ProfileClient2({
    profileUser,
}: {
    profileUser: User
}) {
    const router = useRouter()
    const { data: session, isPending, } = useSession()
    const [open, setOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [formValues, setFormValues] = useState<{
        image: string | null | undefined
        name: string
    }>({
        image: "",
        name: "",
    })

    useEffect(() => {
        if (isPending || !session)
            return

        setFormValues({
            image: session.user.image,
            name: session.user.name,
        })
    }, [session])

    if (isPending || !session)
        return null

    if (profileUser.id !== session?.user.id)
        return null

    async function handleSave() {
        setError(null)

        try {
            await updateUser(formValues)
            setOpen(false)
            router.refresh()
        } catch (ex) {
            setError(ex instanceof Error ? ex.message : String(ex))
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Edit</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>Customize your profile here</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="image">Image</Label>
                        <Input
                            id="image"
                            name="image"
                            value={formValues.image ?? undefined}
                            onChange={(ev) => setFormValues((prev) => ({
                                ...prev,
                                image: ev.target.value,
                            }))}
                            placeholder="https://example.com/my-picture.png"
                        />

                        {formValues.image && (
                            <img src={formValues.image} className="w-1/4 aspect-square border rounded-md" />
                        )}
                    </div>

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
                            required
                        />
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleSave}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
