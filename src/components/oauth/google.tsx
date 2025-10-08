import OAuthButton from "./button"
import GoogleLogo from "@/assets/oauth/google.svg"

export function GoogleButton({
    short,
}: {
    short?: true
}) {
    return (
        <OAuthButton
            id="google"
            name="Google"
            logo={GoogleLogo.src}
            short={short}
        />
    )
}
