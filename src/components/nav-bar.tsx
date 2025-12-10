"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { redirectSignIn } from "@/components/sign-in"
import { redirectSignUp } from "@/components/sign-up"
import { MdMenu } from "react-icons/md"
import { useHandleCache } from "@/lib/handle-cache"
import { signOut, useSession } from "@/lib/auth-client"
import { getCheatCodes, useCheatCodes } from "@/lib/cheat-codes"
import SiteLogo from "@/assets/icon.png"
import { toast } from "sonner"

export default function NavBar({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const handleCache = useHandleCache()
    const { data: session, } = useSession()
    const [open, setOpen] = useState(false)
    const [handle, setHandle] = useState<string | null>(null)
    const [refreshCheatCodes, setRefreshCheatCodes] = useState(0)
    const [cheatCodeHTMLs, setCheatCodeHTMLs] = useState<string[]>([])

    useEffect(() => {
        setHandle(handleCache.get())
    }, [handleCache])

    useEffect(() => {
        useCheatCodes([refreshCheatCodes, setRefreshCheatCodes])
    }, [])

    useEffect(() => {
        setTimeout(() => {
            const codeStates = getCheatCodes()
            Object.entries(codeStates).forEach(async ([code, state]) => {
                if (!state) {
                    setCheatCodeHTMLs(prev =>
                        prev.filter(html => html.split("|", 2)[0] !== code)
                    )
                    return
                }

                try {
                    const response = await fetch("/api/cheatcode", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            code,
                        }),
                    })
                    const data = await response.json() as ApiResponse

                    if (!data.success || !data.data)
                        throw new Error(data.message)

                    setCheatCodeHTMLs((prev) => [...prev, data.data as string])
                } catch (ex) {
                    toast(ex instanceof Error ? ex.message : String(ex))
                }
            })
        }, 1000)
    }, [refreshCheatCodes])

    return (
        <>
            <div className="flex items-center justify-between px-10 backdrop-blur-md border-b w-full h-16 top-0 left-0 fixed z-50">
                <Link href="#" className="override flex items-center gap-2 text-xl font-semibold">
                    <img src={SiteLogo.src} alt="#" className="h-8 aspect-square" />
                    <span>Mewingtalk</span>
                </Link>

                <ul className="hidden md:flex items-center gap-4">
                    <li><Link href="/">Home</Link></li>

                    {!session && (
                        <>
                            <li><button onClick={() => redirectSignIn(router, {})} className="hyperlink">Sign in</button></li>
                            <li><button onClick={() => redirectSignUp(router, {})} className="hyperlink">Sign up</button></li>
                        </>
                    )}

                    {session && (
                        <>
                            <li><Link href={handle && `/@${handle}` || "/profile"}>My profile</Link></li>
                            <li><Button onClick={() => signOut()}>Sign out</Button></li>
                        </>
                    )}
                </ul>

                <div className="block md:hidden">
                    <Drawer open={open} onOpenChange={setOpen}>
                        <DrawerTrigger asChild>
                            <Button>
                                <MdMenu />
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                            <DrawerHeader>
                                <DrawerTitle>Pages</DrawerTitle>
                            </DrawerHeader>
                            <DrawerFooter>
                                <ul onClick={() => setOpen(false)} className="flex items-center justify-center gap-4">
                                    <li><Link href="/">Home</Link></li>

                                    {!session && (
                                        <>
                                            <li><button onClick={() => redirectSignIn(router, {})} className="hyperlink">Sign in</button></li>
                                            <li><button onClick={() => redirectSignUp(router, {})} className="hyperlink">Sign up</button></li>
                                        </>
                                    )}

                                    {session && (
                                        <>
                                            <li><Link href="/profile">My profile</Link></li>
                                            <li><Button onClick={() => signOut()}>Sign out</Button></li>
                                        </>
                                    )}
                                </ul>
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                </div>
            </div>

            <div className="pt-16 w-full">
                {children}
            </div>

            <div id="cheat-codes">{cheatCodeHTMLs.map((html, index) => <div key={index} data-code={html.split("|", 2)[0]} dangerouslySetInnerHTML={{ __html: html.split("|", 2)[1], }} />)}</div>
        </>
    )
}
