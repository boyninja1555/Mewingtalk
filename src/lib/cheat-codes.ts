export function useCheatCodes() {
    function keyUp(ev: KeyboardEvent) {
        if (ev.key === "ArrowUp" && ev.shiftKey) {
            function seq(customPrompt?: string) {
                let code = prompt(customPrompt || "Enter cheat code:")

                if (!code) {
                    seq("Please enter a valid cheat code")
                    return
                }

                const shouldEnable = confirm("Yes to enable, Cancel to disable")
                let cheatcodes = JSON.parse(localStorage.getItem("cheatcodes") || "{}")
                cheatcodes[code] = shouldEnable
                localStorage.setItem("cheatcodes", JSON.stringify(cheatcodes))
            }

            seq()
        }
    }

    window.addEventListener("keyup", keyUp)
    return () => window.removeEventListener("keyup", keyUp)
}
