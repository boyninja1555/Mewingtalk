"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { redirectSignIn } from "@/components/sign-in"
import { redirectSignUp } from "@/components/sign-up"
import { MdMenu } from "react-icons/md"
import { signOut, useSession } from "@/lib/auth-client"
import SiteLogo from "@/assets/icon.png"

export default function NavBar({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const { data: session, } = useSession()
    const [scroll, setScroll] = useState(0)
    const navRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleScroll() {
            setScroll(window.scrollY)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    useEffect(() => {
        if (!navRef.current)
            return

        if (scroll > 0) {
            navRef.current.classList.remove("bg-secondary")
            navRef.current.classList.add("bg-transparent")
        } else {
            navRef.current.classList.remove("bg-transparent")
            navRef.current.classList.add("bg-secondary")
        }
    }, [scroll, navRef])

    return (
        <>
            <div ref={navRef} className="flex items-center justify-between px-10 bg-secondary backdrop-blur-sm transition-colors duration-300 border-b w-full h-16 top-0 left-0 fixed">
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
                            <li><Link href="/profile">My profile</Link></li>
                            <li><Button onClick={() => signOut()}>Sign out</Button></li>
                        </>
                    )}
                </ul>

                <div className="block md:hidden">
                    <Drawer>
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
                                <ul className="flex items-center justify-center gap-4">
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
        </>
    )
}
