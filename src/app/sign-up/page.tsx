import AuthPage from "@/components/oauth/page"
import SignUpCard from "@/components/sign-up"

export default async function SignUpPage({
    searchParams,
}: {
    searchParams?: Promise<{
        back?: string
        success?: string
        failiure?: string
    }>
}) {
    const params = await searchParams

    return (
        <AuthPage>
            <SignUpCard
                redirectBack={params?.back}
                redirectSuccess={params?.success ?? "/"}
                redirectFailiure={params?.failiure ?? "/"}
                showSignInLink
            />
        </AuthPage>
    )
}
