export function useCheatCodes(refreshingCheatCodes: UseState<number>) {
    function keyUp(ev: KeyboardEvent) {
        if (ev.key === "ArrowUp" && ev.shiftKey) {
            function seq(customPrompt?: string) {
                let code = prompt(customPrompt || "Enter cheat code:")

                if (!code) {
                    seq("Please enter a valid cheat code")
                    return
                }

                const shouldEnable = confirm("OK to enable, Cancel to disable")
                let cheatcodes = JSON.parse(localStorage.getItem("cheatcodes") || "{}")
                cheatcodes[code] = shouldEnable
                localStorage.setItem("cheatcodes", JSON.stringify(cheatcodes))
                refreshingCheatCodes[1](Math.random())
            }

            seq()
        }
    }

    window.addEventListener("keyup", keyUp)
    return () => window.removeEventListener("keyup", keyUp)
}

export function getCheatCodes(): Record<string, boolean> {
    return JSON.parse(localStorage.getItem("cheatcodes") || "{}")
}

export function isCheatCodeEnabled(code: string): boolean {
    const cheatcodes = getCheatCodes()
    return !!cheatcodes[code]
}
