import type { Metadata } from "next"
import { Roboto } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import NavBar from "@/components/nav-bar"
import "@/styles/global.css"

const roboto = Roboto({
	variable: "--font-roboto",
	subsets: ["latin"],
})

export function metadata(): Metadata {
	return {
		title: "Mewingtalk",
		description: "Talk about mewing and post pics of your jawline",
		manifest: "/manifest.json",
	}
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" className="dark">
			<body
				className={`${roboto.variable} antialiased`}
			>
				<Analytics />
				<NavBar>
					{children}
				</NavBar>
				<Toaster />
			</body>
		</html>
	)
}
