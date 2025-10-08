export function switchAuthDialog(dialog: "sign-in" | "sign-up") {
    window.dispatchEvent(new CustomEvent("switch-auth-dialog", {
        detail: dialog,
    }))
}
