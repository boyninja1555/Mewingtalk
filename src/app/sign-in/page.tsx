import AuthPage from "@/components/oauth/page"
import SignInCard from "@/components/sign-in"

export default async function SignInPage({
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
            <SignInCard
                redirectBack={params?.back}
                redirectSuccess={params?.success ?? "/"}
                redirectFailiure={params?.failiure ?? "/"}
                showSignUpLink
            />
        </AuthPage>
    )
}
