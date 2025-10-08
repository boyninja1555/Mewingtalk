export default function AuthPage({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="w-full h-screen" style={{
            backgroundImage: "linear-gradient(var(--color-chart-2),var(--color-chart-1))",
            backgroundSize: "cover",
        }}>
            <div className="mx-auto pt-10 px-4 max-w-2xl">
                {children}
            </div>
        </div>
    )
}
