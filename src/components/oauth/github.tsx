import OAuthButton from "./button"
import GithubLogo from "@/assets/oauth/github.svg"

export function GithubButton({
    short,
}: {
    short?: true
}) {
    return (
        <OAuthButton
            id="github"
            name="GitHub"
            logo={GithubLogo.src}
            short={short}
        />
    )
}
